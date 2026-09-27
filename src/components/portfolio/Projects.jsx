"use client";
import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-3">
              PORTFOLIO SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Work
            </h2>
          </div>
          <a 
            href="#footer" 
            className="hidden sm:inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all border-2 border-blue-600/30 dark:border-blue-500/30 px-5 py-2.5 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-sm cursor-pointer"
          >
            <span>Discuss a Project</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(projects || []).map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400/40 group transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={project.image || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60`} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                
                <div className="p-5 sm:p-7">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-5 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {project.technologies && project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-7 sm:pb-7 pt-2">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <a 
                    href={project.liveUrl || '#'} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all text-xs sm:text-sm active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>Demo</span>
                    <ExternalLink size={14} />
                  </a>
                  <a 
                    href={project.githubUrl || '#'} 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-all text-xs sm:text-sm active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>Code</span>
                    <FaGithub size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
