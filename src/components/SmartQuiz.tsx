'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Added for URL reading
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  trade_category: string;
  explanation: string;
  options: { text: string; is_correct: boolean }[];
}

interface UserProgress {
  question_id: string;
  difficulty: number;
  due_date: string;
}

export default function SmartQuiz({ examCategory }: { examCategory?: string }) {
  const searchParams = useSearchParams();
  
  // 1. DETERMINE CATEGORY: Prop (highest priority) -> URL Param -> Default
  const activeCategory = examCategory || searchParams.get('category') || 'Water Treatment Grade 1';

  const [queue, setQueue] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 2. INITIALIZE: Check User & Build Queue
  useEffect(() => {
    async function initQuiz() {
      setLoading(true);
      console.log(`Initializing Quiz for: ${activeCategory}`);
      
      // A. Get Current User (Required for "Memory")
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // B. Fetch All Questions for this Trade
      const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('trade_category', activeCategory);

      if (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
        return;
      }

      if (!allQuestions || allQuestions.length === 0) {
        setLoading(false);
        return;
      }

      // C. Fetch User's Past Progress (Memory)
      let progressMap: Record<string, UserProgress> = {};
      if (user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('question_id, difficulty, due_date')
          .eq('user_id', user.id);
        
        // Turn array into a Map for fast lookup
        progressData?.forEach((p) => {
          progressMap[p.question_id] = p;
        });
      }

      // D. The "Algorithm" (Sort the Queue)
      const now = new Date();
      
      const dueQuestions: Question[] = [];
      const newQuestions: Question[] = [];
      const reviewLaterQuestions: Question[] = [];

      for (const q of allQuestions) {
        const history = progressMap[q.id];

        if (!history) {
          // Never seen before -> New Queue
          newQuestions.push(q);
        } else if (new Date(history.due_date) <= now) {
          // Due date is past -> Due Queue (Priority!)
          dueQuestions.push(q);
        } else {
          // Due date is future -> Review Later (Don't show now)
          reviewLaterQuestions.push(q);
        }
      }

      // E. Final Mix: Due Questions FIRST, then New Questions
      // We shuffle new questions so it's not the same order every time
      const finalQueue = [...dueQuestions, ...newQuestions.sort(() => 0.5 - Math.random())];
      
      setQueue(finalQueue.slice(0, 20)); // Limit to 20 per session
      setLoading(false);
    }

    initQuiz();
  }, [activeCategory]); // Re-run if category changes

  // 3. HANDLE ANSWER: The Learning Logic
  const handleAnswerClick = async (index: number) => {
    if (showResult) return;
    setSelectedOptionIndex(index);
    setShowResult(true);

    const currentQ = queue[currentQIndex];
    const isCorrect = currentQ.options[index].is_correct;

    // Save to Database (if logged in)
    if (userId) {
      const now = new Date();
      let nextDueDate = new Date();

      if (isCorrect) {
        // Simple Spaced Repetition Logic:
        // Correct? See it again in 3 days.
        nextDueDate.setDate(now.getDate() + 3);
      } else {
        // Wrong? See it again in 10 minutes (effectively "Now").
        nextDueDate.setMinutes(now.getMinutes() + 10);
      }

      await supabase.from('user_progress').upsert({
        user_id: userId,
        question_id: currentQ.id,
        due_date: nextDueDate.toISOString(),
        difficulty: isCorrect ? 3 : 1 // 3=Good, 1=Again
      });
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedOptionIndex(null);
    
    // If we are at the end, just loop or show done (Looping for now)
    if (currentQIndex < queue.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      alert("Session Complete! Great job.");
      // Ideally redirect to summary page or reset
      window.location.reload(); 
    }
  };

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Loading your smart session for <strong>{activeCategory}</strong>...</p>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
        <p className="text-slate-500 mb-6">
          You have no cards due for review in <strong>{activeCategory}</strong>. Great job!
        </p>
        <button 
           onClick={() => window.location.reload()}
           className="text-blue-600 font-bold hover:underline"
        >
          Check again
        </button>
      </div>
    );
  }

  const currentQuestion = queue[currentQIndex];
  const isCorrect = selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex]?.is_correct;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Progress Header */}
      <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Daily Review: {activeCategory}
        </span>
        <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
           <BrainCircuit className="w-4 h-4" />
           {queue.length - currentQIndex} left
        </div>
      </div>

      <div className="p-8">
        {/* The Question */}
        <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
            let icon = null;

            if (showResult) {
              if (option.is_correct) {
                buttonStyle = "border-green-500 bg-green-50 text-green-700 font-medium";
                icon = <CheckCircle className="w-5 h-5 text-green-600" />;
              } else if (selectedOptionIndex === index) {
                buttonStyle = "border-red-500 bg-red-50 text-red-700";
                icon = <XCircle className="w-5 h-5 text-red-600" />;
              }
            } else if (selectedOptionIndex === index) {
              buttonStyle = "border-blue-600 bg-blue-50 ring-1 ring-blue-600";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ${buttonStyle}`}
              >
                <span className="flex-1">{option.text}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {showResult && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-5 rounded-xl mb-6 ${isCorrect ? 'bg-green-100/50' : 'bg-red-50'}`}>
              <h4 className={`font-bold mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                {currentQuestion.explanation || "No explanation provided."}
              </p>
              <div className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {isCorrect ? 'Next Review: 3 Days' : 'Next Review: < 10 Minutes'}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}