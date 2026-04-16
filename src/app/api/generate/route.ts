import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, audience = '', purpose = 'Newsletter', tone = 'professional', count = 5, abTest = false } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Product/topic is required' }, { status: 400 });
    }

    const safeCount = Math.min(Math.max(1, count), 20);

    const abInstruction = abTest
      ? `For each subject line, also provide an A/B variant (a different angle on the same idea).
Return ONLY valid JSON: {"subjects":[{"line":"subject A","abVariant":"subject B"},...]}`
      : `Return ONLY valid JSON: {"subjects":[{"line":"subject line"},...]}`

    const { text } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      system: `You are an expert email marketing copywriter specializing in subject lines that maximize open rates.
Generate exactly ${safeCount} email subject lines for the given product/topic.
Email purpose: ${purpose}.
Target audience: ${audience || 'general'}.
Tone: ${tone}.
Rules:
- Every subject line MUST be under 60 characters
- Use power words (exclusive, urgent, limited, secret, proven, free, new)
- Include curiosity gaps, personalization tokens (use [Name] sparingly), and urgency where appropriate
- Vary techniques across results: questions, numbers, FOMO, benefit-driven, how-to, social proof
- Make each subject line compelling, specific, and conversion-oriented
- Avoid spam trigger words (buy now, act now, click here, free!!!)
${abInstruction}`,
      prompt: topic.substring(0, 2000),
    });

    try {
      const parsed = JSON.parse(text);
      const subjects = parsed.subjects.slice(0, safeCount);
      return NextResponse.json({ subjects });
    } catch {
      // Fallback: try to extract lines from raw text
      const lines = text.split('\n').filter(l => l.trim().length > 5).slice(0, safeCount);
      const subjects = lines.map(l => ({ line: l.replace(/^[\d.\-*]+\s*/, '').trim() }));
      return NextResponse.json({ subjects });
    }
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Failed to generate subject lines' }, { status: 500 });
  }
}
