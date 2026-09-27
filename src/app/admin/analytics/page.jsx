"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Download, 
  ExternalLink, 
  Clock, 
  Calendar,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState({ totalEvents: 0, events: [], typeCounts: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { totalEvents, events, typeCounts } = data;

  const stats = [
    { label: 'Total Page Views', value: typeCounts['page_view'] || totalEvents, icon: Eye, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
    { label: 'Project Clicks', value: typeCounts['project_click'] || 0, icon: ExternalLink, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
    { label: 'Resume Downloads', value: typeCounts['resume_download'] || 0, icon: Download, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'Contact Submissions', value: typeCounts['contact_submit'] || 0, icon: Activity, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="text-blue-600 dark:text-blue-400" size={26} />
          Portfolio Traffic & Analytics
        </h2>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          Monitor real-time visitors, engagement, and portfolio interaction events
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  Live <ArrowUpRight size={14} />
                </span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Events Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="text-slate-400" size={20} />
          Recent Interaction Stream
        </h3>

        {events.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No interaction events logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Event Type</th>
                  <th className="pb-3 font-bold">IP / Location</th>
                  <th className="pb-3 font-bold">Device / Agent</th>
                  <th className="pb-3 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.slice(0, 15).map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 font-bold text-blue-600 dark:text-blue-400">
                      {evt.eventType}
                    </td>
                    <td className="py-3.5 text-slate-500 font-mono">
                      {evt.ipAddress || 'Internal'}
                    </td>
                    <td className="py-3.5 text-slate-400 max-w-xs truncate">
                      {evt.userAgent || 'Web Browser'}
                    </td>
                    <td className="py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(evt.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
