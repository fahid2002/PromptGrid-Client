'use client';

/* eslint-disable @next/next/no-img-element -- QR code is a generated data URL */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';

export function MfaSettings() {
  const [status, setStatus] = useState(null);
  const [setup, setSetup] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/auth/mfa/status')
      .then(setStatus)
      .catch((error) => toast.error(error.message));
  }, []);

  const startSetup = async () => {
    setLoading(true);
    try {
      setSetup(await api('/auth/mfa/setup', { method: 'POST' }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const enable = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await api('/auth/mfa/enable', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setStatus({ enabled: true, recoveryCodesRemaining: data.recoveryCodes.length });
      setRecoveryCodes(data.recoveryCodes);
      setSetup(null);
      setCode('');
      toast.success('Two-factor authentication enabled.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const disable = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api('/auth/mfa/disable', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setStatus({ enabled: false, recoveryCodesRemaining: 0 });
      setCode('');
      toast.success('Two-factor authentication disabled.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!status) return <div className="skeleton mt-6 h-24 rounded-3xl" />;

  return (
    <div className="soft-card mt-6 rounded-3xl p-5">
      <h3 className="font-display text-2xl font-black">Two-factor authentication</h3>
      <p className="mt-2 text-sm leading-6 muted">
        Protect your account with a time-based code from an authenticator app.
      </p>

      {!status.enabled && !setup ? (
        <button type="button" onClick={startSetup} disabled={loading} className="btn-lime mt-4 rounded-2xl px-5 py-3 font-black disabled:opacity-60">
          {loading ? 'Preparing setup...' : 'Enable MFA'}
        </button>
      ) : null}

      {!status.enabled && setup ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-start">
          <img src={setup.qrCode} alt="Scan this QR code with your authenticator app" className="h-40 w-40 rounded-2xl border border-[var(--line)] bg-white p-2" />
          <div>
            <p className="text-sm leading-6">Scan the QR code, then enter the 6-digit code shown by your app.</p>
            <p className="mt-3 break-all rounded-xl bg-black/5 p-3 font-mono text-xs dark:bg-white/10">Manual key: {setup.manualSecret}</p>
            <form onSubmit={enable} className="mt-3 flex flex-wrap gap-2">
              <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="input-box min-w-32 flex-1 rounded-xl px-3 py-2" placeholder="000000" autoComplete="one-time-code" />
              <button disabled={loading} className="btn-lime rounded-xl px-4 py-2 font-black disabled:opacity-60">Verify</button>
            </form>
          </div>
        </div>
      ) : null}

      {status.enabled ? (
        <div className="mt-4">
          <p className="text-sm text-green-700 dark:text-green-300">MFA is enabled. Recovery codes remaining: {status.recoveryCodesRemaining}.</p>
          <form onSubmit={disable} className="mt-3 flex flex-wrap gap-2">
            <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="input-box min-w-32 flex-1 rounded-xl px-3 py-2" placeholder="Current authenticator code" autoComplete="one-time-code" />
            <button disabled={loading} className="btn-outline rounded-xl px-4 py-2 font-black disabled:opacity-60">Disable MFA</button>
          </form>
        </div>
      ) : null}

      {recoveryCodes.length ? (
        <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="font-black">Save these recovery codes now</p>
          <p className="mt-1 text-sm muted">Each code works once if you lose access to your authenticator app.</p>
          <code className="mt-3 grid gap-1 rounded-xl bg-black/5 p-3 text-sm dark:bg-white/10">{recoveryCodes.map((item) => <span key={item}>{item}</span>)}</code>
        </div>
      ) : null}
    </div>
  );
}
