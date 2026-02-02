'use client';

import Navbar from '@/components/Navbar';
import { Check, Shield, Zap } from 'lucide-react';

export default function Pricing() {
  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // FIX: Send the specific Price ID for this plan
        body: JSON.stringify({
          priceId: 'price_1Q7...', // Replace this with your actual Stripe Price ID later
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout Error:", data);
        alert("Stripe configuration missing. Check console for details.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Something went wrong initiating checkout.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Invest in Your Career
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pass your journeyman exam, negotiate a higher salary, and get certified with the ultimate toolkit for skilled trades.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
          
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>

          <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> TradeHub Pro
          </h2>
          
          <div className="flex items-baseline justify-center my-8">
            <span className="text-5xl font-extrabold text-slate-900">$19</span>
            <span className="text-lg text-slate-500 font-medium ml-1">/month</span>
          </div>

          {/* Feature List */}
          <ul className="text-left space-y-5 mb-10">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700"><strong>Unlimited</strong> Practice Exams (NEC, EPA 608)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Real-time <strong>Salary Data</strong> & Market Trends</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Smart Flashcards with <strong>Spaced Repetition</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">Private Community Access</span>
            </li>
          </ul>

          <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" /> Subscribe Now
          </button>
          
          <p className="text-xs text-slate-400 mt-4">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}