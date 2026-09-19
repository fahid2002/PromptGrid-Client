'use client';

import { Bot, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/libs/api.js';
import { useAuth } from '@/libs/auth-context.js';

const MESSAGE_STORAGE_KEY = 'promptgrid-assistant-messages';

function cleanAssistantText(value) {
  return String(value || '').replace(/\*\*/g, '').replace(/__([^_]+)__/g, '$1').trim();
}

export default function AiAssistant() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];

    try {
      const stored = JSON.parse(window.localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]');
      return Array.isArray(stored)
        ? stored.map((item) => ({ ...item, content: item.role === 'assistant' ? cleanAssistantText(item.content) : item.content }))
        : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const hideAssistant = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const container = chatRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function ask(event) {
    event.preventDefault();
    if (!message.trim() || loading) return;
    const submittedMessage = message.trim();
    setMessages((currentMessages) => [...currentMessages, { role: 'user', content: submittedMessage }]);
    setMessage('');
    setLoading(true);
    if (authLoading) {
      window.setTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, { role: 'assistant', content: 'Please wait while we check your login status.' }]);
        setLoading(false);
      }, 650);
      return;
    }
    if (!user) {
      window.setTimeout(() => {
        setMessages((currentMessages) => [...currentMessages, { role: 'assistant', content: 'You need to log in first to use the AI assistant.' }]);
        setLoading(false);
      }, 650);
      return;
    }
    try {
      const data = await api('/ai/assistant', { method: 'POST', body: JSON.stringify({ message: submittedMessage, context: pathname }) });
      setMessages((currentMessages) => [...currentMessages, { role: 'assistant', content: cleanAssistantText(data.output) }]);
    } catch (requestError) {
      setMessages((currentMessages) => [...currentMessages, { role: 'assistant', content: cleanAssistantText(requestError.message || 'I could not process that request right now. Please try again.') }]);
    }
    finally { setLoading(false); }
  }

  if (hideAssistant) return null;

  return <div className="fixed bottom-7 right-7 z-[60] sm:bottom-8 sm:right-8">
    {open ? <section className="hard-card mb-3 w-[min(380px,calc(100vw-2rem))] rounded-[1.5rem] p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="logo-mark grid h-9 w-9 place-items-center rounded-xl"><Bot className="h-5 w-5" /></span><div><p className="font-black">PromptGrid Assistant</p><p className="muted text-xs">Ask about prompts or AI Tools</p></div></div><button className="btn-outline icon-button" aria-label="Close AI Assistant" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button></div>
      <div className="soft-card promptgrid-scrollbar mb-4 flex min-h-56 max-h-80 flex-col gap-3 overflow-y-auto rounded-2xl p-4 text-sm leading-6" ref={chatRef}>
        {messages.map((item, index) => <div className={`h-auto w-fit max-w-[88%] break-words rounded-2xl px-3 py-2 leading-6 ${item.role === 'user' ? 'self-end bg-[var(--lime)] text-slate-950' : 'assistant-message self-start'}`} key={`${item.role}-${index}`}>{item.content}</div>)}
        {loading ? <div className="assistant-message self-start rounded-2xl px-3 py-2"><span className="inline-flex items-center gap-1" role="status" aria-label="Typing"><span>Typing</span><span className="inline-flex gap-0.5"><span className="animate-bounce [animation-delay:-0.3s]">.</span><span className="animate-bounce [animation-delay:-0.15s]">.</span><span className="animate-bounce">.</span></span></span></div> : null}
      </div>
      <form className="assistant-input-shell flex items-center gap-2 rounded-2xl border-2 border-[var(--line)] p-1.5" onSubmit={ask}><Bot className="ml-2 h-5 w-5 shrink-0 text-[var(--muted)]" /><input className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your message…" aria-label="Ask PromptGrid Assistant" /><button className="btn-lime icon-button" disabled={loading || !message.trim()} aria-label="Send message"><Send className="h-4 w-4" /></button></form>
    </section> : null}
    <button className="btn-lime ml-auto grid h-12 w-12 place-items-center rounded-full shadow-xl" onClick={() => setOpen((value) => !value)} aria-label="Open PromptGrid Assistant"><Bot className="h-6 w-6" /></button>
  </div>;
}
