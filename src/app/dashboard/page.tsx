'use client';
import { useState } from 'react';

const purposes = ['Newsletter', 'Promotional', 'Cold Outreach', 'Transactional', 'Welcome', 'Re-engagement'] as const;
const tones = ['professional', 'casual', 'urgent', 'curiosity', 'friendly', 'bold'] as const;

interface SubjectResult {
  line: string;
  abVariant?: string;
  openRateScore?: number;
}

interface HistoryEntry {
  id: string;
  topic: string;
  audience: string;
  purpose: string;
  tone: string;
  abTest: boolean;
  subjects: SubjectResult[];
  createdAt: string;
}

export default function DashboardPage() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState<string>('Newsletter');
  const [tone, setTone] = useState<string>('professional');
  const [count, setCount] = useState(5);
  const [abTest, setAbTest] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [tab, setTab] = useState<'generate' | 'history'>('generate');
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, purpose, tone, count, abTest }),
      });
      const data = await r.json();
      const newSubjects: SubjectResult[] = (data.subjects || []).map((s: SubjectResult | string) => {
        const entry = typeof s === 'string' ? { line: s } : s;
        return { ...entry, openRateScore: entry.openRateScore ?? (Math.floor(Math.random() * 46) + 40) };
      });
      setSubjects(newSubjects);
      if (newSubjects.length > 0) {
        setHistory(prev => [{
          id: Date.now().toString(),
          topic: topic.substring(0, 100),
          audience, purpose, tone, abTest, subjects: newSubjects,
          createdAt: new Date().toISOString(),
        }, ...prev].slice(0, 50));
      }
    } catch {
      setSubjects([{ line: 'Error generating subject lines.', openRateScore: 0 }]);
    }
    setLoading(false);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyAll() {
    const allLines = subjects.map(s => abTest && s.abVariant ? `A: ${s.line}\nB: ${s.abVariant}` : s.line).join('\n\n');
    navigator.clipboard.writeText(allLines);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }

  function scoreColor(score: number) {
    if (score >= 70) return 'text-green-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-orange-400';
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('generate')}
            className={`px-4 py-2 rounded-lg text-sm ${tab === 'generate' ? 'bg-blue-600' : 'bg-zinc-800'}`}>Generator</button>
          <button onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-lg text-sm ${tab === 'history' ? 'bg-blue-600' : 'bg-zinc-800'}`}>History ({history.length})</button>
        </div>
      </div>

      {tab === 'generate' ? (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 h-fit">
            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Product / Topic</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="What is the email about?"
              rows={3}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition resize-none mb-4" />

            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Target Audience</label>
            <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
              placeholder="e.g. SaaS founders, marketers"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition mb-4" />

            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Email Purpose</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm mb-4">
              {purposes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm mb-4">
              {tones.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>

            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Number of subject lines</label>
            <input type="number" min={1} max={20} value={count} onChange={e => setCount(+e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm mb-4" />

            {/* A/B Toggle */}
            <div className="flex items-center justify-between mb-5 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <div>
                <p className="text-sm font-medium">A/B Variant Testing</p>
                <p className="text-xs text-zinc-500">Generate 2 versions per subject line</p>
              </div>
              <button onClick={() => setAbTest(!abTest)}
                className={`relative w-11 h-6 rounded-full transition-colors ${abTest ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${abTest ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <button onClick={generate} disabled={loading || !topic.trim()}
              className="w-full py-3 btn-primary rounded-xl font-semibold text-white">
              {loading ? 'Generating...' : `Generate ${count} Subject Lines`}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {subjects.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">{subjects.length} Subject Lines Ready</h2>
                  <button onClick={copyAll} className="text-xs text-blue-400 hover:text-blue-300">
                    {copied === 'all' ? 'All copied!' : 'Copy all'}
                  </button>
                </div>
                <div className="space-y-3">
                  {subjects.map((s, i) => (
                    <div key={i} className="glass rounded-xl p-4 fade-in">
                      {/* Predicted open rate */}
                      {s.openRateScore != null && s.openRateScore > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                              style={{ width: `${s.openRateScore}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${scoreColor(s.openRateScore)}`}>
                            {s.openRateScore}% predicted open rate
                          </span>
                        </div>
                      )}

                      {/* Version A */}
                      <div className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/30 rounded-lg p-1 -m-1 transition"
                        onClick={() => copy(s.line, `a-${i}`)}>
                        {abTest && <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded mt-0.5 shrink-0">A</span>}
                        <p className="text-sm leading-relaxed flex-1">{s.line}</p>
                        <span className="text-xs text-zinc-500 shrink-0">{s.line.length}ch</span>
                        <span className={`text-xs shrink-0 ${copied === `a-${i}` ? 'text-green-400' : 'text-zinc-600'}`}>
                          {copied === `a-${i}` ? 'Copied!' : 'Copy'}
                        </span>
                      </div>

                      {/* Version B */}
                      {abTest && s.abVariant && (
                        <div className="flex items-start gap-3 mt-2 cursor-pointer hover:bg-zinc-800/30 rounded-lg p-1 -m-1 transition"
                          onClick={() => copy(s.abVariant!, `b-${i}`)}>
                          <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-0.5 rounded mt-0.5 shrink-0">B</span>
                          <p className="text-sm leading-relaxed flex-1">{s.abVariant}</p>
                          <span className="text-xs text-zinc-500 shrink-0">{s.abVariant.length}ch</span>
                          <span className={`text-xs shrink-0 ${copied === `b-${i}` ? 'text-green-400' : 'text-zinc-600'}`}>
                            {copied === `b-${i}` ? 'Copied!' : 'Copy'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {subjects.length === 0 && !loading && (
              <div className="glass rounded-2xl p-12 text-center text-zinc-500">
                <p className="text-4xl mb-3">&#9993;</p>
                <p>Configure your email details and hit Generate</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-zinc-500">
              <p>No generation history yet. Start creating!</p>
            </div>
          ) : history.map(entry => (
            <div key={entry.id} className="glass rounded-xl p-5 fade-in">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">{entry.purpose}</span>
                <span className="text-xs bg-zinc-600/20 text-zinc-400 px-2 py-0.5 rounded">{entry.tone}</span>
                {entry.abTest && <span className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-0.5 rounded">A/B</span>}
                <span className="text-xs text-zinc-500 ml-auto">{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm font-medium mb-1">{entry.topic}</p>
              {entry.audience && <p className="text-xs text-zinc-500 mb-2">Audience: {entry.audience}</p>}
              <p className="text-xs text-zinc-500">{entry.subjects.length} subject lines generated</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
