import { ImageResponse } from 'next/og';

// Site-default Open Graph image. A per-article override lives alongside the article.
// Literal hex is unavoidable here: ImageResponse is rendered by Satori, which cannot read
// the CSS custom properties in globals.css. These values match the design tokens exactly
// (--color-navy #1A1A2E, --color-gold #FF6535, --color-ivory #F9FAFB).

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
          background: '#1A1A2E',
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
              border: '3px solid rgba(249,250,251,0.2)',
              borderRadius: 8,
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
              <span style={{ color: '#FF6535' }}>A</span>
            </div>
            <div
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 18,
                height: 18,
                borderTop: '4px solid #FF6535',
                borderRight: '4px solid #FF6535',
              }}
            />
          </div>
          <span
            style={{
              marginLeft: 28,
              color: '#F9FAFB',
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
            color: '#FFFFFF',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Build a business that grows beyond the founder.
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 48, height: 4, background: '#FF6535', marginRight: 20 }} />
          <span style={{ color: '#F9FAFB', fontSize: 24, fontWeight: 600 }}>
            Business Operations & Growth Consultant · Dubai, UAE
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
