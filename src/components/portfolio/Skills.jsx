"use client";
import React from 'react';
import { Code, Globe, Database, PenTool, Layout, CheckCircle2 } from 'lucide-react';

const Skills = ({ categories }) => {
  const IconMap = {
    'Languages': Code,
    'Web Technologies': Globe,
    'Databases': Database,
    'Developer Tools': PenTool,
  };

  return (
    <section id="skills" className="py-14 sm:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-3">
            TECHNICAL ARSENAL
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Skills & Expertise
            </h2>
            <div className="hidden sm:block h-1 w-20 bg-blue-100 dark:bg-blue-900/50 rounded-full ml-2"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {(categories || []).map((category) => {
            const Icon = IconMap[category.name] || Layout;
            return (
              <div
                key={category.id}
                className="bg-slate-50/60 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-blue-400/40 hover:-translate-y-1 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                    <div className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm flex-shrink-0">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {category.name}
                    </h3>
                  </div>
                  
                  <ul className="space-y-2.5">
                    {category.skills && category.skills.map((skill) => (
                      <li key={skill.id} className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                          {skill.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{category.skills?.length || 0} Technologies</span>
                  <span className="text-blue-600 dark:text-blue-400">Proficient</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
