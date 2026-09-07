'use client';

/* ============================================================
   COMMONGROUND — "Resolve the conflict"

   Shown when nothing clears everyone's constraints, or when the best
   option leaves one person well below the rest. Everything on screen is
   computed in src/lib/commonground/resolve.ts by re-running the real
   ranker; no sentence here is written by hand and no model is involved.

   Applying a suggestion is provisional. It edits nobody's stated
   preferences — it layers a relaxation on top, re-ranks, and can be undone.
   ============================================================ */

import Arrow from '@/components/Arrow';
import { explain } from '@/lib/commonground/explain';
import type { Relaxation, Resolution, Suggestion } from '@/lib/commonground/resolve';

const KIND_LABEL: Record<Suggestion['kind'], string> = {
  budget: 'Budget',
  time: 'Time',
  travel: 'Travel',
  setting: 'Setting',
  veto: 'Veto',
};

export default function ResolveConflict({
  resolution,
  applied,
  onApply,
  onUndo,
  onReset,
}: {
  resolution: Resolution;
  applied: Relaxation[];
  onApply: (r: Relaxation) => void;
  onUndo: () => void;
  onReset: () => void;
}) {
  const { diagnosis, suggestions, fairnessNote } = resolution;
  const narrative = explain(resolution);
  const infeasible = diagnosis.severity === 'infeasible';

  return (
    <section className={`cgx${infeasible ? ' cgx--hard' : ''}`} aria-label="Resolve the conflict">
      <div className="cgx__head">
        <div>
          <p className="caps cgx__state">{narrative.headline}</p>
          <h3 className="cg-h3">Resolve the conflict</h3>
        </div>
        <span className="cgx__badge">deterministic · no model</span>
      </div>

      {/* ---------- what is blocking ---------- */}
      <div className="cgx__block">
        <p className="caps cgx__label">What is blocking agreement?</p>
        <p className="cg-body">{narrative.blocking}</p>
        {narrative.blockingDetail.length > 0 && (
          <ul className="cgx__causes">
            {narrative.blockingDetail.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- applied relaxations ---------- */}
      {applied.length > 0 && (
        <div className="cgx__applied" role="status">
          <p className="caps cgx__label">Trying</p>
          <ul className="cgx__appliedlist">
            {applied.map((r) => (
              <li key={r.id}>
                <span className="cgx__who">{r.participantLabel}</span> {KIND_LABEL[r.kind]}{' '}
                {r.from} <Arrow /> {r.to}
              </li>
            ))}
          </ul>
          <div className="cgx__undo">
            <button type="button" className="button button--quiet" onClick={onUndo}>
              Undo last change
            </button>
            <button type="button" className="button button--quiet" onClick={onReset}>
              Reset all
            </button>
          </div>
          <p className="cg-note">
            Nobody&rsquo;s stated preferences were edited. These sit on top of the answers and come
            straight back off.
          </p>
        </div>
      )}

      {/* ---------- fairness ---------- */}
      {fairnessNote && (
        <p className="cgx__fair">
          <span className="caps cgx__fairlabel">Fairness</span>
          {fairnessNote}
        </p>
      )}

      {/* ---------- suggestions ---------- */}
      {(diagnosis.severity !== 'none' || suggestions.length > 0) && (
      <div className="cgx__block">
        <p className="caps cgx__label">What would unlock more options?</p>
        <p className="cg-note cgx__lead">{narrative.unlockLead}</p>

        {suggestions.length === 0 ? (
          <p className="cg-body">
            Nothing here can be relaxed into a working option. This is the honest answer rather than
            a worse recommendation.
          </p>
        ) : (
          <ol className="cgx__list">
            {suggestions.map((s) => (
              <li key={s.id} className="cgx__item">
                <div className="cgx__itemhead">
                  <span className="cgx__kind">{KIND_LABEL[s.kind]}</span>
                  <p className="cgx__sentence">{s.sentence}</p>
                </div>

                <dl className="cgx__facts">
                  <div>
                    <dt>Options unlocked</dt>
                    <dd>
                      {s.unlocks.length === 0
                        ? 'none on its own'
                        : s.unlockedNames.slice(0, 3).join(' · ') +
                          (s.unlockedNames.length > 3
                            ? ` · +${s.unlockedNames.length - 3} more`
                            : '')}
                    </dd>
                  </div>
                  <div>
                    <dt>Tradeoff</dt>
                    <dd>{s.tradeoff}</dd>
                  </div>
                  {s.additionalCompromise.length > 0 && (
                    <div>
                      <dt>Takes on compromise</dt>
                      <dd>{s.additionalCompromise.join(', ')}</dd>
                    </div>
                  )}
                </dl>

                <div className="cgx__act">
                  <button
                    type="button"
                    className="button button--primary cgx__try"
                    onClick={() => onApply(s)}
                  >
                    Try this change
                  </button>
                  {s.demotedForFairness && (
                    <span className="cgx__demoted">moved down to spread the compromise</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      )}

      <p className="cg-note cgx__foot">
        Relaxations are searched by enumerating every minimal change to one stated constraint, then
        re-running the ranker to measure what each one actually opens up. Ranked on size of ask,
        options unlocked and who has already given ground — not on group score.
      </p>
    </section>
  );
}
