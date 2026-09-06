/* ============================================================
   COMMONGROUND — RESULTS SECTION

   Renders entirely from src/data/commonground-placeholder-results.ts.
   While that object carries `isPlaceholder: true` every block draws an
   ILLUSTRATIVE tag, the headline deltas are marked as targets rather than
   outcomes, and the section does not render in production at all unless
   NEXT_PUBLIC_SHOW_CG_PLACEHOLDER=true.

   Setting `isPlaceholder: false` removes the tags and the disclosures and
   turns the section on. Nothing else changes.
   ============================================================ */

import { Section, Arrow, withArrows } from '@/components';
import {
  RESULTS,
  delta,
  formatValue,
  type ComparisonMetric,
  type SingleMetric,
} from '@/data/commonground-placeholder-results';

const {
  isPlaceholder,
  sampleSize,
  headlineQuestion,
  primary,
  secondary,
  single,
  segments,
  segmentReading,
  fairness,
  insight,
  mixedFinding,
  loop,
} = RESULTS;

/** Small mono tag. Disappears the moment the data stops being invented. */
function Illustrative({ label = 'Illustrative placeholder' }: { label?: string }) {
  if (!isPlaceholder) return null;
  return <span className="cgr-tag">{label}</span>;
}

function DeltaValue({ metric }: { metric: ComparisonMetric }) {
  const d = delta(metric);
  const tone = d.improved ? ' is-good' : ' is-bad';

  return (
    <p className={`cgr-card__delta${tone}`}>
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
  );
}

function PrimaryCard({ metric }: { metric: ComparisonMetric }) {
  return (
    <li className="cgr-card">
      <Illustrative label="Illustrative" />
      <DeltaValue metric={metric} />
      <p className="cgr-card__label">{metric.label}</p>
      <p className="cgr-card__pair">
        {withArrows(
          `${formatValue(metric.kind, metric.baseline)} → ${formatValue(
            metric.kind,
            metric.commonground,
          )}`,
        )}
      </p>
      <p className="cgr-card__q">{metric.question}</p>
    </li>
  );
}

function SecondaryRow({ metric }: { metric: ComparisonMetric }) {
  const d = delta(metric);
  return (
    <div className="cgr-row">
      <p className="cgr-row__label">
        {metric.label}
        <span className="cgr-row__note">{metric.question}</span>
      </p>
      <p className="cgr-row__pair">
        {withArrows(
          `${formatValue(metric.kind, metric.baseline)} → ${formatValue(
            metric.kind,
            metric.commonground,
          )}`,
        )}
      </p>
      <p className={`cgr-row__delta${d.improved ? ' is-good' : ' is-bad'}`}>
        {d.direction === 'up' ? '+' : '-'}
        {d.magnitude}
      </p>
    </div>
  );
}

function SingleRow({ metric }: { metric: SingleMetric }) {
  return (
    <div className="cgr-row">
      <p className="cgr-row__label">
        {metric.label}
        <span className="cgr-row__note">{metric.question}</span>
      </p>
      <p className="cgr-row__pair cgr-row__pair--single">
        {formatValue(metric.kind, metric.value)}
      </p>
      <p className="cgr-row__delta cgr-row__delta--none">no baseline</p>
    </div>
  );
}

