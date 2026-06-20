import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('public authentication routes', () => {
  it.each(['login', 'register'])('exposes /%s through a direct App Router page', (route) => {
    expect(existsSync(resolve('src', 'app', route, 'page.js'))).toBe(true);
  });

  it('protects private routes with the current access-cookie name', () => {
    const proxySource = readFileSync(resolve('src', 'proxy.js'), 'utf8');
    expect(proxySource).toContain("request.cookies.get('promptgrid_access')");
    expect(proxySource).not.toContain("request.cookies.get('promptgrid_token')");
  });

  it('keeps login and registration actions available in desktop and mobile navigation', () => {
    const headerSource = readFileSync(resolve('src', 'components', 'layout', 'Header.js'), 'utf8');
    expect(headerSource.match(/href="\/login"/g)).toHaveLength(2);
    expect(headerSource.match(/href="\/register"/g)).toHaveLength(2);
  });
});
