import { ImageResponse } from 'next/og';
import { getArticle } from '@/lib/articles';

// Per-article Open Graph image. Same navy template as the site default, with the
// article title. Literal hex matches the design tokens (Satori cannot read CSS vars).

const article = getArticle('the-5-stage-business-operating-system')!;

export const alt = article.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function ArticleOpengraphImage() {
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              border: '3px solid rgba(249,250,251,0.2)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', fontSize: 38, fontWeight: 900, letterSpacing: '-2px' }}>
              <span style={{ color: '#FFFFFF' }}>M</span>
              <span style={{ color: '#FF6535' }}>A</span>
            </div>
            <div
              style={{
                position: 'absolute',
                top: -3,
                right: -3,
                width: 16,
                height: 16,
                borderTop: '4px solid #FF6535',
                borderRight: '4px solid #FF6535',
              }}
            />
          </div>
          <span
            style={{
              marginLeft: 24,
              color: '#FF6535',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            {article.category}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#FFFFFF',
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.12,
            maxWidth: 960,
          }}
        >
          {article.title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 48, height: 4, background: '#FF6535', marginRight: 20 }} />
          <span style={{ color: '#F9FAFB', fontSize: 24, fontWeight: 600 }}>
            Muhammed Ajmal · Strategic Growth Architecture
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
