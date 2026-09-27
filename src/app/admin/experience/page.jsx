"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Building,
  ListPlus
} from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [notification, setNotification] = useState(null);

  const logoInputRef = useRef(null);

  const initialFormState = {
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    responsibilities: [''],
    companyLogo: '',
    order: 0,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchExperiences = async () => {
    try {
      const res = await axios.get('/api/admin/experience');
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch experience records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      order: experiences.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      role: item.role || '',
      company: item.company || '',
      location: item.location || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      isCurrent: Boolean(item.isCurrent),
      responsibilities: Array.isArray(item.responsibilities) && item.responsibilities.length > 0 
        ? item.responsibilities 
        : [''],
      companyLogo: item.companyLogo || '',
      order: item.order || 0,
      isPublished: Boolean(item.isPublished),
    });
    setModalOpen(true);
  };

  const handleRespChange = (index, value) => {
    const updated = [...formData.responsibilities];
    updated[index] = value;
    setFormData({ ...formData, responsibilities: updated });
  };

  const addRespField = () => {
    setFormData({ ...formData, responsibilities: [...formData.responsibilities, ''] });
  };

  const removeRespField = (index) => {
    if (formData.responsibilities.length <= 1) return;
    const updated = formData.responsibilities.filter((_, i) => i !== index);
    setFormData({ ...formData, responsibilities: updated });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post('/api/admin/upload', fd);
      if (res.data.url) {
        setFormData(prev => ({ ...prev, companyLogo: res.data.url }));
        showToast('success', 'Company logo uploaded');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.filter(r => r && r.trim() !== ''),
      };

      if (editingItem) {
        await axios.put('/api/admin/experience', { id: editingItem.id, ...payload });
        showToast('success', 'Experience updated');
      } else {
        await axios.post('/api/admin/experience', payload);
        showToast('success', 'New experience added');
      }
      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      await axios.delete('/api/admin/experience', { data: { id } });
      setExperiences(experiences.filter(exp => exp.id !== id));
      showToast('success', 'Experience deleted');
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = { ...item, isPublished: !item.isPublished };
      await axios.put('/api/admin/experience', updated);
      setExperiences(experiences.map(exp => exp.id === item.id ? updated : exp));
      showToast('success', 'Visibility updated');
    } catch (err) {
      showToast('error', 'Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
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
            <Briefcase className="text-blue-600 dark:text-blue-400" size={26} />
            Work & Professional Experience
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Manage your employment history, internships, roles, and achievements
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      {/* List */}
      {experiences.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Briefcase className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No experience records yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add your internships, developer roles, or teaching positions</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add First Experience
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((item) => (
            <div 
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                item.isPublished ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isCurrent && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-1 rounded-lg uppercase tracking-wider">
                        Current
                      </span>
                    )}
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
                </div>

                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1">
                  {item.role}
                </h3>
                
                <p className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                  <Building size={16} className="text-slate-400 flex-shrink-0" />
                  {item.company}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {item.startDate} – {item.isCurrent ? 'Present' : (item.endDate || 'Present')}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {item.location}
                    </span>
                  )}
                </div>

                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {item.responsibilities.slice(0, 3).map((resp, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="line-clamp-2">{resp}</span>
                      </li>
                    ))}
                    {item.responsibilities.length > 3 && (
                      <li className="text-[11px] font-bold text-slate-400">
                        +{item.responsibilities.length - 3} more responsibilities
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order #{item.order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GenAI Full-Stack Developer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yupcha Software Pvt. Ltd."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote or Tripura, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jun 2025"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={formData.isCurrent}
                    placeholder={formData.isCurrent ? 'Present' : 'e.g. Jul 2025'}
                    value={formData.isCurrent ? '' : formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isCurrent" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              {/* Responsibilities list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Responsibilities & Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={addRespField}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Bullet point #${i + 1}`}
                        value={resp}
                        onChange={(e) => handleRespChange(i, e.target.value)}
                        className="flex-grow px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      {formData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRespField(i)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedExp"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isPublishedExp" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
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
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer"
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
