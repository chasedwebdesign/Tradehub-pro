'use client';
import { useState } from 'react';
import { calculateSm2 } from '@/lib/sm2';

export default function FlashcardRunner({ cards, userId }: { cards: any, userId: string }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const currentCard = cards[index];

  if (!currentCard) return <div className="text-center p-10 text-2xl">🎉 All caught up for today!</div>;

  const handleGrade = async (grade: number) => {
    // 1. Calculate new schedule using SM-2
    const { interval, repetitions, efactor } = calculateSm2(grade, 0, 2.5, 0);
    
    // 2. Optimistic Update (move to next card instantly)
    setFlipped(false);
    setIndex(index + 1);

    // 3. Save to Database (In a real app, use a Server Action here)
    console.log(`Saved: Card ${currentCard.id} due in ${interval} days`);
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div 
        onClick={() => setFlipped(!flipped)}
        className="h-80 bg-white border border-slate-200 rounded-2xl shadow-lg flex items-center justify-center p-8 text-2xl font-medium text-center cursor-pointer transition-all hover:shadow-xl"
      >
        {flipped? currentCard.answer : currentCard.question}
      </div>
      
      {flipped && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          <button onClick={() => handleGrade(0)} className="py-4 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200">Again</button>
          <button onClick={() => handleGrade(3)} className="py-4 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200">Hard</button>
          <button onClick={() => handleGrade(4)} className="py-4 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200">Good</button>
          <button onClick={() => handleGrade(5)} className="py-4 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200">Easy</button>
        </div>
      )}
      <div className="mt-4 text-center text-slate-400 text-sm">
        Click card to flip • Rate difficulty to schedule next review
      </div>
    </div>
  );
}