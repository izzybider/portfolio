/**
 * Arrow — a drawn arrow, not a font glyph.
 *
 * The webfonts are loaded with the `latin` subset, whose unicode-range
 * excludes U+2192 and friends, so a literal "→" silently falls back to
 * whatever system font happens to have it: wrong weight on every platform,
 * and an empty box on the ones that have nothing. Every arrow that is part of
 * the interface is drawn here instead, in currentColor at the text size.
 */
export default function Arrow({
  direction = 'right',
}: {
  direction?: 'right' | 'left' | 'down' | 'up';
}) {
  const rotation =
    direction === 'left'
      ? 180
      : direction === 'down'
        ? 90
        : direction === 'up'
          ? -90
          : 0;

  return (
    <svg
      className="arrow"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/**
 * Splits a display string on "→" and draws the arrows instead of typing them.
 * Used where the arrow is set in the display face at large sizes, so a
 * fallback glyph would be obvious — metric values, proof lists, chips.
 */
export function withArrows(text: string): React.ReactNode {
  if (!text.includes('\u2192')) return text;
  const parts = text.split('\u2192');
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? <Arrow /> : null}
    </span>
  ));
}
