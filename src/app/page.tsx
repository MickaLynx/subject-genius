'use client';
import { useState } from 'react';

const purposes = ['Newsletter', 'Promotional', 'Cold Outreach', 'Transactional', 'Welcome', 'Re-engagement'] as const;
const tones = ['professional', 'casual', 'urgent', 'curiosity', 'friendly', 'bold'] as const;

export default function Home() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState<string>('Newsletter');
  const [tone, setTone] = useState<string>('professional');
  const [subjects, setSubjects] = useState<{ line: string; abVariant?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, purpose, tone, abTest: true }),
      });
      const data = await r.json();
      setSubjects(data.subjects || []);
    } catch {
      setSubjects([{ line: 'Error generating subject lines. Please try again.' }]);
    }
    setLoading(false);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">
          Email Subject Lines That <span className="gradient-text">Get Opened</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">
          AI-powered subject lines with built-in A/B testing. Stop guessing, start converting -- generate subject lines proven to boost open rates.
        </p>

        {/* Generator */}
        <div className="glass rounded-2xl p-6 text-left">
          <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Product / Topic</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={3}
            placeholder="What is the email about? e.g. 'Spring sale on running shoes, 30% off all models'"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition resize-none mb-5"
          />

          <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Target Audience</label>
          <input
            type="text"
            value={audience}
            onChange={e => setAudience(e.target.value)}
            placeholder="e.g. SaaS founders, fitness enthusiasts, B2B decision makers"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition mb-5"
          />

          <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Email Purpose</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {purposes.map(p => (
              <button key={p} onClick={() => setPurpose(p)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition ${purpose === p ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                {p}
              </button>
            ))}
          </div>

          <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Tone</label>
          <div className="flex flex-wrap gap-2 mb-6">
            {tones.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition ${tone === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                {t}
              </button>
            ))}
          </div>

          <button onClick={generate} disabled={loading || !topic.trim()}
            className="w-full py-3.5 btn-primary rounded-xl font-semibold text-white">
            {loading ? 'Generating subject lines...' : 'Generate Subject Lines + A/B Variants'}
          </button>
        </div>
      </section>

      {/* Results */}
      {subjects.length > 0 && (
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your Subject Lines</h2>
          <p className="text-xs text-zinc-500 mb-4">Each subject line comes with an A/B variant for split testing</p>
          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div key={i} className="glass rounded-xl p-5 fade-in">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded mt-0.5 shrink-0">A</span>
                  <p className="text-sm leading-relaxed flex-1 cursor-pointer hover:text-blue-300 transition" onClick={() => copy(s.line, `a-${i}`)}>
                    {s.line}
                  </p>
                  <span className="text-xs text-zinc-500 shrink-0">{s.line.length} chars</span>
                  <span className={`text-xs shrink-0 ${copied === `a-${i}` ? 'text-green-400' : 'text-zinc-600'}`}>
                    {copied === `a-${i}` ? 'Copied!' : 'Copy'}
                  </span>
                </div>
                {s.abVariant && (
                  <div className="flex items-start gap-3">
                    <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-0.5 rounded mt-0.5 shrink-0">B</span>
                    <p className="text-sm leading-relaxed flex-1 cursor-pointer hover:text-cyan-300 transition" onClick={() => copy(s.abVariant!, `b-${i}`)}>
                      {s.abVariant}
                    </p>
                    <span className="text-xs text-zinc-500 shrink-0">{s.abVariant.length} chars</span>
                    <span className={`text-xs shrink-0 ${copied === `b-${i}` ? 'text-green-400' : 'text-zinc-600'}`}>
                      {copied === `b-${i}` ? 'Copied!' : 'Copy'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Proof */}
      <section className="px-6 py-16 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-500 text-sm mb-6">Trusted by 5,000+ email marketers and growth teams</p>
          <div className="grid grid-cols-3 gap-8">
            <div><p className="text-3xl font-bold gradient-text">10K+</p><p className="text-zinc-500 text-xs mt-1">Subject Lines Tested</p></div>
            <div><p className="text-3xl font-bold gradient-text">42%</p><p className="text-zinc-500 text-xs mt-1">Avg. Open Rate Boost</p></div>
            <div><p className="text-3xl font-bold gradient-text">A/B</p><p className="text-zinc-500 text-xs mt-1">Built-in Split Testing</p></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-800/50 text-center text-xs text-zinc-600">
        <p>&copy; {new Date().getFullYear()} SubjectLine AI. All rights reserved.</p>
      </footer>
    </main>
  );
}
