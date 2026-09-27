"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, GripVertical } from 'lucide-react';

export default function SkillsManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('/api/admin/skills');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id, type) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete('/api/admin/skills', { data: { id, type } });
      fetchSkills();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
         <div>
            <h3 className="text-2xl font-black text-slate-900">Technical Skills</h3>
            <p className="text-sm font-bold text-slate-400">Manage categories and technology stack items</p>
         </div>
         <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-200">
            <Plus size={20} /> New Category
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {categories.map((cat) => (
           <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                       <GripVertical size={20} className="text-slate-300" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">{cat.name}</h4>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition"><Edit2 size={18} /></button>
                    <button onClick={() => deleteSkill(cat.id, 'category')} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
                 </div>
              </div>
              
              <div className="space-y-3">
                 {cat.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-bold text-slate-700 text-sm">{skill.name}</span>
                       </div>
                       <button onClick={() => deleteSkill(skill.id, 'skill')} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition">
                          <X size={16} />
                       </button>
                    </div>
                 ))}
                 
                 <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition">
                    + Add Skill to {cat.name}
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
