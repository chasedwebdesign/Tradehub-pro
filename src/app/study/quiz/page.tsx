// src/app/study/page.tsx
'use client';

import SmartQuiz from '@/components/SmartQuiz';
import Navbar from '@/components/Navbar';
import SubscribeButton from '@/components/SubscribeButton';

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Daily Practice
          </h1>
          <p className="text-lg text-slate-600">
            Master your trade with AI-powered spaced repetition.
          </p>
        </div>
        
        {/* The Quiz Component */}
        <div className="mb-16">
           <SmartQuiz examCategory="Water Treatment Grade 1" />
        </div>

        {/* The "Go Pro" Call to Action */}
        <div className="text-center p-8 md:p-12 bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
           {/* Decorative background blob */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>

           <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Ready to pass your exam?
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Unlock unlimited practice questions, detailed explanations, and advanced progress tracking to ensure you pass on the first try.
              </p>
              
              {/* The Smart Subscribe Button */}
              <SubscribeButton />
              
              <p className="text-xs text-slate-400 mt-4">
                Secure payment via Stripe • Cancel anytime
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}