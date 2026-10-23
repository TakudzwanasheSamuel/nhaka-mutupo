"use client";

import { useState } from 'react';
import { STATUS_LABEL, Status, answerPicture } from '@/lib/content';
import { EntryPicture } from '@/components/content/EntryPicture';
import { useAdminData } from './AdminData';
import a from './admin.module.css';

/** A printable sheet for reviewers who prefer paper: tick, cross or correct each pairing. */
export function ReviewSheet() {
  const { content } = useAdminData();
  const [only, setOnly] = useState<'all' | Status>('pending');
  const list = content.entries
    .filter(e => only === 'all' || e.status === only)
    .sort((x, y) => x.name.localeCompare(y.name));

  return (
    <section className={a.sheet}>
      <div className={`${a.sectionHead} ${a.noPrint}`}>
        <h1 className={a.h1}>Review sheet</h1>
        <div className={a.row}>
          <label className={a.field} data-inline>
            <span>Include</span>
            <select value={only} onChange={e => setOnly(e.target.value as 'all' | Status)}>
              <option value="pending">Waiting for review</option>
              <option value="unresolved">Unresolved</option>
              <option value="verified">Verified</option>
              <option value="all">All entries</option>
            </select>
          </label>
          <button type="button" className={a.btn} onClick={() => window.print()}>
            Print or save as PDF
          </button>
        </div>
      </div>

      <div className={a.printHead}>
        <h1>Nhaka Mutupo: cultural review sheet</h1>
        <p>
          Reviewer: ______________________ Community / language: ______________________ Date: ____________
        </p>
        <p>
          For each entry, tick if the name, spelling, picture and pairing are right, cross if wrong, and write the correction.
          Note where it differs between clans.
        </p>
      </div>

      <table className={a.sheetTable}>
        <thead>
          <tr>
            <th>Picture</th>
            <th>Totem and pairing</th>
            <th>Other names (community)</th>
            <th>Research notes</th>
            <th>Correct?</th>
            <th>Corrections</th>
          </tr>
        </thead>
        <tbody>
          {list.map(e => {
            const pic = answerPicture(e, content);
            return (
              <tr key={e.id}>
                <td>
                  <EntryPicture entryId={e.id} size={64} decorative />
                </td>
                <td>
                  <strong lang="sn">{e.name}</strong>
                  <br />
                  {pic?.name ?? 'No picture'} · {e.kind}
                  <br />
                  <span className={a.tiny}>{STATUS_LABEL[e.status]}</span>
                </td>
                <td className={a.small}>{e.otherNames.map(n => `${n.name} (${n.community})`).join(', ') || 'None'}</td>
                <td className={a.small}>{e.notes}</td>
                <td className={a.tickCell}>☐ Yes&nbsp;&nbsp;☐ No</td>
                <td className={a.writeCell} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
