'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Wand2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function GeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('Water Treatment Grade 1');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Call our new Gemini API
  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedQuestions([]); // clear old results
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, trade_category: category }),
      });
      
      const data = await res.json();
      if (data.questions) {
        setGeneratedQuestions(data.questions);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate. Check console.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Save to Supabase
  const handleSaveToDB = async () => {
    setSaving(true);
    try {
      // Insert all generated questions into Supabase
      const { error } = await supabase
        .from('questions')
        .insert(generatedQuestions);

      if (error) throw error;
      
      alert('Success! Questions saved to database.');
      setGeneratedQuestions([]); // Clear screen
      setInputText('');
    } catch (err: any) {
      alert('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">AI Question Generator (Gemini)</h1>
        
        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">Trade Category</label>
          <input 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          />

          <label className="block text-sm font-bold text-slate-700 mb-2">Paste Source Text (Manual, Chapter, Article)</label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 p-3 border rounded-lg font-mono text-sm"
            placeholder="Paste raw text here..."
          />
          
          <button 
            onClick={handleGenerate} 
            disabled={loading || !inputText}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-5 h-5" />}
            Generate Questions
          </button>
        </div>

        {/* Preview Section */}
        {generatedQuestions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Preview ({generatedQuestions.length})</h2>
            
            {generatedQuestions.map((q, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                <p className="font-bold text-lg mb-4">{q.question_text}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt: any, j: number) => (
                    <div key={j} className={`p-2 rounded border ${opt.is_correct ? 'bg-green-50 border-green-300' : 'bg-slate-50'}`}>
                      {opt.text}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 italic">💡 {q.explanation}</p>
              </div>
            ))}

            <button 
              onClick={handleSaveToDB} 
              disabled={saving}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
              Approve & Save to Database
            </button>
          </div>
        )}
      </main>
    </div>
  );
}