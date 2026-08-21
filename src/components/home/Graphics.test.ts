import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('public Founder Dependency Index presentation', () => {
  it('does not show an unsupported home-page band meter', () => {
    const graphics = readFileSync(join(root, 'src', 'components', 'home', 'Graphics.tsx'), 'utf8');
    const home = readFileSync(join(root, 'src', 'app', 'page.tsx'), 'utf8');

    expect(graphics).not.toContain('IndexBandMeter');
    expect(graphics).not.toContain('Critical');
    expect(graphics).not.toContain('Developing');
    expect(graphics).not.toContain('Progressing');
    expect(home).not.toContain('IndexBandMeter');
  });
});
