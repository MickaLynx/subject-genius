import { NextResponse } from 'next/server';

// In-memory store for demo; production uses Supabase
const history: Array<{
  id: string;
  body: string;
  emailType: string;
  industry: string;
  tone: string;
  subjects: string[];
  createdAt: string;
  userId: string;
}> = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'anonymous';
  const userHistory = history.filter(h => h.userId === userId).slice(0, 50);
  return NextResponse.json({ history: userHistory });
}

export async function POST(req: Request) {
  const data = await req.json();
  const entry = {
    id: Date.now().toString(36),
    body: data.body,
    emailType: data.emailType,
    industry: data.industry,
    tone: data.tone,
    subjects: data.subjects,
    createdAt: new Date().toISOString(),
    userId: data.userId || 'anonymous',
  };
  history.unshift(entry);
  if (history.length > 500) history.pop();
  return NextResponse.json({ entry });
}
