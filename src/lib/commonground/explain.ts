/* ============================================================
   COMMONGROUND — explaining the conflict

   The feasibility logic in resolve.ts is deterministic and stays that way.
   This file only turns the structured result into sentences.

   WHY NO OPENAI PATH SHIPS
   The brief allows an LLM to phrase the explanation when a key is
   available. It is not wired up, for one reason: the portfolio is a fully
   prerendered static site with no server runtime and no API routes, so the
   only place a key could live is the browser bundle, where it would be
   readable by anyone who opens devtools. Shipping a public API key is not
   a tradeoff worth making for nicer wording.

   The seam is here rather than the call: `Explainer` is the interface, and
   `templateExplainer` is the implementation that ships. An LLM-backed
   explainer is the same signature behind a server route, and swapping it
   changes nothing else. Everything below is deterministic, so the feature
   is complete with no key, no network and no failure mode.
   ============================================================ */

import type { Diagnosis, Resolution, Suggestion } from './resolve';

export type Narrative = {
  /** the headline state */
  headline: string;
  /** "What is blocking agreement?" — one short paragraph */
  blocking: string;
  /** one line per constraint kind doing the damage */
  blockingDetail: string[];
  /** the lead-in above the suggestion list */
  unlockLead: string;
};

export type Explainer = (r: Resolution) => Narrative;

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

function blockingDetail(d: Diagnosis): string[] {
  return d.topBlockers.map(({ label, count }) =>
    label === 'vetoes'
      ? `${plural(count, 'option')} ruled out by someone outright`
      : `${plural(count, 'option')} removed by ${label}`,
  );
}

export const templateExplainer: Explainer = ({ diagnosis, suggestions, pairNote }) => {
  const headline =
    diagnosis.severity === 'infeasible'
      ? 'No feasible option'
      : diagnosis.severity === 'compromise'
        ? 'One person is carrying the compromise'
        : 'Nothing is blocking agreement';

  let blocking: string;
  if (diagnosis.severity === 'infeasible') {
    const worst = diagnosis.topBlockers[0];
    blocking = worst
      ? `Every option is out. The single biggest cause is ${worst.label}, which alone removes ${plural(
          worst.count,
          'option',
        )}.`
      : 'Every option has been removed or rejected by the group.';
  } else if (diagnosis.severity === 'compromise') {
    blocking = `${diagnosis.summary} Options exist, but the best one leaves somebody well below everyone else, which is the case the ranking is built to avoid.`;
  } else {
    blocking = 'There is at least one option that clears everyone’s hard constraints and nobody has vetoed.';
  }

  const unlockLead =
    suggestions.length === 0
      ? 'No single constraint change opens anything up. The group needs a different activity set, or someone has to drop a veto.'
      : pairNote
        ? pairNote
        : `Ranked by how small the ask is and how much it opens up — not by which gives the best group score.`;

  return { headline, blocking, blockingDetail: blockingDetail(diagnosis), unlockLead };
};

/** What the UI uses. */
export const explain: Explainer = templateExplainer;

/** One line per suggestion, already derived in resolve.ts. */
export function suggestionLine(s: Suggestion): string {
  return s.sentence;
}
