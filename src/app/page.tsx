import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LocationSearch from '@/components/LocationSearch';
import { MapPin, BookOpen, TrendingUp, Calculator } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs mb-8 uppercase tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Live 2026 Data
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
          Master Your Trade. <br />
          <span className="text-blue-700">Maximize Your Income.</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          The ultimate career operating system for skilled trades. 
          Check market rates, prepare for exams, and negotiate better pay.
        </p>

        {/* --- DYNAMIC SEARCH BAR --- */}
        <div className="mb-8 relative z-10">
           <LocationSearch />
        </div>

        {/* Popular Cities Links */}
        <div className="flex gap-4 justify-center items-center text-sm text-slate-500">
           <span className="hidden md:inline">Popular:</span>
           <Link href="/salary/water-treatment/new-york-ny" className="hover:text-blue-600 underline">New York</Link>
           <Link href="/salary/water-treatment/austin-tx" className="hover:text-blue-600 underline">Austin</Link>
           <Link href="/salary/water-treatment/los-angeles-ca" className="hover:text-blue-600 underline">Los Angeles</Link>
        </div>
        
        {/* CTA Button */}
        <div className="mt-8">
           <Link href="/study/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm">
             <BookOpen className="w-4 h-4" />
             Take Free Practice Exam
           </Link>
        </div>

      </section>

      {/* Features Grid (Now Clickable!) */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Map */}
          <Link href="/map" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-700 transition-colors">Purchasing Power Map</h3>
            <p className="text-slate-500">Stop guessing. Visualize exactly where your trade skills are worth the most across the USA.</p>
          </Link>

          {/* Card 2: Quiz */}
          <Link href="/study/quiz" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-green-700 transition-colors">Smart Exam Prep</h3>
            <p className="text-slate-500">Our AI tutor uses spaced repetition to help you pass your certification exams faster.</p>
          </Link>

          {/* Card 3: Calculator */}
          <Link href="/calculator" className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 mb-6 group-hover:scale-110 transition-transform">
              <Calculator size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-purple-700 transition-colors">Relocation Calculator</h3>
            <p className="text-slate-500">Thinking of moving? Compare your purchasing power between any two cities instantly.</p>
          </Link>

        </div>
      </section>
    </div>
  );
}