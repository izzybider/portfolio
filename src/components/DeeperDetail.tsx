/**
 * DeeperDetail — Level 3 material, one click away.
 *
 * The site is read at three speeds: a recruiter skimming the hero and the
 * glance, a hiring manager reading the sections, and an interviewer who wants
 * the scoring table and the trace. This wraps the third kind so it is
 * inspectable without being imposed on the first two. Native <details>, so it
 * stays keyboard-operable, screen-reader-announced, findable by in-page search
 * in most browsers, and present in the HTML for indexing.
 */
export default function DeeperDetail({
  summary,
  hint,
  children,
}: {
  summary: string;
  /** what the reader gets for opening it */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="deeper">
      <summary className="deeper__summary">
        <span className="deeper__mark" aria-hidden="true" />
        <span className="deeper__text">{summary}</span>
        {hint ? <span className="deeper__hint">{hint}</span> : null}
      </summary>
      <div className="deeper__body">{children}</div>
    </details>
  );
}
