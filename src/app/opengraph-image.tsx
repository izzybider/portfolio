import { ImageResponse } from 'next/og';

/* Social preview card. Rendered at build time from the site's own tokens —
   no external assets, no claims that are not already on the homepage. */
export const runtime = 'nodejs';
export const alt = 'Isabella Bider — AI Product · 2027 New Grad';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#f7f6f1';
const INK = '#101010';
const MUTED = '#63635e';
const ACCENT = '#2b53c4';
const RULE = '#dcdbd5';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            AI Product · Technical Systems · Human Judgment
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.08,
              fontWeight: 700,
              color: INK,
              letterSpacing: -1.5,
            }}
          >
            Isabella Bider
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: INK,
              maxWidth: 900,
            }}
          >
            I build AI products around complex systems, human judgment, and
            real-world workflows.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${RULE}`,
            paddingTop: 28,
            fontSize: 24,
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex' }}>
            Northwestern · Biomedical Engineering + HCI
          </div>
          <div style={{ display: 'flex', color: ACCENT, fontWeight: 600 }}>
            2027 New Grad
          </div>
        </div>
      </div>
    ),
    size,
  );
}
