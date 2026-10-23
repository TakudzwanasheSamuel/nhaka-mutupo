"use client";

import { useEffect, useState } from 'react';
import { AuthUser, Profile, ensureProfile, onAuthChange, repoConfigured, signOut, waitForSignUp } from '@/lib/firebase/repo';
import { AdminDataProvider } from './AdminData';
import { AuthScreen } from './AuthScreen';
import { AdminShell } from './AdminShell';
import a from './admin.module.css';

type State =
  | { kind: 'loading' }
  | { kind: 'signedOut' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; user: AuthUser; profile: Profile };

/**
 * The private review side, at /admin. Nothing here is linked from the game.
 * Without Firebase it still opens, read-only, on the built-in research data.
 */
export function AdminApp() {
  const configured = repoConfigured();
  const [state, setState] = useState<State>({ kind: configured ? 'loading' : 'signedOut' });

  useEffect(() => {
    if (!configured) return;
    let unsub: (() => void) | undefined;
    onAuthChange(async user => {
      if (!user) {
        setState({ kind: 'signedOut' });
        return;
      }
      try {
        await waitForSignUp();
        const profile = await ensureProfile(user);
        setState({ kind: 'ready', user, profile });
      } catch (e) {
        const text = e instanceof Error ? e.message : 'Something went wrong.';
        setState({
          kind: 'error',
          message: /insufficient permissions|permission-denied/i.test(text)
            ? 'You are signed in, but the database refused access. Publish the rules from firestore.rules in the Firebase console (Firestore Database, Rules), then sign in again.'
            : /client is offline|unavailable/i.test(text)
              ? 'You are signed in, but the database could not be reached. Check that a Firestore database has been created in the Firebase console (Firestore Database, Create database, with the ID "(default)"), that you are online, and that no antivirus or network filter is blocking firestore.googleapis.com. Then refresh this page.'
              : text,
        });
      }
    }).then(u => (unsub = u));
    return () => unsub?.();
  }, [configured]);

  if (!configured) {
    return (
      <AdminDataProvider me={null}>
        <AdminShell readOnly />
      </AdminDataProvider>
    );
  }

  if (state.kind === 'loading') {
    return (
      <div className={a.center}>
        <p className={a.muted}>Loading…</p>
      </div>
    );
  }

  if (state.kind === 'signedOut') return <AuthScreen />;

  if (state.kind === 'error') {
    return (
      <div className={a.center}>
        <div className={a.card}>
          <h1 className={a.h1}>Something went wrong</h1>
          <p>{state.message}</p>
          <button type="button" className={a.btn} onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (state.profile.role === 'pending') {
    return (
      <div className={a.center}>
        <div className={a.card}>
          <img src="/brand/elephant-sm.webp" alt="" width={96} height={88} className={a.cardMascot} />
          <h1 className={a.h1}>Waiting for approval</h1>
          <p>
            Thanks, {state.profile.name}. Your account has been created. An admin needs to approve it before you can
            review the totem data. You will see the review screens here once that is done.
          </p>
          <p className={a.muted}>Signed in as {state.profile.email}</p>
          <div className={a.row}>
            <button type="button" className={a.btn} onClick={() => window.location.reload()}>
              Check again
            </button>
            <button type="button" className={a.btnGhost} onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDataProvider me={state.profile}>
      <AdminShell />
    </AdminDataProvider>
  );
}
