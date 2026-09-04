/**
 * CaseGlance — the 20-second read of a case study.
 *
 * A recruiter should be able to stop after the hero and this block and still
 * know what was broken, what I owned, what changed because of the evidence,
 * and what came of it. Four fixed dimensions, deliberately identical across
 * every case so the four projects can be compared rather than re-learned.
 *
 * `outcome.status` labels what kind of evidence the last cell carries, so a
 * measured pilot result and a proposed validation plan never look alike.
 */
export type GlanceStatus = 'measured' | 'proposed' | 'benchmark' | 'internal';

const STATUS_LABEL: Record<GlanceStatus, string> = {
  measured: 'Measured',
  proposed: 'Not yet validated',
  benchmark: 'Synthetic benchmark',
  internal: 'Client work · figures withheld',
};

export default function CaseGlance({
  problem,
  role,
  decision,
  outcome,
  status,
}: {
  problem: React.ReactNode;
  role: React.ReactNode;
  decision: React.ReactNode;
  outcome: React.ReactNode;
  status: GlanceStatus;
}) {
  const cells: { term: string; body: React.ReactNode; tag?: string }[] = [
    { term: 'Problem', body: problem },
    { term: 'My role', body: role },
    { term: 'Key decision', body: decision },
    { term: 'Outcome', body: outcome, tag: STATUS_LABEL[status] },
  ];

  return (
    <section className="glance" aria-label="Case at a glance">
      <div className="container">
        <p className="caps glance__label">Case at a glance</p>
        <dl className="glance__grid">
          {cells.map((cell) => (
            <div className="glance__cell" key={cell.term}>
              <dt className="glance__term">
                {cell.term}
                {cell.tag ? (
                  <span className="glance__tag">{cell.tag}</span>
                ) : null}
              </dt>
              <dd className="glance__body">{cell.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
