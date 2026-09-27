"use client";
import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const Experience = ({ experiences }) => {
  return (
    <section id="experience" className="py-14 sm:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-3">
            CAREER PATH
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Work Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {(experiences || []).map((exp) => (
            <div key={exp.id} className="relative flex flex-col">
              <div className="bg-slate-50/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] sm:rounded-3xl p-5 sm:p-7 hover:shadow-xl hover:border-blue-400/40 transition-all flex flex-col justify-between h-full">
                <div>
                  {/* Header Row */}
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
                      <Briefcase size={22} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                        {exp.role}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  
                  {/* Meta Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-5">
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                      <Calendar size={13} className="text-blue-500" />
                      <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                        <MapPin size={13} className="text-blue-500" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Responsibilities list */}
                  <ul className="space-y-2.5">
                    {exp.responsibilities && exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
