"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Eye,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Globe
} from 'lucide-react';
import Hero from '@/components/portfolio/Hero';

export default function HeroEditor() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const photoInputRef = useRef(null);
  const cvInputRef = useRef(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await axios.get('/api/admin/hero');
      const data = res.data || {};
      const formattedData = {
        id: data.id || null,
        name: data.name || '',
        availabilityStatus: data.availabilityStatus || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        profilePhoto: data.profilePhoto || '',
        cvUrl: data.cvUrl || '',
        floatingBadges: Array.isArray(data.floatingBadges) ? data.floatingBadges : [],
        decorativeText: data.decorativeText || '',
        isPublished: Boolean(data.isPublished),
      };
      setHero(formattedData);
      setPreviewData(formattedData);
    } catch (err) {
      console.error('Error fetching hero:', err);
      setStatusMessage({ type: 'error', text: 'Failed to load hero content.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreviewData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBadgeChange = (idx, field, value) => {
    const newBadges = [...(previewData.floatingBadges || [])];
    newBadges[idx][field] = value;
    setPreviewData(prev => ({ ...prev, floatingBadges: newBadges }));
  };

  const addBadge = () => {
    setPreviewData(prev => ({
      ...prev,
      floatingBadges: [...(prev.floatingBadges || []), { icon: 'Zap', text: 'New Badge' }]
    }));
  };

  const removeBadge = (idx) => {
    const newBadges = (previewData.floatingBadges || []).filter((_, i) => i !== idx);
    setPreviewData(prev => ({ ...prev, floatingBadges: newBadges }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        setPreviewData(prev => ({ ...prev, profilePhoto: res.data.url }));
        setStatusMessage({
          type: 'success',
          text: 'Profile photo uploaded! Click "Save Changes" to apply.'
        });
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to upload photo.'
      });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        setPreviewData(prev => ({ ...prev, cvUrl: res.data.url }));
        setStatusMessage({
          type: 'success',
          text: 'Resume uploaded! Click "Save Changes" to apply.'
        });
      }
    } catch (err) {
      console.error('Error uploading CV:', err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to upload resume.'
      });
    } finally {
      setUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await axios.put('/api/admin/hero', previewData);
      setHero(previewData);
      setStatusMessage({ type: 'success', text: 'Hero section updated successfully!' });
    } catch (err) {
      console.error('Error updating hero:', err);
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update hero section.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="font-bold text-slate-600">Loading hero section...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
      {/* Editor Form */}
      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Hero Content</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Personal intro &amp; visual details
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPreviewData(hero);
                  setStatusMessage({ type: '', text: '' });
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition"
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage.text && (
            <div
              className={`mb-6 flex items-center gap-3 p-4 rounded-2xl text-sm font-semibold border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Published Toggle */}
          <div className="mb-6 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue-600" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-700">Public Visibility</p>
                <p className="text-xs font-medium text-slate-500">
                  {previewData.isPublished ? 'Hero section is published on your portfolio' : 'Hero section is hidden from public'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={previewData.isPublished}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 font-bold focus:border-blue-500 outline-none transition"
                  value={previewData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Availability Status
                </label>
                <input
                  type="text"
                  name="availabilityStatus"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 font-bold focus:border-blue-500 outline-none transition"
                  value={previewData.availabilityStatus}
                  onChange={handleChange}
                  placeholder="e.g. Available for hire"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Subtitle / Headline
              </label>
              <input
                type="text"
                name="subtitle"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 font-bold focus:border-blue-500 outline-none transition"
                value={previewData.subtitle}
                onChange={handleChange}
                placeholder="e.g. Full-Stack Developer & AI Specialist"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Bio / Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 font-medium focus:border-blue-500 outline-none transition resize-none leading-relaxed"
                value={previewData.description}
                onChange={handleChange}
                placeholder="A compelling overview of your skills and background..."
              />
            </div>

            {/* Profile Photo Uploader Section */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-600" />
                  Profile Photo / Portrait
                </label>
                {previewData.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => setPreviewData(prev => ({ ...prev, profilePhoto: '' }))}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Remove Photo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Photo Preview Thumbnail */}
                <div className="flex items-center justify-center">
                  <div className="relative h-28 w-24 overflow-hidden rounded-2xl border-2 border-white bg-slate-200 shadow-md">
                    {previewData.profilePhoto ? (
                      <img
                        src={previewData.profilePhoto}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={28} />
                        <span className="text-[10px] font-bold mt-1">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Action & URL Input */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <input
                      type="file"
                      ref={photoInputRef}
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50"
                    >
                      {uploadingPhoto ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-blue-600" />
                          Uploading photo...
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="text-blue-600" />
                          Upload Picture from Computer
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-center">
                      JPG, PNG, WEBP • MAX 5MB
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Or Paste Image URL:
                    </label>
                    <input
                      type="text"
                      name="profilePhoto"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 outline-none transition"
                      placeholder="https://... or /uploads/..."
                      value={previewData.profilePhoto}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resume / CV Section */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  Resume / CV Document
                </label>
                {previewData.cvUrl && (
                  <a
                    href={previewData.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> View Current CV
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <input
                    type="file"
                    ref={cvInputRef}
                    accept=".pdf,.doc,.docx,application/pdf"
                    className="hidden"
                    onChange={handleCvUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadingCv}
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50"
                  >
                    {uploadingCv ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-blue-600" />
                        Uploading Resume...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="text-blue-600" />
                        Upload PDF Document
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-center">
                    PDF • MAX 5MB
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                    Or Enter CV / Resume Link:
                  </label>
                  <input
                    type="text"
                    name="cvUrl"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 outline-none transition"
                    placeholder="/uploads/cv.pdf or Google Drive link"
                    value={previewData.cvUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Floating Badges
                </label>
                <button
                  type="button"
                  onClick={addBadge}
                  className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Add Badge
                </button>
              </div>
              <div className="space-y-3">
                {(previewData.floatingBadges || []).map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100"
                  >
                    <input
                      type="text"
                      placeholder="Icon (e.g. Zap, Code, Shield)"
                      className="w-32 bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold"
                      value={badge.icon || ''}
                      onChange={(e) => handleBadgeChange(idx, 'icon', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Badge Text"
                      className="flex-grow bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold"
                      value={badge.text || ''}
                      onChange={(e) => handleBadgeChange(idx, 'text', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeBadge(idx)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-8 sticky top-28 h-fit">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Eye size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">Live Preview</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Real-time update visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex-grow border border-slate-100 rounded-[2rem] overflow-hidden bg-slate-50 relative">
            <div className="absolute inset-0 scale-[0.35] origin-top-left w-[285%] h-[285%] overflow-auto">
              <Hero data={previewData} socials={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
