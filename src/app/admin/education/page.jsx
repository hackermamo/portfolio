"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';

export default function EducationManager() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const initialFormState = {
    qualification: '',
    institution: '',
    location: '',
    startYear: '',
    endYear: '',
    description: '',
    order: 0,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchEducation = async () => {
    try {
      const res = await axios.get('/api/admin/education');
      setEducationList(res.data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch education records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      order: educationList.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      qualification: item.qualification || '',
      institution: item.institution || '',
      location: item.location || '',
      startYear: item.startYear || '',
      endYear: item.endYear || '',
      description: item.description || '',
      order: item.order || 0,
      isPublished: Boolean(item.isPublished),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await axios.put('/api/admin/education', { id: editingItem.id, ...formData });
        showToast('success', 'Education record updated');
      } else {
        await axios.post('/api/admin/education', formData);
        showToast('success', 'New education record added');
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save education record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await axios.delete('/api/admin/education', { data: { id } });
      setEducationList(educationList.filter(e => e.id !== id));
      showToast('success', 'Education entry deleted');
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = { ...item, isPublished: !item.isPublished };
      await axios.put('/api/admin/education', updated);
      setEducationList(educationList.map(e => e.id === item.id ? updated : e));
      showToast('success', 'Visibility updated');
    } catch (err) {
      showToast('error', 'Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold text-white transition-all transform animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={26} />
            Academic Background & Education
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Manage your degrees, colleges, schools, and academic qualifications
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} /> Add Degree / School
        </button>
      </div>

      {/* List */}
      {educationList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <GraduationCap className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No education entries yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add your B.Tech, schooling, or academic qualifications</p>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add First Education Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationList.map((item) => (
            <div 
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                item.isPublished ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <button
                    onClick={() => handleToggle(item)}
                    title={item.isPublished ? 'Visible on site' : 'Hidden from site'}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      item.isPublished 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {item.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-2">
                  {item.qualification}
                </h3>
                
                <p className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <Building2 size={16} className="text-slate-400 flex-shrink-0" />
                  {item.institution}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {item.startYear} – {item.endYear || 'Present'}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {item.location}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 font-normal leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order #{item.order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Education Entry' : 'Add Education Entry'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech in Computer Science and Engineering"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Institution / College / School
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Techno College of Engineering, Agartala"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Location (City / State)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Agartala, Tripura"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Start Year
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2022"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    End Year
                  </label>
                  <input
                    type="text"
                    placeholder="2026 or Present"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Additional Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Key coursework, honors, GPA or focus area..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedEdu"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isPublishedEdu" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Publish to portfolio
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition cursor-pointer"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingItem ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
