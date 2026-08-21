import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('primary navigation Business Health Check CTA', () => {
  const source = readFileSync(join(process.cwd(), 'src', 'components', 'layout', 'Navigation.tsx'), 'utf8');

  it('uses the approved full label on desktop and mobile navigation', () => {
    const label = 'Start the Business Health Check →';

    expect(source.split(label)).toHaveLength(3);
    expect(source).not.toContain('Start the Check');
  });
});
