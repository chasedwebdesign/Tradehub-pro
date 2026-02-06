'use client';

import { useState, useEffect } from 'react';
import USAMap from 'react-usa-map';
import { supabase } from '@/lib/supabase';
import { Loader2, TrendingUp, TrendingDown, DollarSign, MapPin } from 'lucide-react';

// Darker Green Palette
const GREEN_SCALE = {
  lowest: '#86efac',  // Light Green
  low: '#4ade80',     // Bright Green
  medium: '#22c55e',  // Standard Green
  high: '#16a34a',    // Dark Green
  highest: '#14532d', // Deep Forest Green
};

export default function SalaryMap() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any>(null);

  useEffect(() => {
    async function fetchMapData() {
      const { data } = await supabase.from('state_stats').select('*');
      setStats(data || []);
      setLoading(false);
    }
    fetchMapData();
  }, []);

  const getColor = (power: number) => {
    if (power > 78000) return GREEN_SCALE.highest;
    if (power > 68000) return GREEN_SCALE.high;
    if (power > 58000) return GREEN_SCALE.medium;
    if (power > 50000) return GREEN_SCALE.low;
    return GREEN_SCALE.lowest;
  };

  const getStateConfig = () => {
    const config: any = {};
    stats.forEach((state) => {
      config[state.state] = { 
        fill: getColor(state.purchasing_power),
        title: `${state.state}: Avg Salary $${state.avg_salary.toLocaleString()}` 
      };
    });
    return config;
  };

  const mapHandler = (event: any) => {
    const stateAbbr = event.target.dataset.name;
    const stateData = stats.find((s) => s.state === stateAbbr);
    setSelectedState(stateData ? { ...stateData, abbr: stateAbbr } : null);
    document.getElementById('state-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="flex flex-col xl:flex-row gap-8 items-start mb-12">
        {/* MAP */}
        <div className="flex-1 w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-2 md:p-6 overflow-hidden relative">
          <div className="w-full overflow-x-auto">
             <USAMap 
                customize={getStateConfig()} 
                onClick={mapHandler} 
                defaultFill="#e2e8f0"
                width="100%" 
                className="h-auto" 
             />
          </div>
          <div className="text-center text-xs text-slate-400 mt-6 font-medium uppercase tracking-wider">
            Hover for salary • Click state for full analysis
          </div>
        </div>

        {/* LEGEND - RENAMED */}
        <div className="w-full xl:w-72 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit shrink-0">
          <h3 className="font-bold text-slate-900 mb-4">True Earnings</h3>
          <p className="text-xs text-slate-500 mb-6">How far your paycheck actually goes.</p>
          
          <div className="space-y-3 text-sm font-medium text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md shadow-sm border-2 border-white" style={{backgroundColor: GREEN_SCALE.highest}}></div>
              <span>Elite Value</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md shadow-sm border-2 border-white" style={{backgroundColor: GREEN_SCALE.high}}></div>
              <span>Great Value</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md shadow-sm border-2 border-white" style={{backgroundColor: GREEN_SCALE.medium}}></div>
              <span>Good Value</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md shadow-sm border-2 border-white" style={{backgroundColor: GREEN_SCALE.low}}></div>
              <span>Average Value</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md shadow-sm border-2 border-white" style={{backgroundColor: GREEN_SCALE.lowest}}></div>
              <span>Expensive Living</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS CARD - RENAMED */}
      <div id="state-details" className="scroll-mt-10">
      {selectedState ? (
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-3xl opacity-10 -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
            <div>
                <div className="flex items-center gap-2 text-green-400 font-bold mb-2 uppercase tracking-wide text-sm">
                  <MapPin className="w-4 h-4"/> State Analysis
                </div>
                <h2 className="text-5xl font-extrabold mb-6">{selectedState.abbr}</h2>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-left">
                    <div>
                      <div className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                         <DollarSign className="w-3 h-3"/> Paper Salary
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ${selectedState.avg_salary.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs uppercase font-bold mb-1 flex items-center gap-1">
                         {selectedState.avg_col > 1 ? <TrendingUp className="w-3 h-3 text-red-400"/> : <TrendingDown className="w-3 h-3 text-green-400"/>}
                         Cost of Living
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedState.avg_col}x <span className="text-sm font-normal text-slate-500">Natl Avg</span>
                      </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 max-w-sm w-full">
              <div className="text-slate-300 text-xs uppercase font-bold mb-2">Real "Take Home" Value</div>
              <div className="text-4xl font-extrabold text-green-400 mb-2">
                ${selectedState.purchasing_power.toLocaleString()}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                 This is what your salary feels like in {selectedState.abbr} after paying for local housing and expenses.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-40 flex flex-col items-center justify-center text-center text-slate-500 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="font-semibold mb-1">No State Selected</p>
          <p className="text-sm">Click a colored state on the map above to see the breakdown.</p>
        </div>
      )}
      </div>

    </div>
  );
}