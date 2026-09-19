'use client';

import Link from 'next/link';
import { ArrowRight, Play, Search, ShieldCheck, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/libs/api.js';

const tools = [
  { id: 'optimize', title: 'Prompt Builder & Optimizer', description: 'Turn a rough idea into a clear, reusable prompt.', icon: WandSparkles },
  { id: 'run', title: 'Prompt Playground', description: 'Test a prompt with your own input and inspect the output.', icon: Play },
  { id: 'moderate', title: 'AI Prompt Moderation', description: 'Review safety, quality, spam, and improvement suggestions.', icon: ShieldCheck },
  { id: 'search', title: 'Semantic Prompt Search', description: 'Find relevant marketplace prompts by meaning, not only keywords.', icon: Search },
];

function Result({ children }) { return <div className="soft-card mt-5 rounded-3xl p-5">{children}</div>; }

export default function AiToolsClient() {
  const [active, setActive] = useState('optimize'); const [prompt, setPrompt] = useState(''); const [input, setInput] = useState(''); const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [query, setQuery] = useState(''); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  function chooseTool(id) { setActive(id); setResult(null); setError(''); }
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError(''); setResult(null);
    const payload = active === 'optimize' ? { prompt } : active === 'run' ? { prompt, input } : active === 'moderate' ? { title, description, prompt } : { query };
    try { const data = await api(`/ai/${active}`, { method: 'POST', body: JSON.stringify(payload) }); setResult(data.result || data.output || data.results); }
    catch (requestError) { setError(requestError.message || 'Please log in and try again.'); } finally { setLoading(false); }
  }
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="mb-10 max-w-3xl"><p className="eyebrow">PromptGrid AI workspace</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">AI Tools</h1><p className="muted mt-4 text-lg">Build, test, review, and discover prompts from one focused workspace.</p></div>
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]"><aside className="grid content-start gap-3">{tools.map(({ id, title: toolTitle, description: toolDescription, icon: Icon }) => <button key={id} onClick={() => chooseTool(id)} className={`${active === id ? 'btn-lime' : 'soft-card'} rounded-3xl p-4 text-left`}><Icon className="mb-4 h-6 w-6" /><p className="font-black">{toolTitle}</p><p className="mt-1 text-sm opacity-80">{toolDescription}</p></button>)}</aside>
      <section className="hard-card rounded-[2rem] p-5 sm:p-8">{active === 'optimize' ? <ToolHeader icon={WandSparkles} title="Prompt Builder & Optimizer" text="Describe what you need and Gemini will structure it into a reusable prompt." /> : null}{active === 'run' ? <ToolHeader icon={Play} title="Prompt Playground" text="Run a prompt against sample input. Do not submit passwords or private information." /> : null}{active === 'moderate' ? <ToolHeader icon={ShieldCheck} title="AI Prompt Moderation" text="Get an advisory quality and safety review before submitting a marketplace prompt." /> : null}{active === 'search' ? <ToolHeader icon={Search} title="Semantic Prompt Search" text="Describe your goal in natural language to find relevant approved prompts." /> : null}
        <form className="mt-7 grid gap-4" onSubmit={submit}>{active === 'moderate' ? <><input className="input-box" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Prompt title" aria-label="Prompt title" /><textarea className="input-box min-h-24" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description" aria-label="Prompt description" /></> : null}{active === 'search' ? <input className="input-box" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: a prompt for validating a startup idea" aria-label="Search query" /> : null}{active !== 'search' ? <textarea className="input-box min-h-44" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={active === 'optimize' ? 'Example: Help me plan my weekly study schedule…' : 'Paste or write your prompt here…'} aria-label="Prompt" /> : null}{active === 'run' ? <textarea className="input-box min-h-32" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter the input you want to test…" aria-label="Prompt input" /> : null}<button className="btn-lime inline-flex w-fit items-center gap-2 rounded-2xl px-5 py-3 font-black" disabled={loading}>{loading ? 'Working…' : 'Run AI Tool'} <ArrowRight className="h-4 w-4" /></button></form>
        {error ? <p className="mt-5 rounded-2xl bg-red-500/10 p-4 text-sm text-red-500">{error}</p> : null}{active === 'optimize' && result ? <Result><OutputBlock label="Title" value={result.title} /><OutputBlock label="Optimized prompt" value={result.optimizedPrompt} /><OutputBlock label="Instructions" value={result.instructions} /><OutputBlock label="Variables" value={result.variables?.join(', ')} /></Result> : null}{active === 'run' && result ? <Result><OutputBlock label="Generated output" value={result} /></Result> : null}{active === 'moderate' && result ? <Result><OutputBlock label="Decision" value={`${result.decision} · ${result.score}/100`} /><OutputBlock label="Safety issues" value={result.safetyIssues?.join('\n') || 'None reported'} /><OutputBlock label="Quality issues" value={result.qualityIssues?.join('\n') || 'None reported'} /><OutputBlock label="Suggestions" value={result.suggestions?.join('\n') || 'None'} /></Result> : null}{active === 'search' && Array.isArray(result) ? <Result><div className="grid gap-3">{result.length ? result.map(({ prompt: item, reason, score }) => <Link key={item._id} href={`/prompts/${item._id}`} className="soft-card rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{item.title}</p><p className="muted mt-1 text-sm">{reason}</p></div><span className="text-sm font-black">{score}/100</span></div></Link>) : <p className="muted">No close matches found.</p>}</div></Result> : null}</section>
    </div>
  </div>;
}

function ToolHeader({ icon: Icon, title, text }) { return <div className="flex items-start gap-4"><span className="logo-mark grid h-12 w-12 shrink-0 place-items-center rounded-2xl"><Icon className="h-6 w-6" /></span><div><h2 className="text-2xl font-black">{title}</h2><p className="muted mt-1">{text}</p></div></div>; }
function OutputBlock({ label, value }) { return <div className="mb-4 last:mb-0"><p className="muted mb-1 text-xs font-black uppercase tracking-wider">{label}</p><p className="whitespace-pre-wrap text-sm leading-7">{value || '—'}</p></div>; }
