"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  Building
} from 'lucide-react';

export default function CertificationsManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    organization: '',
    issueDate: '',
    image: '',
    credentialUrl: '',
    order: 0,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCerts = async () => {
    try {
      const res = await axios.get('/api/admin/certifications');
      setCerts(res.data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch certifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      order: certs.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      organization: item.organization || '',
      issueDate: item.issueDate || '',
      image: item.image || '',
      credentialUrl: item.credentialUrl || '',
      order: item.order || 0,
      isPublished: Boolean(item.isPublished),
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post('/api/admin/upload', fd);
      if (res.data.url) {
        setFormData(prev => ({ ...prev, image: res.data.url }));
        showToast('success', 'Certificate image uploaded');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to upload certificate image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await axios.put('/api/admin/certifications', { id: editingItem.id, ...formData });
        showToast('success', 'Certification updated');
      } else {
        await axios.post('/api/admin/certifications', formData);
        showToast('success', 'New certification created');
      }
      setModalOpen(false);
      fetchCerts();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await axios.delete('/api/admin/certifications', { data: { id } });
      setCerts(certs.filter(c => c.id !== id));
      showToast('success', 'Certification deleted');
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = { ...item, isPublished: !item.isPublished };
      await axios.put('/api/admin/certifications', updated);
      setCerts(certs.map(c => c.id === item.id ? updated : c));
      showToast('success', 'Status updated');
    } catch (err) {
      showToast('error', 'Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
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
            <Award className="text-orange-500" size={26} />
            Certifications & Training
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Showcase your completed accredited certifications and awards
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} /> Add Certification
        </button>
      </div>

      {/* List */}
      {certs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Award className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No certifications added</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add your internships, courses, and certifications</p>
          <button
            onClick={openCreateModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add First Certification
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((item) => (
            <div 
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                item.isPublished ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Award size={24} />
                  </div>
                  <div className="flex items-center gap-2">
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

                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-2">
                  {item.name}
                </h3>
                
                <p className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <Building size={16} className="text-slate-400 flex-shrink-0" />
                  {item.organization}
                </p>

                {item.issueDate && (
                  <p className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
                    <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                    Issued: {item.issueDate}
                  </p>
                )}

                {item.credentialUrl && (
                  <div className="mb-4">
                    <a 
                      href={item.credentialUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Order #{item.order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
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
                {editingItem ? 'Edit Certification' : 'Add Certification'}
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
                  Certification / Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GenAI Full-Stack Developer Internship"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yupcha Software / NIELIT / Coursera"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2025 or Jul 2023"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
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
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Credential URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://credential-link.com"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Certificate Image / Badge */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Certificate Image / Logo URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/uploads/... or https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-grow px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*,.pdf" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
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
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition cursor-pointer"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
