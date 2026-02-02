import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function StudyDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto py-16 px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Study Center
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Master your trade with our AI-powered tools. specific to your certification level.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: The Quiz (Active) */}
          <Link href="/study/quiz" className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              {/* Simple decorative icon */}
              <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Practice Quiz
            </h3>
            <p className="text-slate-600 mb-6">
              Test your knowledge with exam-style questions tailored to your trade.
            </p>
            <span className="inline-flex items-center font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              Start Quiz &rarr;
            </span>
          </Link>

          {/* Card 2: Flashcards (Placeholder for future) */}
          <div className="relative bg-slate-100 rounded-2xl p-8 border border-slate-200 opacity-75 cursor-not-allowed">
            <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Coming Soon
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-2">
              Smart Flashcards
            </h3>
            <p className="text-slate-500 mb-6">
              Memorize codes and definitions with spaced repetition learning.
            </p>
            <span className="text-slate-400 font-medium">
              Under Construction
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}