export default function ResultsPreview() {
  const segmentMax = Math.max(
    ...segments.flatMap((s) => [s.baseline, s.commonground]),
  );

  return (
    <Section
      id="results-layout"
      label={isPlaceholder ? 'Results layout' : 'Results'}
      title={
        isPlaceholder
          ? 'Illustrative results layout — replace with real study data.'
          : 'What the sessions produced.'
      }
      intro={
        isPlaceholder
          ? 'These values are shown only to preview the intended results layout. Replace with actual study data before publishing as evidence.'
          : undefined
      }
      width="wide"
    >
      {isPlaceholder ? (
        <p className="cgr-disclosure">
          <strong>Placeholder values shown for design/reference only. Not
          user-study results.</strong>{' '}
          Nothing below has been observed. The numbers are invented to design
          how the section should read once the study has actually been run, and
          every figure comes from a single data object that gets replaced
          wholesale.
        </p>
      ) : null}

      {/* ---------- primary band ---------- */}

      <div className="cgr-band">
        <div className="cgr-band__head">
          <h3 className="cgr-q">{headlineQuestion}</h3>
          <p className="cgr-sample">
            {sampleSize
              ? `${sampleSize.groups} groups · ${sampleSize.rounds} rounds`
              : 'Sample size — to be recorded'}
          </p>
        </div>
        <ul className="cgr-cards">
          {primary.map((m) => (
            <PrimaryCard key={m.id} metric={m} />
          ))}
        </ul>
        {isPlaceholder ? (
          <p className="cgr-note">
            Each figure above is an illustrative target, not an observed
            outcome. Deltas are computed from the placeholder values rather than
            written down, so they cannot drift out of step with them.
          </p>
        ) : null}
      </div>

      {/* ---------- why these ---------- */}

      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">Why these four</h3>
          <span className="meta">what this section will measure</span>
        </div>
        <p className="cg-lede">
          CommonGround is not optimized only for speed. The stronger product
          signal is whether the group reaches a decision without one person
          consistently absorbing the compromise.
        </p>
        <dl className="cgr-why">
          <div>
            <dt>Time</dt>
            <dd>Did coordination get faster?</dd>
          </div>
          <div>
            <dt>Completion</dt>
            <dd>Did groups actually converge?</dd>
          </div>
          <div>
            <dt>Fairness</dt>
            <dd>Did the process feel balanced?</dd>
          </div>
          <div>
            <dt>Minimum satisfaction</dt>
            <dd>Did the least-satisfied person improve?</dd>
          </div>
          <div>
            <dt>Friction</dt>
            <dd>Did vetoes and back-and-forth decrease?</dd>
          </div>
        </dl>
      </div>

      {/* ---------- secondary ---------- */}

      <div className="demopanel demopanel--quiet">
        <div className="demopanel__head">
          <h3 className="demopanel__title">Supporting measures</h3>
          <Illustrative />
        </div>
        <div className="cgr-rows">
          {secondary.map((m) => (
            <SecondaryRow key={m.id} metric={m} />
          ))}
          {single.map((m) => (
            <SingleRow key={m.id} metric={m} />
          ))}
        </div>
      </div>

      {/* ---------- fairness + segmentation ---------- */}

      <div className="grid grid--2">
        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">Average versus minimum</h3>
            <Illustrative />
          </div>
          <div className="cgr-fair">
            <div className="cgr-fair__col">
              <p className="caps cgr-fair__who">Baseline</p>
              <p className="cgr-fair__stat">
                <span>{fairness.baseline.average} / 5</span>
                <small>average</small>
              </p>
              <p className="cgr-fair__stat cgr-fair__stat--key">
                <span>{fairness.baseline.minimum} / 5</span>
                <small>minimum</small>
              </p>
            </div>
            <div className="cgr-fair__col">
              <p className="caps cgr-fair__who">CommonGround</p>
              <p className="cgr-fair__stat">
                <span>{fairness.commonground.average} / 5</span>
                <small>average</small>
              </p>
              <p className="cgr-fair__stat cgr-fair__stat--key">
                <span>{fairness.commonground.minimum} / 5</span>
                <small>minimum</small>
              </p>
            </div>
          </div>
          <p className="cg-body cgr-arg">{fairness.argument}</p>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">By decision difficulty</h3>
            <Illustrative />
          </div>
          <p className="cg-note">Median time to decision, in minutes.</p>
          <ul className="cgr-seg">
            {segments.map((s) => (
              <li key={s.id}>
                <p className="cgr-seg__label">{s.label}</p>
                <div className="cgr-seg__bars">
                  <span
                    className="cgr-seg__bar cgr-seg__bar--base"
                    style={{ width: `${(s.baseline / segmentMax) * 100}%` }}
                  >
                    <em>{s.baseline}</em>
                  </span>
                  <span
                    className="cgr-seg__bar cgr-seg__bar--cg"
                    style={{ width: `${(s.commonground / segmentMax) * 100}%` }}
                  >
                    <em>{s.commonground}</em>
                  </span>
                </div>
                <p className="cgr-seg__reading">{s.reading}</p>
              </li>
            ))}
          </ul>
          <p className="cgr-seg__key">
            <span className="cgr-swatch cgr-swatch--base" /> Baseline
            <span className="cgr-swatch cgr-swatch--cg" /> CommonGround
          </p>
          <p className="cg-body cgr-arg">{segmentReading}</p>
        </div>
      </div>

      {/* ---------- insight + mixed finding ---------- */}

      <div className="grid grid--2">
        <div className="cgr-insight">
          <div className="demopanel__head">
            <h3 className="demopanel__title">
              {isPlaceholder ? 'Illustrative product insight' : 'Product insight'}
            </h3>
            <Illustrative />
          </div>
          <p className="cgr-insight__claim">{insight.claim}</p>
          <p className="cg-body">{insight.consequence}</p>
        </div>

        <div className="cgr-mixed">
          <div className="demopanel__head">
            <h3 className="demopanel__title">
              {isPlaceholder ? 'Illustrative mixed finding' : 'Mixed finding'}
            </h3>
            <Illustrative />
          </div>
          <p className="cgr-insight__claim">{mixedFinding.finding}</p>
          <p className="caps cgr-mixed__label">Product response</p>
          <p className="cg-body">{mixedFinding.productResponse}</p>
          <p className="cgr-mixed__next">
            Leads to <strong>{mixedFinding.leadsTo}</strong>
            <span className="cgr-pill">next iteration · not built</span>
          </p>
        </div>
      </div>

      {/* ---------- product loop ---------- */}

      <div className="demopanel">
        <div className="demopanel__head">
          <h3 className="demopanel__title">The loop this feeds</h3>
          <span className="meta">observation to next decision</span>
        </div>
        <ol className="cgr-loop">
          {loop.map((step, i) => (
            <li key={step.label}>
              <p className="caps cgr-loop__label">{step.label}</p>
              <p className="cgr-loop__body">{step.body}</p>
              {i < loop.length - 1 ? (
                <span className="cgr-loop__arrow" aria-hidden="true">
                  <Arrow direction="down" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
