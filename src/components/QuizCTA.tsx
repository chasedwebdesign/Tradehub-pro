'use client';

import Link from 'next/link';
import { ArrowRight, BrainCircuit, Trophy } from 'lucide-react';

// Map URL slugs (e.g., 'electrician') to DB Categories (e.g., 'Electrical')
const TRADE_MAP: Record<string, string> = {
  'electrician': 'Electrical',
  'plumber': 'Plumbing',
  'hvac': 'HVAC',
  'water-treatment': 'Water Treatment Grade 1', // Matches your DB exactly
};

export default function QuizCTA({ trade, city }: { trade: string; city: string }) {
  // Default to Water Treatment if trade not found, or handle gracefully
  const dbCategory = TRADE_MAP[trade] || 'General Trade';
  
  return (
    <div className="my-12 bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden group">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-32 -mt-32 transition-opacity group-hover:opacity-30"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-800">
            <BrainCircuit className="w-4 h-4" />
            Skill Assessment
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Prove your skills in {city.replace('-', ' ')}
          </h2>
          <p className="text-slate-400 max-w-lg text-lg">
            Don't just look at salaries—earn them. Take our free <strong>{dbCategory}</strong> practice exam and boost your earning potential.
          </p>
        </div>

        <Link 
          href={`/study/quiz?category=${encodeURIComponent(dbCategory)}`}
          className="whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          Start Practice Quiz <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}