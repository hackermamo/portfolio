
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Edit2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  User,
  Share2,
  Settings,
  RefreshCw,
} from "lucide-react";

// Reusable statistics card
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  description,
}) => (
  <div className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:gap-6 sm:p-6">
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-inner sm:h-14 sm:w-14 ${color}`}
    >
      <Icon size={25} className="text-white" />
    </div>

    <div className="min-w-0 flex-grow">
      <h3 className="mb-1 text-2xl font-black text-slate-900 sm:text-3xl">
        {value ?? 0}
      </h3>

      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-xs font-medium text-slate-400">
        {description}
      </p>
    </div>
  </div>
);

// Reusable section heading
const SectionHeading = ({
  icon: Icon,
  title,
  subtitle,
  color = "bg-blue-50 text-blue-600",
  action,
}) => (
  <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${color}`}
      >
        <Icon size={24} />
      </div>

      <div>
        <h3 className="text-lg font-black text-slate-900 sm:text-xl">
          {title}
        </h3>

        <p className="mt-1 text-xs font-bold text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>

    {action}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setError("");

      const [statsRes, heroRes] = await Promise.all([
        axios.get("/api/admin/stats").catch(() => ({ data: null })),
        axios.get("/api/admin/hero").catch(() => ({ data: null }))
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (heroRes.data) setHero(heroRes.data);
    } catch (err) {
      console.error("Error fetching dashboard statistics:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const quickActions = [
    {
      icon: Edit2,
      label: "Edit Hero Section",
      href: "/admin/hero",
    },
    {
      icon: Layers,
      label: "Manage Projects",
      href: "/admin/projects",
    },
    {
      icon: Share2,
      label: "Update Social Links",
      href: "/admin/socials",
    },
    {
      icon: Settings,
      label: "Site Settings",
      href: "/admin/settings",
    },
    {
      icon: Briefcase,
      label: "Manage CV",
      href: "/admin/cv",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <RefreshCw
          size={32}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm font-semibold text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your portfolio content and monitor activity.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchData}
            className="self-start rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          icon={LayoutDashboard}
          label="Total Sections"
          value={stats?.sections ?? 0}
          color="bg-blue-600"
          description="Manage portfolio content"
        />

        <StatCard
          icon={Layers}
          label="Projects"
          value={stats?.projects ?? 0}
          color="bg-green-500"
          description="Portfolio projects"
        />

        <StatCard
          icon={Briefcase}
          label="Experience"
          value={stats?.experience ?? 0}
          color="bg-purple-500"
          description="Work and internships"
        />

        <StatCard
          icon={GraduationCap}
          label="Education"
          value={stats?.education ?? 0}
          color="bg-orange-500"
          description="Academic records"
        />

        <StatCard
          icon={Award}
          label="Certifications"
          value={stats?.certifications ?? 0}
          color="bg-red-500"
          description="Training and certificates"
        />
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Main Content */}
        <div className="min-w-0 space-y-8 lg:col-span-2 lg:space-y-10">

          {/* Hero Section */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-[2.5rem]">
            <SectionHeading
              icon={User}
              title="Hero Section"
              subtitle="Manage your introduction and profile"
              color="bg-blue-50 text-blue-600"
              action={
                <a
                  href="/admin/hero"
                  className="flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:self-auto"
                >
                  <Edit2 size={16} />
                  Edit
                </a>
              }
            />

            <div className="flex flex-col gap-8 p-6 sm:p-8 md:flex-row md:items-start md:p-10">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative group mx-auto h-48 w-40 overflow-hidden rounded-3xl border-4 border-slate-50 bg-slate-100 shadow-lg md:mx-0">
                  <img
                    src={hero?.profilePhoto || "/images/profile.jpg"}
                    alt={hero?.name || "Portfolio profile"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60";
                    }}
                  />
                  <a
                    href="/admin/hero"
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2 p-2 text-center"
                  >
                    <Edit2 size={20} />
                    <span>Change Photo</span>
                  </a>
                </div>

                <p className="mt-3 text-center text-xs font-medium text-slate-400 md:text-left">
                  Profile photo
                </p>
              </div>

              {/* Profile Information */}
              <div className="min-w-0 flex-grow space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full Name
                    </label>

                    <p className="break-words text-lg font-bold text-slate-900">
                      {hero?.name || "Maman Das"}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Subtitle
                    </label>

                    <p className="text-sm font-bold text-slate-700">
                      {hero?.subtitle || "Full-Stack Developer"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Description
                  </label>

                  <p className="text-sm leading-7 text-slate-600 line-clamp-3">
                    {hero?.description || "No description set yet. Click Edit to manage your introduction."}
                  </p>
                </div>

                <a
                  href="/admin/hero"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Update profile information &amp; photo
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-[2.5rem]">
            <SectionHeading
              icon={Layers}
              title="Projects Section"
              subtitle="Add, edit or remove your projects"
              color="bg-green-50 text-green-600"
              action={
                <a
                  href="/admin/projects"
                  className="flex items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:self-auto"
                >
                  Manage Projects
                  <ChevronRight size={16} />
                </a>
              }
            />

            <div className="p-6 sm:p-8">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <Layers
                  size={36}
                  className="mx-auto mb-4 text-slate-400"
                />

                <h4 className="font-bold text-slate-800">
                  Manage your portfolio projects
                </h4>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Open the Projects section to add new projects,
                  update existing details, upload images, and manage
                  your portfolio.
                </p>

                <a
                  href="/admin/projects"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Open Projects
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-8 lg:space-y-10">

          {/* Quick Actions */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-[2.5rem]">
            <SectionHeading
              icon={TrendingUp}
              title="Quick Actions"
              subtitle="Manage your website"
              color="bg-orange-50 text-orange-600"
            />

            <div className="grid grid-cols-1 gap-3 p-5 sm:p-6">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="group flex items-center justify-between gap-3 rounded-2xl p-4 transition hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <action.icon size={20} />
                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      {action.label}
                    </span>
                  </div>

                  <ChevronRight
                    size={18}
                    className="flex-shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </a>
              ))}
            </div>
          </section>

          {/* Recent Messages */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:rounded-[2.5rem]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-6 sm:p-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 sm:text-xl">
                  Recent Messages
                </h3>

                <p className="mt-1 text-xs font-bold text-slate-400">
                  Contact form submissions
                </p>
              </div>

              <a
                href="/admin/messages"
                className="flex-shrink-0 text-sm font-bold text-blue-600 hover:underline"
              >
                See All
              </a>
            </div>

            <div className="p-6">
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Mail size={26} />
                </div>

                <h4 className="font-bold text-slate-800">
                  View contact messages
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Check messages submitted through your portfolio
                  contact form.
                </p>

                <a
                  href="/admin/messages"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Open Messages
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}