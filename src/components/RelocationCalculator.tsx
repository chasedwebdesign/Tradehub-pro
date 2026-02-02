'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Calculator, MapPin, ChevronDown, Check, TrendingUp } from 'lucide-react';

interface Location {
  id: string;
  city: string;
  state: string;
  cost_of_living_index: number;
}

export default function RelocationCalculator() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // User Inputs
  // usage of string | number allows us to have an empty "" state for clean deletion
  const [salary, setSalary] = useState<string | number>(75000); 
  const [originId, setOriginId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');

  // Fetch Cities on Load
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('locations')
        .select('id, city, state, cost_of_living_index')
        .order('city');
      
      setLocations(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- MATH LOGIC ---
  const origin = locations.find(l => l.id === originId);
  const target = locations.find(l => l.id === targetId);
  
  // Safe salary number (defaults to 0 if string is empty)
  const salaryNum = typeof salary === 'string' ? (parseInt(salary) || 0) : salary;

  let result = null;
  let difference = null;
  let isCheaper = false;

  if (origin && target && salaryNum > 0) {
    // Formula: Salary * (TargetCOL / OriginCOL)
    const rawResult = salaryNum * (target.cost_of_living_index / origin.cost_of_living_index);
    result = Math.round(rawResult);
    difference = Math.round(result - salaryNum);
    isCheaper = result < salaryNum;
  }

  // Handle Input Change (allows clearing to blank)
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string or digits only
    if (val === '') {
      setSalary('');
    } else {
      // Remove leading zeros if user types
      setSalary(parseInt(val));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* INPUT CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* 1. Salary Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Current Salary</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold">$</span>
              </div>
              <input
                type="number"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="0"
                className="block w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* 2. Moving From (Searchable) */}
          <CityCombobox 
            label="Moving From" 
            icon={<MapPin className="w-4 h-4 text-slate-400" />}
            locations={locations}
            selectedId={originId}
            onSelect={setOriginId}
            placeholder="Origin City..."
          />

          {/* 3. Moving To (Searchable) */}
          <CityCombobox 
            label="Moving To" 
            icon={<ArrowRight className="w-4 h-4 text-slate-400" />}
            locations={locations}
            selectedId={targetId}
            onSelect={setTargetId}
            placeholder="Target City..."
          />

        </div>
      </div>

      {/* RESULT CARD */}
      {origin && target && result !== null ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 z-10 relative">
           <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 ${isCheaper ? 'bg-green-500' : 'bg-orange-500'}`}></div>

              <div className="relative z-10">
                <p className="text-slate-400 text-lg mb-2">
                  To maintain your lifestyle in <span className="text-white font-bold">{target.city}</span>, you only need:
                </p>
                
                <div className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
                  ${result.toLocaleString()}
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isCheaper ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
                  {isCheaper ? (
                    <>
                      <TrendingUp className="w-4 h-4" /> 
                      You save ${Math.abs(difference!).toLocaleString()} per year!
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" /> 
                      It costs ${Math.abs(difference!).toLocaleString()} more per year.
                    </>
                  )}
                </div>

                <p className="mt-8 text-slate-500 text-sm max-w-xl mx-auto">
                  Cost of living in {target.city} is <strong>{Math.round((target.cost_of_living_index / origin.cost_of_living_index) * 100)}%</strong> {isCheaper ? 'lower' : 'higher'} than {origin.city}.
                </p>
              </div>
           </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
            <Calculator className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Ready to Calculate</h3>
          <p className="text-slate-500">Select two cities to see the real value of your money.</p>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENT: SEARCHABLE DROPDOWN (Combobox) ---
function CityCombobox({ label, icon, locations, selectedId, onSelect, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Get selected city name
  const selectedLoc = locations.find((l: Location) => l.id === selectedId);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Filter Logic
  const filtered = query === '' 
    ? locations 
    : locations.filter((l: Location) => 
        l.city.toLowerCase().includes(query.toLowerCase()) || 
        l.state.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">{label}</label>
      
      <div className="relative">
         {/* Icon (Left) */}
         <div className="absolute left-3 top-3.5 z-10 pointer-events-none">{icon}</div>
         
         {/* The Input Box - Click ALWAYS Opens */}
         <input 
            type="text"
            className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none truncate"
            placeholder={placeholder}
            value={isOpen ? query : (selectedLoc ? `${selectedLoc.city}, ${selectedLoc.state}` : '')}
            onChange={(e) => {
               setQuery(e.target.value);
               setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)} // Fix: Clicking input always ensures it is OPEN
         />
         
         {/* The Chevron (Right) - Click Toggles */}
         <button 
            type="button"
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer"
            onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen); // Fix: Only the arrow toggles
            }}
         >
            <ChevronDown className="w-4 h-4" />
         </button>
      </div>

      {/* The Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
           {filtered.length === 0 ? (
             <div className="p-3 text-sm text-slate-400 text-center">No cities found.</div>
           ) : (
             filtered.map((loc: Location) => (
               <div 
                 key={loc.id}
                 className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-sm text-slate-700 border-b border-slate-50 last:border-0"
                 onClick={() => {
                   onSelect(loc.id);
                   setIsOpen(false);
                   setQuery(''); // Reset search query
                 }}
               >
                 <span>{loc.city}, {loc.state}</span>
                 {selectedId === loc.id && <Check className="w-4 h-4 text-blue-600" />}
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
}