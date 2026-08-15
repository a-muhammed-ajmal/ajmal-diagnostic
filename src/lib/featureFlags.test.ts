import { isFdiEnabled } from './featureFlags';

describe('FDI feature gate', () => {
  const initialValue = process.env.NEXT_PUBLIC_FDI_ENABLED;

  afterEach(() => {
    if (initialValue === undefined) delete process.env.NEXT_PUBLIC_FDI_ENABLED;
    else process.env.NEXT_PUBLIC_FDI_ENABLED = initialValue;
  });

  it('is disabled unless explicitly set to true', () => {
    delete process.env.NEXT_PUBLIC_FDI_ENABLED;
    expect(isFdiEnabled()).toBe(false);
    process.env.NEXT_PUBLIC_FDI_ENABLED = 'false';
    expect(isFdiEnabled()).toBe(false);
    process.env.NEXT_PUBLIC_FDI_ENABLED = 'true';
    expect(isFdiEnabled()).toBe(true);
  });
});
