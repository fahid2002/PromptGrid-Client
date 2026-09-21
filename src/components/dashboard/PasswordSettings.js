'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';

export function PasswordSettings() {
  const [method, setMethod] = useState('authenticator');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendEmailCode = async () => {
    setLoading(true);
    try {
      await api('/auth/password/change/send-code', { method: 'POST' });
      setEmailSent(true);
      setMethod('email');
      toast.success('A password-change code was sent to your email.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const change = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api('/auth/password/change', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword, method, code }) });
      setCurrentPassword('');
      setNewPassword('');
      setCode('');
      setEmailSent(false);
      toast.success('Password changed successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="soft-card mt-6 rounded-3xl p-5">
      <h3 className="font-display text-2xl font-black">Change password</h3>
      <p className="mt-2 text-sm leading-6 muted">Use your current password and either your authenticator code or an email verification code.</p>
      <form onSubmit={change} className="mt-4 grid gap-3">
        <input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="input-box rounded-xl px-3 py-2" placeholder="Current password" autoComplete="current-password" />
        <input required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="input-box rounded-xl px-3 py-2" placeholder="New password" autoComplete="new-password" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMethod('authenticator')} className={method === 'authenticator' ? 'btn-lime rounded-xl px-3 py-2 text-sm' : 'btn-outline rounded-xl px-3 py-2 text-sm'}>Authenticator app</button>
          <button type="button" onClick={sendEmailCode} disabled={loading} className={method === 'email' ? 'btn-lime rounded-xl px-3 py-2 text-sm disabled:opacity-60' : 'btn-outline rounded-xl px-3 py-2 text-sm disabled:opacity-60'}>{emailSent ? 'Resend email code' : 'Use email code'}</button>
        </div>
        <input required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} maxLength={6} inputMode="numeric" pattern="[0-9]{6}" className="input-box rounded-xl px-3 py-2" placeholder={method === 'email' ? 'Email verification code' : 'Authenticator code'} autoComplete="one-time-code" />
        <button disabled={loading} className="btn-lime rounded-xl px-4 py-2 font-black disabled:opacity-60">{loading ? 'Updating...' : 'Change password'}</button>
      </form>
    </div>
  );
}
