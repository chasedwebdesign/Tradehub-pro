import Navbar from '@/components/Navbar';
import SalaryMap from '@/components/SalaryMap';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            The Purchasing Power Map
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A high salary means nothing if rent costs $4,000. Use this map to find states where your trade skills buy you the most freedom.
          </p>
        </div>
        
        <SalaryMap />
      </main>
    </div>
  );
}