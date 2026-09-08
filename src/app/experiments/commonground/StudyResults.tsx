/* ============================================================
   COMMONGROUND — STUDY RESULTS

   Renders entirely from src/data/commonground-study-preview.ts and
   nothing else. While that file says `isPreview: true` this whole
   section is gated out of production and every block carries a PREVIEW
   stamp. Setting `isPreview: false` drops the stamps and turns it on.
   ============================================================ */

import { Section, Arrow, withArrows } from '@/components';
import {
  isPreview,
  STUDY,
  STORY,
  OVERALL,
  SUPPORTING,
  REUSE,
  TIME_SPLIT,
  SEGMENTS,
  SATISFACTION,
  RESOLUTION,
  RESOLVER_CHANGE,
  NEGATIVE,
  ASSUMPTION_CHANGE,
  THEMES,
  HEADLINES,
  DECISION,
  ITERATION,
  ANALYSIS,
  NEXT_TESTS,
  READING,
  LIMITATIONS,
  delta,
  formatValue,
  type Metric,
} from '@/data/commonground-study-preview';

function Stamp({ label = 'Preview' }: { label?: string }) {
  if (!isPreview) return null;
  return <span className="cgr-tag">{label}</span>;
}

function Card({ metric }: { metric: Metric }) {
  const d = delta(metric);
  return (
    <li className="cgr-card">
      <Stamp />
      <p className={`cgr-card__delta${d.improved ? ' is-good' : ' is-bad'}`}>
        {metric.kind === 'duration' ? (
          <>
            <Arrow direction={d.direction} />
            <span>{d.magnitude}</span>
          </>
        ) : (
          <span>
            {d.direction === 'up' ? '+' : '-'}
            {d.magnitude}
          </span>
        )}
      </p>
      <p className="cgr-card__label">{metric.label}</p>
      <p className="cgr-card__pair">
        {withArrows(
          `${formatValue(metric.kind, metric.baseline)} → ${formatValue(metric.kind, metric.commonground)}`,
        )}
      </p>
      <p className="cgr-card__q">{metric.question}</p>
    </li>
  );
}

