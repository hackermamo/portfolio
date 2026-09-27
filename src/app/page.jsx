"use client";
import React from 'react';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import Skills from '@/components/portfolio/Skills';
import Projects from '@/components/portfolio/Projects';
import Experience from '@/components/portfolio/Experience';
import EducationCertifications from '@/components/portfolio/EducationCertifications';
import Footer from '@/components/portfolio/Footer';
import { usePortfolio } from '@/context/PortfolioContext';

export default function Home() {
  const { data, loading, error } = usePortfolio();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
      <p className="text-xl font-bold">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <main className="relative">
      <Navbar />
      <Hero data={data.hero} socials={data.socialLinks} />
      <div id="skills"><Skills categories={data.skillCategories} /></div>
      <div id="projects"><Projects projects={data.projects} /></div>
      <div id="experience"><Experience experiences={data.experiences} /></div>
      <div id="education"><EducationCertifications education={data.education} certifications={data.certifications} /></div>
      <Footer data={data} />
    </main>
  );
}
