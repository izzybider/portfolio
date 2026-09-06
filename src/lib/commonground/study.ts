/* ============================================================
   COMMONGROUND — study record

   The session summary is assembled in the browser and stays there.
   Nothing is uploaded, and no name, email, demographic or free-form
   identifier is collected — participants are "Person 1" … "Person 6" and
   the session id is random.
   ============================================================ */

import type { RoundResult, SessionSummary } from './types';

export function newSessionId(): string {
  /* Random, not derived from anything about the group or the device. */
  const bytes = new Uint8Array(4);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return `cg-${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`;
}

export const emptyRound = (
  condition: RoundResult['condition'],
  setId: string,
  groupSize: number,
): RoundResult => ({
  condition,
  setId,
  groupSize,
  timeToDecisionMs: null,
  decisionReached: false,
  chosenActivityId: null,
  optionsConsidered: 0,
  vetoCount: 0,
  confidence: null,
  fairness: null,
  frustration: null,
  satisfaction: null,
  reuse: null,
  comment: '',
});

const seconds = (ms: number | null) => (ms === null ? '' : Math.round(ms / 1000));

export function summaryText(s: SessionSummary): string {
  const lines: string[] = [];
  lines.push('CommonGround study session');
  lines.push(`Session: ${s.sessionId}`);
  lines.push(`Recorded: ${s.createdAt}`);
  lines.push(`Design: ${s.twoRound ? 'two rounds, counterbalanced' : 'single round'}`);
  lines.push('');
  s.rounds.forEach((r, i) => {
    lines.push(`Round ${i + 1} — ${r.condition === 'baseline' ? 'Unstructured baseline' : 'CommonGround'}`);
    lines.push(`  activity set: ${r.setId}`);
    lines.push(`  group size: ${r.groupSize}`);
    lines.push(`  decision reached: ${r.decisionReached ? 'yes' : 'no'}`);
    lines.push(`  time to decision: ${seconds(r.timeToDecisionMs)}s`);
    lines.push(`  options considered: ${r.optionsConsidered}`);
    lines.push(`  vetoes / removals: ${r.vetoCount}`);
    lines.push(`  confidence (1-5): ${r.confidence ?? ''}`);
    lines.push(`  fairness (1-5): ${r.fairness ?? ''}`);
    lines.push(`  frustration (1-5): ${r.frustration ?? ''}`);
    lines.push(`  process satisfaction (1-5): ${r.satisfaction ?? ''}`);
    lines.push(`  would use again: ${r.reuse ?? ''}`);
    if (r.comment.trim()) lines.push(`  comment: ${r.comment.trim()}`);
    lines.push('');
  });
  lines.push('No names, emails or demographics were collected.');
  return lines.join('\n');
}

export const CSV_HEADER = [
  'session_id',
  'round',
  'condition',
  'activity_set',
  'group_size',
  'decision_reached',
  'time_to_decision_s',
  'options_considered',
  'veto_count',
  'confidence_1_5',
  'fairness_1_5',
  'frustration_1_5',
  'satisfaction_1_5',
  'would_use_again',
  'comment',
].join(',');

const csvCell = (v: unknown) => {
  const str = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export function summaryCsv(s: SessionSummary): string {
  const rows = s.rounds.map((r, i) =>
    [
      s.sessionId,
      i + 1,
      r.condition,
      r.setId,
      r.groupSize,
      r.decisionReached ? 'yes' : 'no',
      seconds(r.timeToDecisionMs),
      r.optionsConsidered,
      r.vetoCount,
      r.confidence,
      r.fairness,
      r.frustration,
      r.satisfaction,
      r.reuse,
      r.comment.trim(),
    ]
      .map(csvCell)
      .join(','),
  );
  return [CSV_HEADER, ...rows].join('\n');
}

export function summaryJson(s: SessionSummary): string {
  return JSON.stringify(s, null, 2);
}

/** A mailto the facilitator can send; the body is the same anonymous summary. */
export function mailtoHref(s: SessionSummary, to: string): string {
  const subject = `CommonGround study result ${s.sessionId}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    summaryText(s),
  )}`;
}

export function download(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
