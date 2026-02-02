'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Loader2 } from 'lucide-react';

export default function LocationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Search Supabase when user types
  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from('locations')
        .select('city, state, slug')
        .ilike('city', `${query}%`) // Case-insensitive search
        .limit(5);

      setResults(data || []);
      setLoading(false);
      setIsOpen(true);
    };

    const timeoutId = setTimeout(searchCities, 300); // Wait 300ms after typing
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (slug: string) => {
    // Defaulting to 'water-treatment' for now. 
    // In the future, we can add a Trade dropdown too.
    router.push(`/salary/water-treatment/${slug}`);
  };

  return (
    <div className="relative max-w-lg w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
          placeholder="Enter your city (e.g. Austin, Denver)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {results.map((city) => (
            <button
              key={city.slug}
              onClick={() => handleSelect(city.slug)}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-slate-900">{city.city}</span>
                <span className="text-slate-500">, {city.state}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && results.length === 0 && query.length > 2 && !loading && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 p-4 text-center text-slate-500">
          No cities found. Try a major US city.
        </div>
      )}
    </div>
  );
}