import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Arrow } from '@/components';
import CommonGroundApp from './CommonGroundApp';
import StudyResults from './StudyResults';
import { studyResultsVisible } from '@/data/commonground-study-preview';

export const metadata: Metadata = {
  title: 'CommonGround — Isabella Bider',
  description:
    'A consumer product experiment: can structured preference elicitation help a group reach a decision with less back-and-forth? Interactive prototype, and a 32-participant study that changed what I built.',
  openGraph: {
    title: 'CommonGround — Isabella Bider',
    description:
      'Can structured preference elicitation help a group reach a decision with less back-and-forth?',
  },
  alternates: { canonical: '/experiments/commonground' },
};

export default function CommonGroundPage() {
  return (
    <PageShell>
      <div className="demo">
        <div className="container">
          <header className="demo__head">
            <p className="eyebrow">Product experiment · CommonGround</p>
            <div className="demo__headrow">
              <h1 className="demo__title">CommonGround</h1>
              <span className="demo__badge">Interactive prototype · synthetic activity data</span>
            </div>
            <p className="lede demo__lede">
              Recommendation systems usually optimize for one person. Group decisions fail for
              different reasons: preferences conflict, people have vetoes, and the coordination
              itself is most of the cost.
            </p>
            <p className="demo__disclosure">
              Activities, prices and travel times are invented for this prototype — no venue here is
              a real business. Nothing is uploaded, no account is needed, and the ranking is
              deterministic: this is a structured recommendation and coordination system, not a
              model.
            </p>
            <div className="demo__actions">
              <a className="button button--quiet" href="#study-design">
                Study design <Arrow direction="down" />
              </a>
              <a
                className="button button--quiet"
                href="https://github.com/izzybider/portfolio/tree/main/src/lib/commonground"
                target="_blank"
                rel="noreferrer"
              >
                View source
              </a>
              <Link href="/#experiments" className="button button--quiet">
                Back to the portfolio
              </Link>
            </div>
          </header>

          <div className="cg-thesis">
            <div>
              <p className="caps cg-thesis__label">Problem</p>
              <p className="cg-body">
                Group recommenders optimize an average. Groups fail on vetoes and on the
                back-and-forth of coordinating at all.
              </p>
            </div>
            <div>
              <p className="caps cg-thesis__label">Product bet</p>
              <p className="cg-body">
                Capture hard constraints, soft preferences and vetoes separately, and rank by the
                least satisfied person before the group average.
              </p>
            </div>
            <div>
              <p className="caps cg-thesis__label">Measure</p>
              <p className="cg-body">
                Does structured capture reduce decision friction without making the process feel
                controlling?
              </p>
            </div>
          </div>

          <CommonGroundApp />
        </div>
      </div>

      <Section
        id="study-design"
        label="Study design"
        title="How the study was run."
        intro="A small within-group comparison across 9 friend groups. The method is here; the results are in the section below it."
        width="wide"
      >
        <div className="grid grid--2">
          <div className="demopanel">
            <div className="demopanel__head">
              <h3 className="demopanel__title">Hypothesis</h3>
            </div>
            <p className="reccard__value">
              Structured preference elicitation will reduce coordination friction and increase
              confidence in the final group decision, compared with unstructured group discussion.
            </p>
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              It held, but not the way it was written. The benefit turned out to depend entirely on
              whether the group had a real conflict to resolve — which is the finding, and the
              reason the product changed.
            </p>
          </div>
          <div className="demopanel">
            <div className="demopanel__head">
              <h3 className="demopanel__title">Conditions</h3>
            </div>
            <p className="reccard__value">
              <strong>A · Unstructured baseline.</strong> The same activity set, a timer, and the
              group decides however it normally would.
            </p>
            <p className="reccard__value" style={{ marginTop: 'var(--s2)' }}>
              <strong>B · CommonGround.</strong> Private preference capture, then the overlap, the
              conflicts and three explained options.
            </p>
            <p className="meta" style={{ marginTop: 'var(--s2)' }}>
              Two-round mode runs both with the same group, in randomised order, on two comparable
              activity sets so the second round is not decided from memory.
            </p>
          </div>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">What is recorded</h3>
            <span className="meta">client-side only</span>
          </div>
          <div className="table-wrap">
            <table className="table">
              <caption className="cg-caption">
                No names, emails, demographics or free-form identifiers. Participants are labelled
                Person 1 to Person 6 and the session id is random. Nothing is uploaded — the
                facilitator copies, emails or downloads the summary deliberately.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">How</th>
                  <th scope="col">The question it answers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Time to decision</td>
                  <td>Milliseconds from the round opening to a final choice</td>
                  <td>Is coordination actually faster?</td>
                </tr>
                <tr>
                  <td>Preference-entry time</td>
                  <td>CommonGround only, timed separately from the discussion after it</td>
                  <td>Or is the app just moving the friction into a form?</td>
                </tr>
                <tr>
                  <td>Decision reached</td>
                  <td>Whether the group chose anything at all</td>
                  <td>Do groups converge, or run out the clock?</td>
                </tr>
                <tr>
                  <td>Options considered</td>
                  <td>Baseline: options ticked. CommonGround: distinct options surfaced</td>
                  <td>Does structure reduce thrashing?</td>
                </tr>
                <tr>
                  <td>Vetoes / removals</td>
                  <td>Baseline: options ruled out. CommonGround: vetoes with a reason</td>
                  <td>How much conflict is being resolved at all?</td>
                </tr>
                <tr>
                  <td>Satisfaction, per person</td>
                  <td>
                    One 1–5 answer each, kept separate so the group minimum and the group average
                    can be read apart
                  </td>
                  <td>
                    Is the least-happy person better off — and does helping them cost everyone else?
                  </td>
                </tr>
                <tr>
                  <td>Fairness · frustration · confidence</td>
                  <td>Three 1–5 questions at the end of a round</td>
                  <td>Does the outcome feel balanced, and the process less annoying?</td>
                </tr>
                <tr>
                  <td>Reuse intent</td>
                  <td>Yes / maybe / no</td>
                  <td>Would anyone actually open it again?</td>
                </tr>
                <tr>
                  <td>Free-text comment</td>
                  <td>Optional, what was annoying or useful</td>
                  <td>What the numbers cannot say on their own</td>
                </tr>
                <tr>
                  <td>Conflict level</td>
                  <td>
                    Labelled low, medium or high after the round, by how many hard constraints and
                    vetoes actually collided
                  </td>
                  <td>Was this a group that needed help, or one that already agreed?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">How I read the data</h3>
            <span className="meta">decided before the sessions</span>
          </div>
          <p className="reccard__value">
            Nine groups is a sample for finding out how a product behaves, not for proving an
            effect in a population. So the cuts were written down first, and the reporting rules
            with them.
          </p>
          <ul className="cgs-list" style={{ marginTop: 'var(--s3)' }}>
            <li>
              Medians, not means. One twenty-minute argument would move an average of nine groups
              on its own.
            </li>
            <li>
              The group, not the person, is the unit of decision — the effective sample is the
              number of groups.
            </li>
            <li>
              Time decomposed: preference entry counted separately from the discussion after it,
              so a saving could not hide the cost that bought it.
            </li>
            <li>
              Satisfaction read twice: the group average, and the least-satisfied person. The
              ranking is built to move the second one.
            </li>
            <li>
              Rounds split by conflict level. That label can only be applied after a round has
              happened, so the split it produced is a reading of the data rather than a
              pre-registered hypothesis, and is reported as one.
            </li>
            <li>
              Rounds where CommonGround was slower, or ended with no choice, written up rather
              than averaged away.
            </li>
          </ul>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">How the ranking works</h3>
            <span className="meta">deterministic · same input, same output</span>
          </div>
          <ol className="cg-steps">
            <li>
              <strong>Remove hard-constraint violations.</strong> Over anyone&rsquo;s budget, longer
              than anyone&rsquo;s time, further than anyone will travel, wrong setting, wrong group
              size — gone, with the reason recorded.
            </li>
            <li>
              <strong>Heavily penalise vetoes.</strong> A veto is a hard no, not a low score. It is
              enough to take an option out of contention on its own.
            </li>
            <li>
              <strong>Maximise the least satisfied person.</strong> This is the product bet. An
              option three people love and one person hates loses to an option everyone is fine
              with.
            </li>
            <li>
              <strong>Then optimise group fit.</strong> The average is a tie-break, not the
              objective.
            </li>
          </ol>
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            Rejecting an option also teaches the shortlist: &ldquo;too expensive&rdquo; down-ranks
            everything at or above that price, &ldquo;wrong vibe&rdquo; down-ranks the category, and
            the app says which rejection changed the list.
          </p>
        </div>

        <div className="demopanel">
          <div className="demopanel__head">
            <h3 className="demopanel__title">When nothing fits</h3>
            <span className="meta">resolve the conflict</span>
          </div>
          <p className="reccard__value">
            Constraints often leave no option standing at all. Rather than loosening the ranking
            until something appears, the prototype diagnoses which constraints are doing the
            damage, then searches for the smallest change to one person&rsquo;s stated limit that
            would put real options back on the table.
          </p>
          <ol className="cg-steps" style={{ marginTop: 'var(--s3)' }}>
            <li>
              <strong>Diagnose.</strong> For every option, record which hard constraints eliminate
              it, who vetoed it, and whose preferences drag its score down.
            </li>
            <li>
              <strong>Search.</strong> Enumerate every minimal edit to a single stated constraint —
              a budget raised to exactly the price of the cheapest thing it blocks, a veto dropped,
              a setting requirement released — and re-run the ranker on each to measure what it
              actually opens up. Where no single change is enough, look for the smallest pair.
            </li>
            <li>
              <strong>Rank by the size of the ask,</strong> not by the group score, and check who is
              being asked. A change that lands on someone already carrying the group&rsquo;s
              compromises is moved down in favour of a comparable one that does not, and the app
              says when it has done that.
            </li>
            <li>
              <strong>Try it provisionally.</strong> Applying a suggestion layers it on top of what
              people answered and re-ranks. Nobody&rsquo;s stated preferences are edited, and Undo
              takes it straight back off.
            </li>
          </ol>
          <p className="meta" style={{ marginTop: 'var(--s3)' }}>
            Deterministic end to end: the same group answers always produce the same diagnosis and
            the same suggestions. No model is involved, and no key is needed.
          </p>
        </div>
      </Section>

      {/* Gated: real results would render on their own; the preview layout
          renders only with NEXT_PUBLIC_SHOW_COMMON_GROUND_STUDY_PREVIEW=true. */}
      {studyResultsVisible() ? <StudyResults /> : null}
    </PageShell>
  );
}