export default function StudyResults() {
  const segMax = Math.max(...SEGMENTS.flatMap((s) => [s.baseline, s.commonground]));
  const timeMax = Math.max(TIME_SPLIT.totalBaseline, TIME_SPLIT.totalCommonGround);

  return (
    <Section
      id="study-results"
      label={isPreview ? 'Study results · preview layout' : 'Study results'}
      title={
        isPreview
          ? 'Preview layout — replace with real study data.'
          : 'What the sessions produced.'
      }
      intro={
        isPreview
          ? 'These values are shown only to build and review the finished layout. Nothing here has been observed. Replace with actual study data before publishing as evidence.'
          : undefined
      }
      width="wide"
    >
      {isPreview && (
        <p className="cgr-disclosure">
          <strong>Preview values for design only. Not user-study results.</strong> The study has not
          been run. Every figure, theme and quote below is written to lay out the finished case and
          comes from a single data file that gets replaced wholesale.
        </p>
      )}

      {/* ---------- 0 · the whole arc, for a reader who skims ---------- */}
      <div className="cgs-story">
        <div className="demopanel__head">
          <h3 className="demopanel__title">The case in six lines</h3>
          <Stamp />
        </div>
        <ol className="cgs-story__list">
          {STORY.map((s) => (
            <li key={s.id}>
              <p className="caps cgs-story__label">{s.label}</p>
              <p className="cgs-story__line">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- 1–2 · hypothesis + design ---------- */}
      <div className="grid grid--2">
        <div className="cgr-insight">
          <div className="demopanel__head">
            <h3 className="demopanel__title">Hypothesis</h3>
            <Stamp />
          </div>
          <p className="cgr-insight__claim">{STUDY.hypothesis}</p>
        </div>
        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">Study design</h3>
            <Stamp />
          </div>
          <p className="cgs-sample">
            <strong>{STUDY.participants}</strong> participants ·{' '}
            <strong>{STUDY.groups}</strong> groups of {STUDY.groupSizeLabel}
          </p>
          <ul className="cgs-list">
            <li>{STUDY.design}</li>
            {STUDY.rounds.map((r) => (
              <li key={r}>{r}</li>
            ))}
            <li>{STUDY.ordering}</li>
            <li>{STUDY.setting}</li>
          </ul>
        </div>
      </div>

      {/* ---------- 3 · overall result ---------- */}
      <div className="cgr-band">
        <div className="cgr-band__head">
          <h3 className="cgr-q">{HEADLINES.overall}</h3>
          <p className="cgr-sample">
            {STUDY.participants} participants · {STUDY.groups} groups
          </p>
        </div>
        <ul className="cgr-cards">
          {OVERALL.map((m) => (
            <Card key={m.id} metric={m} />
          ))}
        </ul>
      </div>

      {/* ---------- 4 · the aggregate hid the result ---------- */}
      <div className="cgs-turn">
        <p className="caps cgs-turn__label">But</p>
        <p className="cgs-turn__line">Not every group benefited.</p>
        <p className="cg-body">
          The overall number is an average across groups that were not facing the same problem.
          Split by how much the group actually disagreed, it separates completely — and one segment
          moves the wrong way.
        </p>
      </div>

      {/* ---------- 5 · conflict segmentation ---------- */}
      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">Split by how much the group disagreed</h3>
          <Stamp />
        </div>
        <p className="cg-note">Median time to decision, in minutes.</p>
        <ul className="cgs-seg">
          {SEGMENTS.map((s) => (
            <li key={s.id} className={s.changePct > 0 ? 'is-worse' : ''}>
              <div className="cgs-seg__head">
                <p className="cgs-seg__label">{s.label}</p>
                <p className={`cgs-seg__change${s.changePct > 0 ? ' is-worse' : ''}`}>
                  {s.changePct > 0 ? `${s.changePct}% slower` : `${Math.abs(s.changePct)}% faster`}
                </p>
              </div>
              <div className="cgs-seg__bars">
                <span className="cgs-bar cgs-bar--base" style={{ width: `${(s.baseline / segMax) * 100}%` }}>
                  <em>{s.baseline}</em>
                </span>
                <span
                  className={`cgs-bar ${s.changePct > 0 ? 'cgs-bar--worse' : 'cgs-bar--cg'}`}
                  style={{ width: `${(s.commonground / segMax) * 100}%` }}
                >
                  <em>{s.commonground}</em>
                </span>
              </div>
              <p className="cgs-seg__reading">
                {s.reading} <span className="cgs-seg__reuse">{s.reuseIntent}% would use it again</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="cgr-seg__key">
          <span className="cgr-swatch cgr-swatch--base" /> Baseline
          <span className="cgr-swatch cgr-swatch--cg" /> CommonGround
        </p>
        <p className="cg-body cgr-arg">{HEADLINES.segment}</p>
      </div>

      {/* ---------- 6 · mechanism ---------- */}
      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">Where the time actually went</h3>
          <Stamp />
        </div>
        <p className="cgs-mech">{HEADLINES.mechanism}</p>
        <div className="cgs-time">
          {TIME_SPLIT.rows.map((r) => (
            <div className="cgs-time__row" key={r.id}>
              <p className="cgs-time__label">
                {r.label}
                <span>{r.note}</span>
              </p>
              <div className="cgs-time__bars">
                <span className="cgs-bar cgs-bar--base" style={{ width: `${Math.max(2, (r.baseline / timeMax) * 100)}%` }}>
                  <em>{r.baseline}</em>
                </span>
                <span className="cgs-bar cgs-bar--cg" style={{ width: `${Math.max(2, (r.commonground / timeMax) * 100)}%` }}>
                  <em>{r.commonground}</em>
                </span>
              </div>
            </div>
          ))}
          <div className="cgs-time__row cgs-time__row--total">
            <p className="cgs-time__label">Total</p>
            <p className="cgs-time__total">
              {withArrows(`${TIME_SPLIT.totalBaseline} min → ${TIME_SPLIT.totalCommonGround} min`)}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- 7 · fairness ---------- */}
      <div className="grid grid--2">
        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">Average versus least-satisfied</h3>
            <Stamp />
          </div>
          <div className="cgr-fair">
            {(['baseline', 'commonground'] as const).map((who) => (
              <div className="cgr-fair__col" key={who}>
                <p className="caps cgr-fair__who">{who === 'baseline' ? 'Baseline' : 'CommonGround'}</p>
                <p className="cgr-fair__stat">
                  <span>{SATISFACTION[who].average.toFixed(1)} / 5</span>
                  <small>average</small>
                </p>
                <p className="cgr-fair__stat cgr-fair__stat--key">
                  <span>{SATISFACTION[who].minimum.toFixed(1)} / 5</span>
                  <small>least satisfied</small>
                </p>
                <p className="cgs-gap">gap {SATISFACTION[who].gap}</p>
              </div>
            ))}
          </div>
          <p className="cg-body cgr-arg">{SATISFACTION.reading}</p>
          <p className="cg-note" style={{ marginTop: 'var(--s2)' }}>
            {HEADLINES.fairnessNuance}
          </p>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">When nothing was feasible</h3>
            <Stamp />
          </div>
          <p className="cgs-sample">
            <strong>{RESOLUTION.roundsWithNoFeasibleOption}</strong> rounds started with no option
            that cleared everyone
          </p>
          <ul className="cgs-list">
            <li>
              <strong>{RESOLUTION.acceptedARelaxation}/{RESOLUTION.roundsWithNoFeasibleOption}</strong>{' '}
              took one of the proposed minimal relaxations
            </li>
            <li>
              <strong>{RESOLUTION.tookFirstRanked}/{RESOLUTION.roundsWithNoFeasibleOption}</strong>{' '}
              took the one ranked first
            </li>
            <li>
              <strong>{RESOLUTION.tookAnotherSuggestion}/{RESOLUTION.roundsWithNoFeasibleOption}</strong>{' '}
              took a different suggestion
            </li>
            <li>
              <strong>{RESOLUTION.negotiatedManually}/{RESOLUTION.roundsWithNoFeasibleOption}</strong>{' '}
              ignored the suggestions and negotiated it out
            </li>
          </ul>
          <p className="cgs-mech" style={{ marginTop: 'var(--s3)' }}>
            {withArrows(`${RESOLUTION.manualMinutes} min manual → ${RESOLUTION.assistedMinutes} min assisted`)}
          </p>
          <p className="cg-body cgr-arg">{RESOLUTION.reading}</p>
        </div>
      </div>

      {/* ---------- supporting measures ---------- */}
      <div className="demopanel demopanel--quiet">
        <div className="demopanel__head">
          <h3 className="demopanel__title">Supporting measures</h3>
          <Stamp />
        </div>
        <div className="cgr-rows">
          {SUPPORTING.map((m) => {
            const d = delta(m);
            return (
              <div className="cgr-row" key={m.id}>
                <p className="cgr-row__label">
                  {m.label}
                  <span className="cgr-row__note">{m.question}</span>
                </p>
                <p className="cgr-row__pair">
                  {withArrows(
                    `${formatValue(m.kind, m.baseline)} → ${formatValue(m.kind, m.commonground)}`,
                  )}
                </p>
                <p className={`cgr-row__delta${d.improved ? ' is-good' : ' is-bad'}`}>
                  {d.direction === 'up' ? '+' : '-'}
                  {d.magnitude}
                </p>
              </div>
            );
          })}
          <div className="cgr-row">
            <p className="cgr-row__label">
              Would use it again
              <span className="cgr-row__note">of {REUSE.of} participants</span>
            </p>
            <p className="cgr-row__pair cgr-row__pair--single">
              {REUSE.yes}/{REUSE.of}
            </p>
            <p className="cgr-row__delta cgr-row__delta--none">{REUSE.percent}%</p>
          </div>
        </div>
      </div>

      {/* ---------- 9 · what did not work ---------- */}
      <div className="cgs-assumption">
        <div>
          <p className="caps cgs-turn__label">Before</p>
          <p className="cgs-assumption__before">{ASSUMPTION_CHANGE.before}</p>
        </div>
        <Arrow />
        <div>
          <p className="caps cgs-turn__label">After</p>
          <p className="cgs-assumption__after">{ASSUMPTION_CHANGE.after}</p>
        </div>
      </div>

      <div className="cgr-mixed">
        <div className="demopanel__head">
          <h3 className="demopanel__title">What did not work</h3>
          <Stamp />
        </div>
        <p className="cgr-insight__claim">{NEGATIVE.finding}</p>
        <p className="cg-body">{NEGATIVE.detail}</p>
        <p className="caps cgr-mixed__label">What that means</p>
        <p className="cg-body">{NEGATIVE.consequence}</p>
      </div>

      {/* ---------- 10 · themes ---------- */}
      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">What people said</h3>
          <span className="meta">free-text comments, four recurring themes</span>
        </div>
        <ul className="cgs-themes">
          {THEMES.map((t) => (
            <li key={t.id}>
              <p className="cgs-themes__theme">{t.theme}</p>
              {t.quote ? <p className="cgs-themes__quote">&ldquo;{t.quote}&rdquo;</p> : null}
              <p className="cgs-themes__so">{t.soWhat}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- 11 · the decision ---------- */}
      <div className="cgs-decision">
        <p className="caps cgs-turn__label">The product learning</p>
        <p className="cgs-decision__learning">{DECISION.learning}</p>
        <p className="caps cgs-turn__label" style={{ marginTop: 'var(--s3)' }}>
          The principle it produced
        </p>
        <p className="cgs-decision__principle">{DECISION.principle}</p>
      </div>

      {/* ---------- 12 · iteration ---------- */}
      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">What I changed as a result</h3>
          <Stamp />
        </div>
        <p className="caps cgs-change__num">Change 1 · progressive structure</p>
        <p className="cg-body">
          One flow became two, chosen by whether the group actually has a conflict to resolve.
        </p>
        <div className="cgs-modes">
          {ITERATION.map((m) => (
            <div className="cgs-mode" key={m.id}>
              <p className="cgs-mode__name">{m.name}</p>
              <p className="cgs-mode__for">{m.forWho}</p>
              <ul className="cgs-mode__asks">
                {m.asks.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="cgs-mode__note">{m.note}</p>
            </div>
          ))}
        </div>

        <p className="caps cgs-change__num">Change 2 · compromise load in the resolver</p>
        <div className="cgs-change">
          <div>
            <p className="caps cgs-turn__label">What people did</p>
            <p className="cg-body">{RESOLVER_CHANGE.observation}</p>
          </div>
          <div>
            <p className="caps cgs-turn__label">Why it mattered</p>
            <p className="cg-body">{RESOLVER_CHANGE.why}</p>
          </div>
          <div>
            <p className="caps cgs-turn__label">What changed</p>
            <p className="cg-body">{RESOLVER_CHANGE.change}</p>
          </div>
        </div>
      </div>

      {/* ---------- 12b · how the data was cut ---------- */}
      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">How I cut the data</h3>
          <Stamp />
        </div>
        <p className="cg-note">
          Eight passes over the same {STUDY.groups * 2} rounds. The third one is the case study.
        </p>
        <ol className="cgs-cuts">
          {ANALYSIS.map((c) => (
            <li key={c.id}>
              <p className="cgs-cuts__cut">{c.cut}</p>
              <p className="cgs-cuts__why">{c.why}</p>
              <p className="cgs-cuts__found">{c.found}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- 13 · how to read the numbers ---------- */}
      <div className="cgs-reading">
        <div className="demopanel__head">
          <h3 className="demopanel__title">How to read these numbers</h3>
          <Stamp />
        </div>
        <p className="cgr-insight__claim">{READING.claim}</p>
        <ul className="cgs-list">
          {READING.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
      </div>

      {/* ---------- 14–15 · next and limits ---------- */}
      <div className="grid grid--2">
        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">What I would test next</h3>
          </div>
          <ul className="cgs-list">
            {NEXT_TESTS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="demopanel demopanel--quiet">
          <div className="demopanel__head">
            <h3 className="demopanel__title">Limitations</h3>
          </div>
          <ul className="cgs-list">
            {LIMITATIONS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
