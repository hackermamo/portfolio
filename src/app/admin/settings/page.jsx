"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Settings, 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function SiteSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [notification, setNotification] = useState(null);

  const resumeInputRef = useRef(null);

  const [settings, setSettings] = useState({
    siteTitle: '',
    metaDescription: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    resumeUrl: '',
    copyrightText: '',
    enableContactForm: true,
    showAvailabilityBadge: true,
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/admin/settings');
      if (res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post('/api/admin/upload', fd);
      if (res.data.url) {
        setSettings(prev => ({ ...prev, resumeUrl: res.data.url }));
        showToast('success', 'Resume document uploaded');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to upload resume file');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/admin/settings', settings);
      showToast('success', 'Site settings saved successfully');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
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
    <div className="space-y-8 max-w-5xl">
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
            <Settings className="text-blue-600 dark:text-blue-400" size={26} />
            Site & SEO Settings
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Configure global website metadata, contact details, and resume files
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SEO & Meta Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="text-blue-600" size={20} />
              Website & SEO Identity
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              These details determine how your website appears on Google and social media preview cards
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Website Meta Title
              </label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                placeholder="Maman Das - Full-Stack Developer & AI Specialist"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Search Engine Description (Meta Description)
              </label>
              <textarea
                name="metaDescription"
                rows={3}
                value={settings.metaDescription}
                onChange={handleChange}
                placeholder="Full-stack portfolio showcasing web applications, machine learning projects, and generative AI solutions..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="text-indigo-600" size={20} />
              Contact & Location Information
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Information displayed in the footer and contact sections
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  placeholder="maman.cse.tcea.2026@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Contact Phone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Location / City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  name="location"
                  value={settings.location}
                  onChange={handleChange}
                  placeholder="Sabroom, South Tripura, India"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resume & Documents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-emerald-600" size={20} />
              Resume & CV File
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Upload your PDF resume or provide an external Google Drive / Dropbox link
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Resume URL / Direct Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="resumeUrl"
                value={settings.resumeUrl}
                onChange={handleChange}
                placeholder="/uploads/resume.pdf or https://drive.google.com/..."
                className="flex-grow px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <input 
                type="file" 
                ref={resumeInputRef} 
                onChange={handleResumeUpload} 
                accept=".pdf,.doc,.docx" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={uploadingResume}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload PDF
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Footer Copyright Text
            </label>
            <input
              type="text"
              name="copyrightText"
              value={settings.copyrightText}
              onChange={handleChange}
              placeholder="© 2026 Maman Das. All rights reserved."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Feature Switches */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} />
            Site Preferences & Toggles
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Enable Contact Form</p>
                <p className="text-xs text-slate-400">Allow visitors to submit direct messages through the contact form</p>
              </div>
              <input
                type="checkbox"
                name="enableContactForm"
                checked={settings.enableContactForm}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Show &quot;Available for Hire&quot; Badge</p>
                <p className="text-xs text-slate-400">Displays a pulsing green status indicator on the hero section</p>
              </div>
              <input
                type="checkbox"
                name="showAvailabilityBadge"
                checked={settings.showAvailabilityBadge}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-blue-500/25 transition cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
