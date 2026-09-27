"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    description: '',
    image: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    isFeatured: false,
    isPublished: true,
    order: 0,
  };

  const [formData, setFormData] = useState(initialFormState);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/admin/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      order: projects.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingItem(project);
    const techString = Array.isArray(project.technologies) 
      ? project.technologies.join(', ') 
      : project.technologies || '';

    setFormData({
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      technologies: techString,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      isFeatured: Boolean(project.isFeatured),
      isPublished: Boolean(project.isPublished),
      order: project.order || 0,
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
        showToast('success', 'Project image uploaded');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const techArray = typeof formData.technologies === 'string'
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : formData.technologies;

      const payload = {
        ...formData,
        technologies: techArray,
      };

      if (editingItem) {
        await axios.put('/api/admin/projects', { id: editingItem.id, ...payload });
        showToast('success', 'Project updated successfully');
      } else {
        await axios.post('/api/admin/projects', payload);
        showToast('success', 'New project created successfully');
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await axios.delete('/api/admin/projects', { data: { id } });
      setProjects(projects.filter(p => p.id !== id));
      showToast('success', 'Project deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to delete project');
    }
  };

  const handleToggleVisibility = async (project) => {
    try {
      const updated = { ...project, isPublished: !project.isPublished };
      await axios.put('/api/admin/projects', updated);
      setProjects(projects.map(p => p.id === project.id ? updated : p));
      showToast('success', updated.isPublished ? 'Project is now visible' : 'Project is now hidden');
    } catch (err) {
      console.error(err);
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
      {/* Toast Notification */}
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
            <Layers className="text-blue-600 dark:text-blue-400" size={26} />
            Projects Section
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Manage your featured work, live applications, and portfolio items
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between ${
              project.isPublished ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                <img 
                  src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleToggleVisibility(project)}
                    title={project.isPublished ? 'Visible on site - Click to hide' : 'Hidden - Click to show'}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-md transition-colors cursor-pointer ${
                      project.isPublished ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-900/80 text-white hover:bg-slate-900'
                    }`}
                  >
                    {project.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {project.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1 text-[10px] font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-xl uppercase tracking-widest shadow-md">
                      <Sparkles size={12} /> Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {project.title}
                  </h4>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 font-medium leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-4">
                  {project.githubUrl ? (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                      title="GitHub Repository"
                    >
                      <FaGithub size={20} />
                    </a>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700 cursor-not-allowed">
                      <FaGithub size={20} />
                    </span>
                  )}
                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-slate-400 hover:text-blue-600 transition"
                      title="Live Demo"
                    >
                      <ExternalLink size={20} />
                    </a>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700 cursor-not-allowed">
                      <ExternalLink size={20} />
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(project)}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)} 
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Project Card Button */}
        <button 
          onClick={openCreateModal}
          className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 py-12 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-500 transition group min-h-[380px] cursor-pointer"
        >
          <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-300 group-hover:text-blue-600 rounded-[2rem] flex items-center justify-center group-hover:shadow-lg transition">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="font-black text-slate-800 dark:text-white">Add Project</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create a new showcase</p>
          </div>
        </button>
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApnaHome – Rental Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe key features, challenges solved, architecture..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, PostgreSQL, Tailwind CSS"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Image Input + Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/uploads/... or https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-grow px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    Upload Image
                  </button>
                </div>
                {formData.image && (
                  <div className="mt-2 relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Featured Project
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedProj"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="isPublishedProj" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Published
                  </label>
                </div>
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
                  {editingItem ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
