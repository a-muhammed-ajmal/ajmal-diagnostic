import { resolveCalendlyLink, calendlyPopupUrl, POPUP_THEME } from './calendly';

// resolveCalendlyLink is the guard that stands between a missing env var and a dead
// booking button in production. calendlyPopupUrl exists because the old string
// concatenation produced a second "?" whenever the booking link already had a query.

const VALID = 'https://calendly.com/muhammed-ajmal/30min';

describe('resolveCalendlyLink — rejects unusable values', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['empty string', ''],
    ['whitespace only', '   '],
    // Next inlines a missing NEXT_PUBLIC_* var as this literal string — the original bug.
    ['the literal string "undefined"', 'undefined'],
  ])('throws a message naming the variable for %s', (_label, input) => {
    expect(() => resolveCalendlyLink(input)).toThrow(/NEXT_PUBLIC_CALENDLY_LINK is not set/);
  });

  it('throws on an unparseable value', () => {
    expect(() => resolveCalendlyLink('not-a-url')).toThrow(/is not a valid URL/);
  });

  it('throws on http, so the popup is never loaded over an insecure origin', () => {
    expect(() => resolveCalendlyLink('http://calendly.com/handle/30min')).toThrow(
      /must be an https:\/\/calendly\.com/,
    );
  });

  it('throws on a non-Calendly host', () => {
    expect(() => resolveCalendlyLink('https://example.com/handle/30min')).toThrow(
      /must be an https:\/\/calendly\.com/,
    );
  });

  it('throws on a lookalike host rather than matching on suffix', () => {
    expect(() => resolveCalendlyLink('https://calendly.com.evil.test/handle')).toThrow(
      /must be an https:\/\/calendly\.com/,
    );
  });

  it('throws on the bare domain — a booking link needs an event path', () => {
    expect(() => resolveCalendlyLink('https://calendly.com')).toThrow(/needs an event path/);
    expect(() => resolveCalendlyLink('https://calendly.com/')).toThrow(/needs an event path/);
  });
});

describe('resolveCalendlyLink — normalises valid values', () => {
  it('returns a well-formed link unchanged', () => {
    expect(resolveCalendlyLink(VALID)).toBe(VALID);
  });

  it('trims surrounding whitespace from a pasted value', () => {
    expect(resolveCalendlyLink(`  ${VALID}  `)).toBe(VALID);
  });

  it('accepts www.calendly.com and normalises it to the apex domain', () => {
    expect(resolveCalendlyLink('https://www.calendly.com/muhammed-ajmal/30min')).toBe(VALID);
  });

  it('strips a trailing slash', () => {
    expect(resolveCalendlyLink(`${VALID}/`)).toBe(VALID);
  });

  it('preserves a query string and hash', () => {
    const withQuery = `${VALID}?month=2026-08#pick`;
    expect(resolveCalendlyLink(withQuery)).toBe(withQuery);
  });

  it('strips the trailing slash even when a query string follows it', () => {
    expect(resolveCalendlyLink(`${VALID}/?month=2026-08`)).toBe(`${VALID}?month=2026-08`);
  });

  it('accepts a one-off /d/ scheduling link', () => {
    const oneOff = 'https://calendly.com/d/abc-def-ghi/intro-call';
    expect(resolveCalendlyLink(oneOff)).toBe(oneOff);
  });
});

describe('POPUP_THEME', () => {
  // The one place the brand hexes are pinned. Calendly cannot read our CSS custom
  // properties, so these literals are the only copy of the palette outside globals.css
  // — this test is what stops them silently surviving a rebrand, as the retired
  // orange/soft-white values once did. Update alongside globals.css, never separately.
  it('matches the current brand tokens in globals.css', () => {
    expect(POPUP_THEME).toEqual({
      background_color: 'FFFFFF', // --color-canvas
      text_color: '16181D', // --color-ink
      primary_color: '2563EB', // --color-brand
    });
  });

  it('carries no "#" — Calendly expects bare hex in the query string', () => {
    for (const value of Object.values(POPUP_THEME)) {
      expect(value).toMatch(/^[0-9A-F]{6}$/);
    }
  });
});

describe('calendlyPopupUrl', () => {
  it('applies every theme param', () => {
    const params = new URL(calendlyPopupUrl(VALID)).searchParams;
    for (const [key, value] of Object.entries(POPUP_THEME)) {
      expect(params.get(key)).toBe(value);
    }
  });

  it('keeps the booking path intact', () => {
    expect(calendlyPopupUrl(VALID).startsWith(`${VALID}?`)).toBe(true);
  });

  // Regression: the old template literal produced "...?month=2026-08?background_color=..."
  it('merges into an existing query string instead of adding a second "?"', () => {
    const url = calendlyPopupUrl(`${VALID}?month=2026-08`);
    expect(url.split('?')).toHaveLength(2);
    expect(new URL(url).searchParams.get('month')).toBe('2026-08');
    expect(new URL(url).searchParams.get('primary_color')).toBe(POPUP_THEME.primary_color);
  });

  it('overrides a pre-existing theme param rather than duplicating it', () => {
    const url = calendlyPopupUrl(`${VALID}?primary_color=000000`);
    expect(new URL(url).searchParams.getAll('primary_color')).toEqual([
      POPUP_THEME.primary_color,
    ]);
  });
});
