import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
// 1. IMPORT THE NEW COMPONENT
import QuizCTA from '@/components/QuizCTA';

// 1. This function tells Next.js which pages to build in advance
export async function generateStaticParams() {
  const { data: salaryData } = await supabase
    .from('salary_data')
    .select(`
      occupations (slug),
      locations (slug)
    `);

  // If no data is found, return an empty array so it doesn't crash
  return salaryData?.map((item: any) => ({
    trade: item.occupations.slug,
    city: item.locations.slug,
  })) || [];
}

// 2. This is the actual page
export default async function SalaryPage({ params }: { params: Promise<{ trade: string; city: string }> }) {
  // We must "await" the params in Next.js 15
  const { trade, city } = await params;

  // DIAGNOSTIC: This prints to your VS Code terminal so you can see what is happening
  console.log(`Checking database for Trade: ${trade}, City: ${city}`);

  const { data, error } = await supabase
    .from('salary_data')
    .select(`
      annual_salary,
      occupations!inner (title, slug),
      locations!inner (city, state, slug)
    `)
    // The "!inner" above is the secret sauce. It forces a strict match.
    .eq('occupations.slug', trade)
    .eq('locations.slug', city)
    .single();

  // If there is an error OR no data, show the 404 page
  if (error || !data) {
    console.log("Error or No Data Found:", error);
    return notFound();
  }

  // Helper variables to make the HTML easier to read
  const occupation = data.occupations as any;
  const location = data.locations as any;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
          
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            {occupation.title} Salary in {location.city}, {location.state}
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Real-time market data for skilled trades professionals in 2026.
          </p>
          
          {/* SALARY DATA GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Avg Annual</div>
              <div className="text-3xl font-bold text-blue-900">${data.annual_salary.toLocaleString()}</div>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="text-sm text-green-600 font-semibold uppercase tracking-wide">Take Home (Est)</div>
              <div className="text-3xl font-bold text-green-900">${(data.annual_salary * 0.78).toLocaleString()}</div>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Demand</div>
              <div className="text-3xl font-bold text-purple-900">High 🔥</div>
            </div>
          </div>

          {/* --- NEW SMART CTA STARTS HERE --- */}
          {/* This replaces the old static "Want to earn this?" box */}
          <div className="text-left">
            <QuizCTA trade={trade} city={city} />
          </div>
          {/* --- NEW SMART CTA ENDS HERE --- */}

        </div>
      </main>
    </div>
  );
}