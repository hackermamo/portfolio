"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  Share2, 
  Globe, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaYoutube, 
  FaTwitter, 
  FaInstagram, 
  FaDiscord 
} from 'react-icons/fa';
import { SiLeetcode, SiCodechef } from 'react-icons/si';

const ICON_OPTIONS = [
  { label: 'LinkedIn', value: 'Linkedin', icon: FaLinkedin },
  { label: 'GitHub', value: 'Github', icon: FaGithub },
  { label: 'YouTube', value: 'Youtube', icon: FaYoutube },
  { label: 'Email', value: 'Mail', icon: Mail },
  { label: 'Twitter / X', value: 'Twitter', icon: FaTwitter },
  { label: 'Instagram', value: 'Instagram', icon: FaInstagram },
  { label: 'Discord', value: 'Discord', icon: FaDiscord },
  { label: 'LeetCode', value: 'LeetCode', icon: SiLeetcode },
  { label: 'CodeChef', value: 'CodeChef', icon: SiCodechef },
  { label: 'Website / Globe', value: 'Globe', icon: Globe },
];

export default function SocialsManager() {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const initialFormState = {
    platform: '',
    url: '',
    icon: 'Linkedin',
    order: 0,
    isEnabled: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchSocials = async () => {
    try {
      const res = await axios.get('/api/admin/socials');
      setSocials(res.data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch social links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      order: socials.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      platform: item.platform,
      url: item.url,
      icon: item.icon,
      order: item.order,
      isEnabled: item.isEnabled,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await axios.put('/api/admin/socials', { id: editingItem.id, ...formData });
        showToast('success', 'Social link updated successfully');
      } else {
        await axios.post('/api/admin/socials', formData);
        showToast('success', 'New social link added');
      }
      setModalOpen(false);
      fetchSocials();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save social link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    try {
      await axios.delete('/api/admin/socials', { data: { id } });
      setSocials(socials.filter(s => s.id !== id));
      showToast('success', 'Social link deleted');
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = { ...item, isEnabled: !item.isEnabled };
      await axios.put('/api/admin/socials', updated);
      setSocials(socials.map(s => s.id === item.id ? updated : s));
      showToast('success', `Status updated`);
    } catch (err) {
      showToast('error', 'Failed to update visibility');
    }
  };

  const renderIcon = (iconName) => {
    const found = ICON_OPTIONS.find(o => o.value.toLowerCase() === (iconName || '').toLowerCase());
    if (found) {
      const Comp = found.icon;
      return <Comp size={20} />;
    }
    return <Globe size={20} />;
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
            <Share2 className="text-blue-600 dark:text-blue-400" size={26} />
            Social Profiles & Links
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Connect your audience to your online profiles across platforms
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} /> Add Social Link
        </button>
      </div>

      {/* List / Cards */}
      {socials.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Share2 className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No social links yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Add your LinkedIn, GitHub, or other accounts</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add First Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socials.map((item) => (
            <div 
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                item.isEnabled ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      {renderIcon(item.icon)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                        {item.platform}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Order #{item.order}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(item)}
                    title={item.isEnabled ? 'Enabled - Click to disable' : 'Disabled - Click to enable'}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      item.isEnabled 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {item.isEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl px-3 py-2.5 mb-4 border border-slate-100 dark:border-slate-800/80">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate block hover:underline flex items-center gap-1.5"
                  >
                    <span className="truncate">{item.url}</span>
                    <ExternalLink size={12} className="flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  title="Edit link"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  title="Delete link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Social Link' : 'Add New Social Link'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LinkedIn, GitHub, X"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Target URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
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

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isEnabled" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Display this link on public portfolio
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
                  {editingItem ? 'Save Changes' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
