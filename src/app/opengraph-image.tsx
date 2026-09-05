import { ImageResponse } from 'next/og';

// Site-default Open Graph image. A per-article override lives alongside the article.
// Literal hex is unavoidable here: ImageResponse is rendered by Satori, which cannot read
// the CSS custom properties in globals.css. These values match the design tokens exactly
// (--color-brand #0066FF, --color-accent #FFCC00, --color-ink #000033,
//  --color-muted #475569, --color-brand-tint #E6F0FF).

export const alt = 'Muhammed Ajmal · Business Operations & Growth Consultant';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
          background: '#FFFFFF',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logomark — mirrors src/app/icon.tsx */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 84,
              height: 84,
              background: '#0066FF',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 44,
                fontWeight: 900,
                letterSpacing: '-2px',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>M</span>
              <span style={{ color: '#FFCC00' }}>A</span>
            </div>
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 16,
                height: 16,
                borderTop: '4px solid #FFCC00',
                borderRight: '4px solid #FFCC00',
              }}
            />
          </div>
          <span
            style={{
              marginLeft: 28,
              color: '#000033',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Muhammed Ajmal
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            color: '#000033',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
            letterSpacing: '-2px',
          }}
        >
          Build a business that grows beyond the founder.
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 48, height: 4, background: '#0066FF', marginRight: 20 }} />
          <span style={{ color: '#475569', fontSize: 24, fontWeight: 600 }}>
            Business Operations &amp; Growth Consultant · Dubai, UAE
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
