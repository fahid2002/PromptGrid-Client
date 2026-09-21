'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';

export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!sent) {
        await api('/auth/password/reset/send-code', { method: 'POST', body: JSON.stringify({ email }) });
        setSent(true);
        toast.success('If an account exists, a verification code was sent to that email.');
      } else {
        await api('/auth/password/reset', { method: 'POST', body: JSON.stringify({ email, code, newPassword: password }) });
        toast.success('Password updated. You can log in now.');
        setSent(false);
        setCode('');
        setPassword('');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 sm:py-12">
      <form onSubmit={submit} className="hard-card mx-auto grid max-w-md gap-3 rounded-[2rem] p-6 sm:p-7">
        <h1 className="font-display text-3xl font-black">Reset password</h1>
        <p className="text-sm leading-6 muted">We will send a one-time verification code to your account email.</p>
        <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="Email address" autoComplete="email" />
        {sent ? <>
          <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="input-box rounded-2xl px-4 py-3 text-center tracking-[.4em]" placeholder="000000" autoComplete="one-time-code" />
          <input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="New password" autoComplete="new-password" />
        </> : null}
        <button disabled={loading} className="btn-lime rounded-2xl px-5 py-3 font-black disabled:opacity-60">{loading ? 'Please wait...' : sent ? 'Reset password' : 'Send verification code'}</button>
        <Link className="auth-link text-center text-sm underline" href="/login">Back to login</Link>
      </form>
    </section>
  );
}
