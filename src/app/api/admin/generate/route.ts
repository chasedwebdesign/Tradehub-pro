import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// 1. Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, trade_category } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // 2. The Prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cheapest & smartest model for this task
      response_format: { type: "json_object" }, // FORCE valid JSON
      messages: [
        {
          role: "system",
          content: `You are an expert exam creator for skilled trades. 
          Output a JSON object with a key "questions" containing an array of 5 multiple-choice questions.
          
          Each question object must look like this:
          {
            "question_text": "string",
            "trade_category": "${trade_category}",
            "explanation": "string",
            "options": [
              { "text": "Option A", "is_correct": false },
              { "text": "Option B", "is_correct": true }
            ]
          }`
        },
        {
          role: "user",
          content: `Generate questions based on this text:\n\n${text.substring(0, 15000)}`
        }
      ],
    });

    // 3. Parse and Return
    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned from OpenAI");

    const parsed = JSON.parse(content);
    return NextResponse.json({ questions: parsed.questions });

  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions', details: error.message },
      { status: 500 }
    );
  }
}