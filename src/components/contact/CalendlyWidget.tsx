'use client';
import Script from 'next/script';
import { track } from '@vercel/analytics';
import { CALENDLY_LINK } from '@/lib/env';

// Calendly attaches this to window once widget.js has loaded.
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const POPUP_URL = `${CALENDLY_LINK}?background_color=F9FAFB&text_color=1A1A2E&primary_color=FF6535`;

export function CalendlyWidget() {
  const openPopup = () => {
    track('calendly_click', { from: 'contact' });
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: POPUP_URL });
      return;
    }
    // widget.js has not finished loading — open the booking page directly so the
    // click is never lost.
    window.open(POPUP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <div className="bg-white border border-navy/10 rounded-xl p-6 md:p-8 shadow-sm">
        <button
          type="button"
          onClick={openPopup}
          className="w-full inline-flex items-center justify-center bg-gold text-navy font-heading font-bold py-4 px-8 rounded-xl text-base hover:bg-gold-bright transition-colors shadow-lg min-h-[52px]"
        >
          Book a Free 30-Minute Consultation →
        </button>
        <p className="font-body text-xs text-navy/40 text-center mt-3">
          Opens a scheduling window. Takes about a minute.
        </p>
      </div>
    </>
  );
}
