"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Download, Code, Brain, Zap, Mail, ArrowDown } from 'lucide-react';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Hero = ({ data, socials }) => {
  if (!data) return null;

  const IconMap = {
    Code: Code,
    Brain: Brain,
    Zap: Zap,
    Linkedin: FaLinkedin,
    Github: FaGithub,
    Youtube: FaYoutube,
    Mail: Mail
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
            
            {/* Availability Badge */}
            {data.availabilityStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold shadow-sm"
              >
                <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                <span>{data.availabilityStatus}</span>
              </motion.div>
            )}

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1 sm:space-y-2"
            >
              <p className="text-base sm:text-xl font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                Hi, I am
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                {data.name?.split(' ')[0] || ''} <span className="text-blue-600 dark:text-blue-400">{data.name?.split(' ').slice(1).join(' ') || ''}</span>
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
                {data.subtitle}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal"
            >
              {data.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2"
            >
              <a
                href="#projects"
                className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 sm:py-4 rounded-2xl font-black transition flex items-center gap-2 shadow-xl shadow-blue-500/25 active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <span>View My Projects</span>
                <ExternalLink size={18} />
              </a>

              {data.cvUrl && (
                <a
                  href={data.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto justify-center bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-7 py-3.5 sm:py-4 rounded-2xl font-black transition flex items-center gap-2 active:scale-95 text-sm sm:text-base cursor-pointer"
                >
                  <span>Download CV</span>
                  <Download size={18} />
                </a>
              )}
            </motion.div>

            {/* Social Links Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-2.5 pt-2"
            >
              {(socials || []).map((link) => {
                const Icon = IconMap[link.icon] || ExternalLink;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform || 'Social Link'}
                    className="w-11 h-11 flex items-center justify-center bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl border border-slate-800 dark:border-slate-700 transition-all shadow-md active:scale-90 cursor-pointer"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>

            {/* Mobile Pill Badges (Visible on mobile screens) */}
            {data.floatingBadges && data.floatingBadges.length > 0 && (
              <div className="lg:hidden flex flex-wrap justify-center gap-2 pt-3">
                {data.floatingBadges.map((badge, idx) => {
                  const Icon = IconMap[badge.icon] || Zap;
                  return (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm"
                    >
                      <Icon size={14} className="text-blue-600 dark:text-blue-400" />
                      {badge.text}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Portrait Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center order-1 lg:order-2 w-full">
            <div className="relative w-56 sm:w-72 md:w-80 lg:w-full max-w-sm aspect-[4/5] sm:aspect-[3/4]">
              {/* Decorative Rotated Backdrops */}
              <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-3 scale-95 opacity-15 dark:opacity-25 blur-sm" />
              <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] -rotate-3 scale-95 opacity-15 dark:opacity-25 blur-sm" />
              
              {/* Photo Card */}
              <div className="relative h-full w-full bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                <img 
                  src={data.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60"} 
                  alt={data.name || "Profile"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              </div>

              {/* Desktop Floating Badges */}
              {data.floatingBadges && data.floatingBadges.map((badge, idx) => {
                const Icon = IconMap[badge.icon] || Zap;
                const positions = [
                  "-top-4 -left-6",
                  "-bottom-4 -right-6",
                  "top-1/2 -right-8 -translate-y-1/2"
                ];
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + (idx * 0.1), type: 'spring' }}
                    className={`absolute ${positions[idx] || ""} hidden lg:flex items-center gap-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-20`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">{badge.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
