"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/login', formData);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-black text-blue-500 tracking-tighter mb-2">MAMAN <span className="text-white">DAS</span></h1>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Portfolio Administration</p>
        </div>
        
        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 md:p-10 shadow-2xl">
           <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 font-medium">Please enter your credentials to continue.</p>
           </div>
           
           {error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
                <ShieldAlert size={20} />
                {error}
             </div>
           )}
           
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400 ml-1">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="email"
                      required
                      placeholder="admin@mamandas.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-slate-400">Password</label>
                    <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-400">Forgot?</a>
                 </div>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 outline-none focus:border-blue-500 transition-colors"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 py-4 rounded-xl text-white font-black text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40"
              >
                {loading ? 'Authenticating...' : 'Sign In'} <LogIn size={20} />
              </button>
           </form>
        </div>
        
        <p className="text-center mt-10 text-slate-600 text-sm font-medium">
           Protected Area. Authorized Personnel Only.
        </p>
      </div>
    </div>
  );
}
