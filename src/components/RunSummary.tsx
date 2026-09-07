/* ============================================================
   RunSummary — "What just happened?"

   A four-beat plain-English account of a run, shown above the step trace
   so the point lands before the detail does. Every beat is derived from
   the run itself, not written per scenario, so it stays true whichever
   scenario and autonomy profile are selected.

   The trace is still there underneath, one click away.
   ============================================================ */

import type { Run } from '@/lib/trustlayer/pipeline';

const readable = (s: string) => s.replace(/_/g, ' ');

function whatItSaw(run: Run): string {
  const s = run.state;
  const gaps: string[] = [];
  if (s.evidence_status !== 'sufficient') gaps.push(`${readable(s.evidence_status)} evidence`);
  if (s.authorization_required && s.authorization_status !== 'present') {
    gaps.push(`${readable(s.authorization_status)} authorization`);
  }
  if (s.requires_professional_judgment) gaps.push('a decision a licensed human owns');
  if (s.risk_level === 'high' && s.reversible !== 'reversible') {
    gaps.push(`a ${readable(s.reversible)} high-risk action`);
  }

  const seen =
    gaps.length === 0
      ? 'sufficient evidence, and nothing needing permission'
      : gaps.length === 1
        ? gaps[0]
        : `${gaps.slice(0, -1).join(', ')} and ${gaps[gaps.length - 1]}`;

  return `TrustLayer saw ${seen} — so the policy chose ${run.decision.decision}.`;
}

function whatItDid(run: Run): string | null {
  if (run.tool_calls.length === 0) return null;
  const names = run.tool_calls.map((c) => `${c.tool}()`);
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `It called ${names.length === 1 ? 'the simulated tool' : `${names.length} simulated tools`}: ${list}.`;
}

function whatChanged(run: Run): string | null {
  const after = run.post_verification_decision;
  if (!after || !run.updated_state) return null;
  const before = run.state;
  const now = run.updated_state;

  const gains: string[] = [];
  const blocks: string[] = [];

  if (before.evidence_status !== now.evidence_status) {
    if (now.evidence_status === 'sufficient') gains.push('evidence became sufficient');
    else gains.push(`evidence moved to ${readable(now.evidence_status)}`);
  }
  if (before.authorization_status !== now.authorization_status) {
    if (now.authorization_status === 'present') gains.push('authorization was confirmed');
    else blocks.push(`authorization came back ${readable(now.authorization_status)}`);
  }
  /* A denied lookup leaves the status alone and clears the tool instead —
     that is what actually blocks the re-decision, so it has to be said. */
  if (before.tool_available && !now.tool_available) {
    blocks.push('authorization could not be established from any available tool');
  }

  /* "but" only when something actually blocks — otherwise the sentence
     contradicts itself ("evidence became sufficient, but authorization was
     confirmed"). */
  const parts = [...gains, ...blocks];
  const joiner = blocks.length > 0 ? ', but ' : ', and ';
  const joined =
    parts.length === 0
      ? 'the returned evidence did not change the decision state'
      : parts.length === 1
        ? parts[0]
        : `${parts.slice(0, -1).join(', ')}${joiner}${parts[parts.length - 1]}`;

  return `${joined[0].toUpperCase()}${joined.slice(1)} — so it decided again: ${after.decision}.`;
}

function whatItDidNotDo(run: Run): string {
  const b = run.final.behavior;
  if (b === 'ESCALATE') return 'It stopped and handed off, instead of generating an unsupported action.';
  if (b === 'ASK') return 'It asked for what was missing, instead of guessing and sounding confident.';
  if (b === 'VERIFY') return 'It went and checked, instead of answering from what it already had.';
  return 'It answered, because the evidence actually supported answering.';
}

export default function RunSummary({ run }: { run: Run }) {
  const beats = [whatItSaw(run), whatItDid(run), whatChanged(run), whatItDidNotDo(run)].filter(
    (b): b is string => Boolean(b),
  );

  return (
    <div className="runsum">
      <div className="runsum__head">
        <h3 className="runsum__title">What just happened?</h3>
        <span className={`runsum__final runsum__final--${run.final.behavior.toLowerCase()}`}>
          {run.final.behavior}
        </span>
      </div>
      <ol className="runsum__list">
        {beats.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ol>
      <p className="runsum__foot">{run.final.headline}.</p>
    </div>
  );
}
