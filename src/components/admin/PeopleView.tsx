"use client";

import { useEffect, useState } from 'react';
import { Profile, Role, listUsers, removeUser, setRole } from '@/lib/firebase/repo';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

const ROLE_HELP: Record<Role, string> = {
  pending: 'Waiting for approval: cannot see the review screens.',
  reviewer: 'Can review, comment, edit entries, record and change status.',
  admin: 'Everything a reviewer can do, plus approve people, delete entries and import data.',
};

export function PeopleView() {
  const { me } = useAdminData();
  const [people, setPeople] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    listUsers()
      .then(setPeople)
      .catch(e => setError(e instanceof Error ? e.message : 'Could not load people.'));

  useEffect(() => {
    load();
  }, []);

  const change = async (p: Profile, role: Role) => {
    if (!me) return;
    await setRole(p, role, me);
    load();
  };

  const remove = async (p: Profile) => {
    if (!me || !window.confirm(`Remove ${p.name}'s access? They can sign up again and wait for approval.`)) return;
    await removeUser(p, me);
    load();
  };

  const waiting = people?.filter(p => p.role === 'pending') ?? [];

  return (
    <section>
      <h1 className={a.h1}>People</h1>
      <ul className={a.roleHelp}>
        {(Object.keys(ROLE_HELP) as Role[]).map(r => (
          <li key={r}>
            <span className={a.role} data-role={r}>
              {r}
            </span>{' '}
            {ROLE_HELP[r]}
          </li>
        ))}
      </ul>
      {error && <p className={a.error}>{error}</p>}
      {waiting.length > 0 && (
        <div className={a.banner} data-kind="warn">
          {waiting.length} {waiting.length === 1 ? 'person is' : 'people are'} waiting for approval.
        </div>
      )}
      {!people && !error && <p className={a.muted}>Loading…</p>}
      <ul className={a.list}>
        {people?.map(p => (
          <li key={p.uid} className={a.personRow}>
            <div>
              <strong>{p.name}</strong>
              <p className={a.muted}>
                {p.email} · joined {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={a.row}>
              <label className={a.field} data-inline>
                <span className="sr-only">Role for {p.name}</span>
                <select value={p.role} disabled={p.uid === me?.uid} onChange={e => change(p, e.target.value as Role)}>
                  <option value="pending">Waiting for approval</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              {p.role === 'pending' && (
                <button type="button" className={a.btn} onClick={() => change(p, 'reviewer')}>
                  Approve as reviewer
                </button>
              )}
              {p.uid !== me?.uid && (
                <button type="button" className={a.btnSmall} onClick={() => remove(p)}>
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
