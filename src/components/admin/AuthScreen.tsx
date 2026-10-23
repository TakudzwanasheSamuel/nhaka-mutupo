"use client";

import { FormEvent, useState } from 'react';
import { resetPassword, signIn, signInWithGoogle, signUp } from '@/lib/firebase/repo';
import a from './admin.module.css';

type Mode = 'signIn' | 'signUp' | 'reset';

function friendly(e: unknown) {
  const code = (e as { code?: string })?.code ?? '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'That email and password do not match an account.';
  if (code.includes('email-already-in-use')) return 'An account with that email already exists. Try signing in.';
  if (code.includes('weak-password')) return 'Choose a password of at least 8 characters.';
  if (code.includes('invalid-email')) return 'That email address does not look right.';
  if (code.includes('popup-closed')) return 'The Google window was closed before signing in.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes and try again.';
  if (code.includes('network')) return 'No internet connection. Check your connection and try again.';
  if (code.includes('configuration-not-found'))
    return 'Sign-in is not switched on for this Firebase project yet. In the Firebase console, open Authentication and click Get started, then enable Email/Password and Google.';
  if (code.includes('operation-not-allowed'))
    return 'This way of signing in is turned off. In the Firebase console, open Authentication, then Sign-in method, and enable it.';
  if (code.includes('unauthorized-domain'))
    return 'This website is not on the allowed list. In the Firebase console, open Authentication, then Settings, then Authorised domains, and add it.';
  if (code.includes('permission-denied'))
    return 'The database refused access. Check that the rules from firestore.rules are published in the Firebase console.';
  return e instanceof Error ? e.message : 'Something went wrong. Please try again.';
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === 'signIn') await signIn(email, password);
      else if (mode === 'signUp') {
        if (password.length < 8) throw Object.assign(new Error(), { code: 'weak-password' });
        await signUp(name, email, password);
      } else {
        await resetPassword(email);
        setMessage('If that email has an account, a reset link is on its way. Check your inbox.');
      }
    } catch (err) {
      setError(friendly(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(friendly(err));
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'signIn' ? 'Sign in to review' : mode === 'signUp' ? 'Create a reviewer account' : 'Reset your password';

  return (
    <div className={a.center}>
      <form className={a.card} onSubmit={submit} noValidate>
        <img src="/brand/elephant-sm.webp" alt="" width={96} height={88} className={a.cardMascot} />
        <p className={a.eyebrow}>Nhaka Mutupo · Review</p>
        <h1 className={a.h1}>{title}</h1>
        {mode === 'signUp' && (
          <p className={a.muted}>New accounts can review once an admin approves them.</p>
        )}

        {mode === 'signUp' && (
          <label className={a.field}>
            <span>Your name</span>
            <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
          </label>
        )}
        <label className={a.field}>
          <span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        {mode !== 'reset' && (
          <label className={a.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
              minLength={8}
              required
            />
            {mode === 'signUp' && <small>At least 8 characters.</small>}
          </label>
        )}

        {error && (
          <p className={a.error} role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className={a.success} role="status">
            {message}
          </p>
        )}

        <button type="submit" className={a.btn} disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : mode === 'signUp' ? 'Create account' : 'Send reset link'}
        </button>

        {mode !== 'reset' && (
          <>
            <div className={a.or}>
              <span>or</span>
            </div>
            <button type="button" className={a.btnGhost} onClick={google} disabled={busy}>
              Continue with Google
            </button>
          </>
        )}

        <div className={a.switches}>
          {mode !== 'signIn' && (
            <button type="button" className={a.link} onClick={() => setMode('signIn')}>
              I already have an account
            </button>
          )}
          {mode !== 'signUp' && (
            <button type="button" className={a.link} onClick={() => setMode('signUp')}>
              Create an account
            </button>
          )}
          {mode === 'signIn' && (
            <button type="button" className={a.link} onClick={() => setMode('reset')}>
              Forgot password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
