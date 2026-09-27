"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Palette, 
  Save, 
  Sun, 
  Moon, 
  Monitor, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Code
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa' },
  { name: 'Emerald Isle', primary: '#059669', secondary: '#10b981', accent: '#34d399' },
  { name: 'Violet Luxe', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' },
  { name: 'Sunset Amber', primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' },
  { name: 'Neon Rose', primary: '#e11d48', secondary: '#f43f5e', accent: '#fb7185' },
  { name: 'Cyber Cyan', primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee' },
];

export default function AppearanceManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [appearance, setAppearance] = useState({
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    defaultTheme: 'dark',
    fontHeading: 'Inter',
    heroPattern: 'grid',
    showGlowEffects: true,
    enableAnimations: true,
    customCss: '',
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchAppearance = async () => {
    try {
      const res = await axios.get('/api/admin/appearance');
      if (res.data) {
        setAppearance(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch appearance settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppearance();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearance(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const selectPreset = (preset) => {
    setAppearance(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/admin/appearance', appearance);
      showToast('success', 'Appearance preferences saved');
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to save appearance');
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
            <Palette className="text-blue-600 dark:text-blue-400" size={26} />
            Theme & Appearance
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Customize your brand colors, background patterns, and styling effects
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Appearance
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Color Palette Presets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-blue-600" size={20} />
              Brand Color Palette
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Choose a curated color scheme or configure custom hex values
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">
              Preset Themes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {COLOR_PRESETS.map((p) => {
                const isSelected = appearance.primaryColor.toLowerCase() === p.primary.toLowerCase();
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => selectPreset(p)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: p.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: p.secondary }} />
                      <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: p.accent }} />
                    </div>
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{p.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={appearance.primaryColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={appearance.primaryColor}
                  onChange={handleChange}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Secondary Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={appearance.secondaryColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={appearance.secondaryColor}
                  onChange={handleChange}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Highlight / Glow Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  value={appearance.accentColor}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={appearance.accentColor}
                  onChange={handleChange}
                  className="flex-grow px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Component Color Preview
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            Preview of how buttons, badges, and gradients reflect your chosen palette
          </p>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white flex flex-wrap items-center gap-4">
            <button
              type="button"
              style={{ backgroundColor: appearance.primaryColor }}
              className="px-6 py-3 rounded-2xl font-black text-sm text-white shadow-lg transition hover:opacity-90"
            >
              Primary Button
            </button>

            <span
              style={{ 
                backgroundColor: `${appearance.primaryColor}25`,
                color: appearance.accentColor || appearance.primaryColor,
                borderColor: `${appearance.primaryColor}50`
              }}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider"
            >
              Category Badge
            </span>

            <div 
              style={{
                background: `linear-gradient(135deg, ${appearance.primaryColor}, ${appearance.secondaryColor})`
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-md"
            >
              Gradient Banner
            </div>
          </div>
        </div>

        {/* Theme & Display Options */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="text-purple-600" size={20} />
              Theme & Display Options
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Control the default theme mode and animation behavior
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Default Theme Mode
              </label>
              <select
                name="defaultTheme"
                value={appearance.defaultTheme}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="dark">Dark Theme (Recommended)</option>
                <option value="light">Light Theme</option>
                <option value="system">Follow System Setting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Hero Background Pattern
              </label>
              <select
                name="heroPattern"
                value={appearance.heroPattern}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="grid">Geometric Mesh Grid</option>
                <option value="dots">Subtle Dot Matrix</option>
                <option value="waves">Fluid Wave Lines</option>
                <option value="minimal">Minimal / Clean Gradient</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Enable Glow & Blur Effects</p>
                <p className="text-xs text-slate-400">Renders soft ambient backdrop glows behind hero elements and cards</p>
              </div>
              <input
                type="checkbox"
                name="showGlowEffects"
                checked={appearance.showGlowEffects}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Enable Micro-Animations</p>
                <p className="text-xs text-slate-400">Enables card lift, smooth hover interactions, and subtle transitions</p>
              </div>
              <input
                type="checkbox"
                name="enableAnimations"
                checked={appearance.enableAnimations}
                onChange={handleChange}
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Custom CSS overrides */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="text-slate-400" size={20} />
            Custom CSS Overrides (Advanced)
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            Inject custom CSS rules to fine-tune styles across the entire website
          </p>

          <textarea
            name="customCss"
            rows={4}
            value={appearance.customCss}
            onChange={handleChange}
            placeholder="/* e.g. .custom-class { font-weight: 700; } */"
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-blue-500/25 transition cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Appearance
          </button>
        </div>
      </form>
    </div>
  );
}
