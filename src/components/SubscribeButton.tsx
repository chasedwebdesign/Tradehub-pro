'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();

      if (data.coming_soon) {
        alert("🔒 Pro Membership is coming soon! Check back later.");
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout failed', data);
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5 text-yellow-300" />
      )}
      <span>{loading ? 'Loading...' : 'Unlock Pro Access'}</span>
    </button>
  );
}