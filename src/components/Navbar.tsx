import Link from 'next/link';
import { Hammer } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <Hammer className="w-6 h-6" /> TradeHub
        </Link>
        <div className="flex gap-6">
          <Link href="/salary/electrician/austin-tx" className="text-sm font-medium hover:text-blue-600">Salaries</Link>
          <Link href="/study/quiz" className="text-sm font-medium hover:text-blue-600">Practice Exams</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-blue-600">Pricing</Link>
        </div>
      </div>
    </nav>
  );
}