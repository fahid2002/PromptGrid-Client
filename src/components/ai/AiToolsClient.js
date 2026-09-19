'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Play, Search, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/libs/api.js';

const tools = [
  { id: 'optimize', title: 'Prompt Builder', icon: WandSparkles, eyebrow: 'Create' },
  { id: 'run', title: 'Prompt Playground', icon: Play, eyebrow: 'Test' },
  { id: 'moderate', title: 'Prompt Review', icon: ShieldCheck, eyebrow: 'Review' },
  { id: 'search', title: 'Semantic Search', icon: Search, eyebrow: 'Discover' },
];

const copy = {
  optimize: { title: 'Prompt Builder & Optimizer', text: 'Describe the result you want and get a clearer, reusable prompt structure.' },
  run: { title: 'Prompt Playground', text: 'Try a prompt with sample input and review the generated output safely.' },
  moderate: { title: 'AI Prompt Review', text: 'Get a practical safety and quality review before publishing a prompt.' },
  search: { title: 'Semantic Prompt Search', text: 'Describe your goal naturally and discover relevant approved prompts.' },
};

function Result({ children }) { return <div className="mt-6 rounded-[1.5rem] border border-[var(--line)]/10 bg-slate-950/30 p-5">{children}</div>; }

export default function AiToolsClient() {
  const [active, setActive] = useState('optimize');
  const [prompt, setPrompt] = useState('');
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeTool = tools.find((tool) => tool.id === active);
  const ActiveIcon = activeTool.icon;

  function chooseTool(id) { setActive(id); setResult(null); setError(''); }

  async function submit(event) {
    event.preventDefault();
    setLoading(true); setError(''); setResult(null);
    const payload = active === 'optimize' ? { prompt } : active === 'run' ? { prompt, input } : active === 'moderate' ? { title, description, prompt } : { query };
    try {
      const data = await api(`/ai/${active}`, { method: 'POST', body: JSON.stringify(payload) });
      setResult(data.result || data.output || data.results);
    } catch (requestError) {
      setError(requestError.message || 'The AI tool is temporarily unavailable. Please try again.');
    } finally { setLoading(false); }
  }

  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <header className="mb-10 max-w-3xl">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)]/15 bg-white/60 px-3 py-1.5 text-xs font-medium uppercase tracking-[.16em] dark:bg-white/5"><Sparkles className="h-3.5 w-3.5 text-[var(--purple)]" />PromptGrid AI workspace</div>
      <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">Build better prompts, faster.</h1>
      <p className="muted mt-4 max-w-2xl text-lg leading-8">A focused workspace to create, test, review, and discover prompts.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
      <aside className="grid content-start gap-3"><p className="px-1 text-xs font-medium uppercase tracking-[.16em] muted">Choose a tool</p>{tools.map(({ id, title: toolTitle, icon: Icon, eyebrow }) => <button key={id} type="button" aria-pressed={active === id} onClick={() => chooseTool(id)} className={`group rounded-[1.5rem] border p-4 text-left transition ${active === id ? 'border-[var(--line)] bg-[var(--lime)] text-slate-950 shadow-[5px_5px_0_var(--line)]' : 'border-[var(--line)]/15 bg-white/60 hover:-translate-y-0.5 hover:border-[var(--purple)]/40 hover:bg-white dark:bg-white/[.04] dark:hover:bg-white/[.08]'}`}><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${active === id ? 'bg-white/60' : 'bg-[var(--lime)]/90 text-slate-950'}`}><Icon className="h-5 w-5" /></span>{active === id ? <CheckCircle2 className="h-5 w-5" /> : null}</div><p className="mt-4 text-xs font-medium uppercase tracking-[.14em] opacity-70">{eyebrow}</p><p className="mt-1 text-base font-semibold">{toolTitle}</p></button>)}</aside>

      <section className="hard-card rounded-[2rem] p-5 sm:p-8">
        <div className="flex items-start gap-4 border-b border-[var(--line)]/10 pb-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--lime)] text-slate-950 shadow-[3px_3px_0_var(--line)]"><ActiveIcon className="h-6 w-6" /></span><div><p className="text-xs font-medium uppercase tracking-[.16em] text-[var(--purple)]">{activeTool.eyebrow}</p><h2 className="mt-1 font-display text-2xl font-black">{copy[active].title}</h2><p className="muted mt-1 leading-7">{copy[active].text}</p></div></div>
        <form className="mt-7 grid gap-5" onSubmit={submit}>
          {active === 'moderate' ? <><FieldLabel text="Prompt title" /><input className="input-box rounded-2xl px-4 py-3.5" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Example: Product launch strategy" aria-label="Prompt title" /><FieldLabel text="Short description" /><textarea className="input-box min-h-24 rounded-2xl p-4" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What should this prompt help someone achieve?" aria-label="Prompt description" /></> : null}
          {active === 'search' ? <><FieldLabel text="What are you looking for?" /><input className="input-box rounded-2xl px-4 py-3.5" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: a prompt for validating a startup idea" aria-label="Search query" /></> : null}
          {active !== 'search' ? <><FieldLabel text={active === 'moderate' ? 'Prompt to review' : 'Your prompt or idea'} /><textarea className="input-box min-h-48 rounded-2xl p-4 leading-7" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder={active === 'optimize' ? 'Start with a rough idea… Example: Help me plan my weekly study schedule.' : 'Paste or write your prompt here…'} aria-label="Prompt" /></> : null}
          {active === 'run' ? <><FieldLabel text="Test input" /><textarea className="input-box min-h-32 rounded-2xl p-4 leading-7" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Add the input you want your prompt to process…" aria-label="Prompt input" /></> : null}
          <button className="btn-lime inline-flex w-fit items-center gap-2 rounded-2xl px-5 py-3.5" disabled={loading}>{loading ? 'Working…' : `Run ${activeTool.eyebrow}`} <ArrowRight className="h-4 w-4" /></button>
        </form>

        {error ? <p className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-500">{error}</p> : null}
        {active === 'optimize' && result ? <Result><OutputBlock label="Title" value={result.title} /><OutputBlock label="Optimized prompt" value={result.optimizedPrompt} /><OutputBlock label="Instructions" value={result.instructions} /><OutputBlock label="Variables" value={result.variables?.join(', ')} /></Result> : null}
        {active === 'run' && result ? <Result><OutputBlock label="Generated output" value={result} /></Result> : null}
        {active === 'moderate' && result ? <Result><OutputBlock label="Decision" value={`${result.decision} · ${result.score}/100`} /><OutputBlock label="Safety issues" value={result.safetyIssues?.join('\n') || 'None reported'} /><OutputBlock label="Quality issues" value={result.qualityIssues?.join('\n') || 'None reported'} /><OutputBlock label="Suggestions" value={result.suggestions?.join('\n') || 'None'} /></Result> : null}
        {active === 'search' && Array.isArray(result) ? <Result><div className="grid gap-3">{result.length ? result.map(({ prompt: item, reason, score }) => <Link key={item._id} href={`/prompts/${item._id}`} className="rounded-2xl border border-[var(--line)]/10 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-[var(--purple)]/40 dark:bg-white/[.04]"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="muted mt-1 text-sm leading-6">{reason}</p></div><span className="shrink-0 rounded-full bg-[var(--lime)] px-2 py-1 text-xs font-medium text-slate-950">{score}/100</span></div></Link>) : <p className="muted">No close matches found.</p>}</div></Result> : null}
      </section>
    </div>
  </div>;
}

function FieldLabel({ text }) { return <label className="text-sm font-medium text-[var(--ink)]">{text}</label>; }
function OutputBlock({ label, value }) { return <div className="mb-5 last:mb-0"><p className="mb-1 text-xs font-medium uppercase tracking-[.14em] text-[var(--purple)]">{label}</p><p className="whitespace-pre-wrap text-sm leading-7">{value || '—'}</p></div>; }
