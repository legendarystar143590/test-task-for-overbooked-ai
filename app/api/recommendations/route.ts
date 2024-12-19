// app/api/recommendations/route.ts
import { NextResponse } from 'next/server';
interface RecommendationRequest {
  user_id: string;
  preferences: string[];
}

// Handle POST requests
export async function POST(request: Request) {
  const { user_id, preferences }: RecommendationRequest = await request.json();

  // Input validation
  if (!user_id || !Array.isArray(preferences) || preferences.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Call to mock LLM agent to generate recommendations
    const response = await fetch('http://localhost:8000/api/llm/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({user_id, preferences }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations from LLM agent');
    }

    const data = await response.json();
    
    return NextResponse.json({ user_id, recommendations: data.recommendations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to fetch recommendations at this time. Please try again later.' }, { status: 500 });
  }
}

// Handle GET requests
export async function GET(request: Request) {
  return NextResponse.json({ message: "This is a GET request" }, { status: 200 });
}
