import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1A2E',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 7,
            height: 7,
            borderTop: '2px solid #FF6535',
            borderRight: '2px solid #FF6535',
          }}
        />
        <div
          style={{
            fontSize: 15,
            fontWeight: 900,
            fontFamily: 'sans-serif',
            display: 'flex',
            letterSpacing: '-0.5px',
          }}
        >
          <span style={{ color: '#FFFFFF' }}>M</span>
          <span style={{ color: '#FF6535' }}>A</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
