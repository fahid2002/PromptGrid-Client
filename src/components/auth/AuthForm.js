'use client';

import { Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { authDestination } from '@/libs/auth-navigation.js';
import { buildGoogleAuthPayload, buildRegistrationData, initialRegistrationForm, isGoogleConfigured, validateProfileImage } from '@/libs/registration.js';
import { useAuth } from '@/libs/auth-context.js';
import { ProfilePhotoEditor } from './ProfilePhotoEditor.js';
import { GoogleAuthButton } from './GoogleAuthButton.js';
import { RegistrationNotes } from './RegistrationNotes.js';
import { RoleSelector } from './RoleSelector.js';

export default function AuthForm({ mode }) {
  const register = mode === 'register';
  const [form, setForm] = useState(initialRegistrationForm);
  const [previewURL, setPreviewURL] = useState('');
  const [editorSource, setEditorSource] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const previewURLRef = useRef('');
  const { setUser } = useAuth();
  const router = useRouter();
  const googleConfigured = isGoogleConfigured(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  useEffect(() => () => {
    if (previewURLRef.current) URL.revokeObjectURL(previewURLRef.current);
  }, []);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const selectImage = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;
    const validationError = validateProfileImage(image);
    if (validationError) {
      event.target.value = '';
      toast.error(validationError);
      return;
    }
    setEditorSource(image);
    setEditorOpen(true);
    event.target.value = '';
  };

  const saveEditedImage = (image) => {
    if (previewURLRef.current) URL.revokeObjectURL(previewURLRef.current);
    const nextPreviewURL = URL.createObjectURL(image);
    previewURLRef.current = nextPreviewURL;
    setPreviewURL(nextPreviewURL);
    update('image', image);
    setEditorOpen(false);
    toast.success('Profile photo edits saved.');
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (register) {
        await api('/auth/register', { method: 'POST', body: buildRegistrationData(form) });
        toast.success(`${form.role === 'creator' ? 'Creator' : 'User'} account created. Please log in.`);
        router.replace(authDestination('register'));
        router.refresh();
      } else {
        const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: form.email, password: form.password, role: form.role }) });
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}.`);
        router.replace(authDestination('login'));
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const google = async (accessToken) => {
    if (!accessToken) {
      toast.error('Google did not return a valid access token.');
      return;
    }
    try {
      const intent = register ? 'register' : 'login';
      const data = await api('/auth/google', { method: 'POST', body: JSON.stringify(buildGoogleAuthPayload(accessToken, intent, form.role)) });
      if (register) {
        setUser(null);
        toast.success(`Google ${data.user.role} account created. Please log in.`);
      } else {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}.`);
      }
      router.replace(authDestination(intent));
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!register) {
    return (
      <section className="px-4 py-10 sm:py-12">
        <form onSubmit={submit} className="hard-card mx-auto grid max-w-md gap-3 rounded-[2rem] p-6 sm:p-7">
          <h1 className="font-display text-3xl font-black">Welcome back</h1>
          <p className="text-sm leading-6 muted">Use the role and account you previously registered.</p>
          <input required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="Email address" />
          <input required minLength={8} type="password" autoComplete="current-password" value={form.password} onChange={(event) => update('password', event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="Password" />
          <RoleSelector value={form.role} onChange={(role) => update('role', role)} includeAdmin compact />
          <button disabled={submitting} className="btn-lime rounded-2xl px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Logging in...' : 'Log in'}</button>
          {form.role !== 'admin' ? <GoogleAuthButton configured={googleConfigured} onSuccess={google} errorMessage="Google login failed. Please try again." /> : null}
          {form.role === 'admin' ? <p className="auth-light-surface rounded-xl bg-[#f4f6ff] p-3 text-center text-xs font-bold">Administrators use the fixed email and password. Google login is disabled for Admin.</p> : null}
          <p className="text-center text-sm muted">Not registered? <Link className="auth-link font-black underline" href="/register">Create an account</Link></p>
        </form>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1.08fr_.92fr] md:items-start">
        <form onSubmit={submit} className="hard-card rounded-[2rem] p-6 sm:p-7">
          <h1 className="font-display text-3xl font-black">Create account</h1>
          <p className="mt-2 text-sm leading-6 muted">Choose User or Creator. Each email can register only once.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input required autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="Name" />
            <input required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="input-box rounded-2xl px-4 py-3" placeholder="Email address" />
          </div>
          <input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} className="input-box mt-3 w-full rounded-2xl px-4 py-3" placeholder="Password" />
          <div className="mt-4"><RoleSelector value={form.role} onChange={(role) => update('role', role)} /></div>
          <label htmlFor="profile-photo" className="btn-outline mt-4 block cursor-pointer rounded-2xl px-5 py-3 text-center text-sm font-black">Browse Profile Photo</label>
          <input id="profile-photo" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} />
          <div className="auth-preview relative mt-3 grid min-h-28 place-items-center overflow-hidden rounded-2xl border border-[#17192d]/15 bg-white/70">
            {previewURL ? <Image src={previewURL} alt="Selected profile preview" fill unoptimized className="object-cover" /> : <p className="px-4 text-center text-sm font-bold muted">Photo preview will appear here</p>}
            {previewURL ? <button type="button" onClick={() => setEditorOpen(true)} className="btn-lime absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-xl" aria-label="Edit selected profile photo"><Pencil size={17} /></button> : null}
          </div>
          <button disabled={submitting} className="btn-lime mt-4 w-full rounded-2xl px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Creating account...' : 'Register'}</button>
          <div className="mt-3"><GoogleAuthButton configured={googleConfigured} onSuccess={google} errorMessage="Google registration failed. Please try again." /></div>
          <p className="mt-4 text-center text-sm muted">Already have an account? <Link className="auth-link font-black underline" href="/login">Login</Link></p>
        </form>
        <RegistrationNotes role={form.role} />
      </div>
      {editorOpen && editorSource ? <ProfilePhotoEditor sourceFile={editorSource} onCancel={() => setEditorOpen(false)} onSave={saveEditedImage} /> : null}
    </section>
  );
}
