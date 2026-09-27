"use client";
import React from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';

const EducationCertifications = ({ education, certifications }) => {
  return (
    <section id="education" className="py-14 sm:py-20 bg-slate-50/70 dark:bg-slate-900/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Education Column */}
          <div>
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 rounded-full text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-2">
                ACADEMICS
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Education
              </h2>
            </div>
            
            <div className="space-y-4">
              {(education || []).map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[2rem] sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-400/40 flex items-start gap-4 transition-all"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                    <GraduationCap size={22} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                        {item.qualification}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-400 dark:text-slate-400 whitespace-nowrap">
                        {item.startYear} – {item.endYear || 'Present'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                      {item.institution}
                    </p>
                    {item.location && (
                      <p className="text-slate-400 text-xs mt-0.5">
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div>
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/50 border border-orange-100 dark:border-orange-900/50 rounded-full text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest text-[11px] mb-2">
                CREDENTIALS
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Certifications
              </h2>
            </div>
            
            <div className="space-y-4">
              {(certifications || []).map((cert) => {
                const certUrl = cert.credentialUrl || cert.image;
                return (
                  <div
                    key={cert.id}
                    className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[2rem] sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-orange-400/40 flex items-start gap-4 transition-all"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                      <Award size={22} />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                          {certUrl ? (
                            <a
                              href={certUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{cert.name}</span>
                            </a>
                          ) : (
                            cert.name
                          )}
                        </h3>

                        {certUrl && (
                          <a
                            href={certUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center flex-shrink-0 shadow-xs active:scale-90"
                            title="Open Certificate Link"
                            aria-label={`View Certificate for ${cert.name}`}
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm">
                        {cert.organization}
                      </p>
                      
                      {cert.issueDate && (
                        <p className="text-slate-400 text-xs mt-1">
                          Issued {cert.issueDate}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EducationCertifications;
