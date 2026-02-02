import Navbar from '@/components/Navbar';
import RelocationCalculator from '@/components/RelocationCalculator';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Relocation Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Thinking of moving? Find out exactly how much your current salary is worth in a new city.
          </p>
        </div>

        <RelocationCalculator />
      </main>
    </div>
  );
}