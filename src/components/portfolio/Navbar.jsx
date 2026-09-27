"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun, Home, Code, Layers, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolio } from '@/context/PortfolioContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { data } = usePortfolio();
  const cvUrl = data?.hero?.cvUrl || null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '#', icon: Home },
    { name: 'Skills', href: '#skills', icon: Code },
    { name: 'Projects', href: '#projects', icon: Layers },
    { name: 'Experience', href: '#experience', icon: Briefcase },
    { name: 'Education', href: '#education', icon: GraduationCap },
    { name: 'Contact', href: '#footer', icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-800/80 py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-11">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="flex items-center gap-1.5 focus:outline-none">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/30">
                  M
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                  MAMAN <span className="text-slate-900 dark:text-white transition-colors">DAS</span>
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              <div className="flex items-center space-x-3 ml-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                >
                  {isDark ? (
                    <Sun size={19} className="transition-transform duration-300 hover:rotate-45" />
                  ) : (
                    <Moon size={19} className="transition-transform duration-300 hover:-rotate-12" />
                  )}
                </button>

                <a
                  href={cvUrl || '#footer'}
                  target={cvUrl ? '_blank' : '_self'}
                  rel={cvUrl ? 'noreferrer' : undefined}
                  download={cvUrl ? true : undefined}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-2 text-sm"
                >
                  Download CV <Download size={15} />
                </a>
              </div>
            </div>

            {/* Mobile Actions Header */}
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-amber-400 flex items-center justify-center transition active:scale-95 shadow-sm cursor-pointer"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center transition active:scale-95 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay & Sheet */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white dark:bg-slate-900 rounded-t-[2.5rem] border-t border-slate-200 dark:border-slate-800 px-6 pt-6 pb-8 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Navigation Menu</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">Where to next?</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-100 dark:border-slate-800 font-bold text-sm transition active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <span>{link.name}</span>
                  </a>
                );
              })}
            </div>

            <a
              href={cvUrl || '#footer'}
              target={cvUrl ? '_blank' : '_self'}
              rel={cvUrl ? 'noreferrer' : undefined}
              download={cvUrl ? true : undefined}
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 active:scale-98 transition"
            >
              {cvUrl ? 'Download CV' : 'Get In Touch'} <Download size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

