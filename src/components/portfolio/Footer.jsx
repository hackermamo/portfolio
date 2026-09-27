"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send, ArrowUp, ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const IconMap = {
    Linkedin: FaLinkedin,
    Github: FaGithub,
    Youtube: FaYoutube,
    Mail: Mail,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });
    try {
      await axios.post('/api/contact', formData);
      setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again or email directly.' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroData = data?.hero || {};
  const socials = data?.socialLinks || [];

  return (
    <footer id="footer" className="bg-slate-950 text-white pt-14 sm:pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CTA Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 mb-14 sm:mb-20 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 shadow-2xl shadow-blue-900/40 text-center md:text-left">
           <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 tracking-tight">
                Let's Build Something Great
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Open to software engineering, full-stack, and GenAI opportunities. Have an idea or project? Let's connect!
              </p>
           </div>
           <a
             href="mailto:maman.cse.tcea.2026@gmail.com"
             className="w-full sm:w-auto justify-center bg-white text-blue-600 px-7 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-slate-100 transition flex items-center gap-2 shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
           >
              <span>Get In Touch</span>
              <ArrowRight size={18} />
           </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 sm:mb-20">
          {/* Contact Details & Social Links */}
          <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                Connect Directly
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
                Feel free to contact me through social channels or drop an inquiry in the form.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
              {socials.length > 0 ? (
                socials.map((social) => {
                  const Icon = IconMap[social.icon] || ExternalLink;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.platform}
                      className="w-11 h-11 flex items-center justify-center bg-slate-900 hover:bg-blue-600 rounded-2xl transition-all border border-slate-800 text-slate-300 hover:text-white shadow-sm active:scale-90"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })
              ) : (
                [
                  { icon: FaLinkedin, url: 'https://linkedin.com' },
                  { icon: FaGithub, url: 'https://github.com' },
                  { icon: FaYoutube, url: 'https://youtube.com' },
                  { icon: Mail, url: 'mailto:maman.cse.tcea.2026@gmail.com' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    className="w-11 h-11 flex items-center justify-center bg-slate-900 hover:bg-blue-600 rounded-2xl transition border border-slate-800 text-slate-300 hover:text-white shadow-sm active:scale-90"
                  >
                    <social.icon size={18} />
                  </a>
                ))
              )}
            </div>
            
            <div className="text-slate-400 space-y-2.5 font-medium text-xs sm:text-sm pt-2 inline-block sm:block text-left">
               <p className="flex items-center gap-3">
                 <Mail className="text-blue-500 flex-shrink-0" size={17} /> 
                 <span className="break-all">maman.cse.tcea.2026@gmail.com</span>
               </p>
               <p className="flex items-center gap-3">
                 <MapPin className="text-blue-500 flex-shrink-0" size={17} /> 
                 <span>Sabroom, South Tripura, India</span>
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-900/80 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-800 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-black mb-5 text-white">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                 <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition w-full text-base sm:text-sm text-white placeholder-slate-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
                 <input 
                  type="email" 
                  placeholder="Your Email" 
                  required
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition w-full text-base sm:text-sm text-white placeholder-slate-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition w-full text-base sm:text-sm text-white placeholder-slate-500"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
              <textarea 
                placeholder="Your Message..." 
                rows="3" 
                required
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition w-full resize-none text-base sm:text-sm text-white placeholder-slate-500 leading-relaxed"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
              
              <button 
                type="submit" 
                disabled={status.type === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 sm:py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-900/30 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <span>{status.type === 'loading' ? 'Sending...' : 'Send Message'}</span>
                <Send size={16} />
              </button>
              
              {status.message && (
                <p className={`text-center font-bold text-xs sm:text-sm p-2 rounded-lg ${status.type === 'success' ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Sub-bar */}
        <div className="border-t border-slate-900 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
           <p className="text-slate-500 font-medium text-xs">
             © {new Date().getFullYear()} Maman Das. All rights reserved.
           </p>
           
           <div className="flex items-center gap-4 sm:gap-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#skills" className="hover:text-white transition">Skills</a>
              <a href="#projects" className="hover:text-white transition">Projects</a>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center hover:bg-blue-600 transition border border-slate-800 text-slate-300 hover:text-white group cursor-pointer active:scale-90"
              >
                 <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
