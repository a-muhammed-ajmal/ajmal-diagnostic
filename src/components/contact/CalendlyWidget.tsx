'use client';
import { useEffect } from 'react';

export function CalendlyWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget rounded-xl overflow-hidden border border-navy/10"
      data-url={`${process.env.NEXT_PUBLIC_CALENDLY_LINK}?background_color=F9FAFB&text_color=1A1A2E&primary_color=FF6535`}
      style={{ minWidth: '320px', height: '700px' }}
    />
  );
}
