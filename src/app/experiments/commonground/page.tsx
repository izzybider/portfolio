import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Arrow } from '@/components';
import CommonGroundApp from './CommonGroundApp';

export const metadata: Metadata = {
  title: 'CommonGround — Isabella Bider',
  description:
    'A consumer product experiment: can structured preference elicitation help a group reach a decision with less back-and-forth? Interactive prototype with a running study.',
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
        title="What I am actually testing."
        intro="A small within-group comparison, run in person. It is not running yet, and no results are claimed anywhere on this site."
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
              Stated as a hypothesis, not a finding. A handful of in-person sessions cannot
              establish it, and the summary the app produces says so.
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Time to decision</td>
                  <td>Milliseconds from the round opening to a final choice</td>
                </tr>
                <tr>
                  <td>Decision reached</td>
                  <td>Whether the group chose anything at all</td>
                </tr>
                <tr>
                  <td>Options considered</td>
                  <td>Baseline: options ticked. CommonGround: distinct options surfaced</td>
                </tr>
                <tr>
                  <td>Vetoes / removals</td>
                  <td>Baseline: options ruled out. CommonGround: vetoes with a reason</td>
                </tr>
                <tr>
                  <td>Confidence · fairness · frustration · satisfaction</td>
                  <td>Four 1–5 questions, answered by the group at the end of a round</td>
                </tr>
                <tr>
                  <td>Reuse intent</td>
                  <td>Yes / maybe / no</td>
                </tr>
                <tr>
                  <td>Free-text comment</td>
                  <td>Optional, what was annoying or useful</td>
                </tr>
              </tbody>
            </table>
          </div>
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
      </Section>
    </PageShell>
  );
}
