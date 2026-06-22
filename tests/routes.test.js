import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('public authentication routes', () => {
  it.each(['login', 'register'])('exposes /%s through a direct App Router page', (route) => {
    expect(existsSync(resolve('src', 'app', route, 'page.js'))).toBe(true);
  });

  it('uses session-aware client protection without cookie-only page middleware', () => {
    expect(existsSync(resolve('src', 'proxy.js'))).toBe(false);
    const dashboardSource = readFileSync(resolve('src', 'components', 'dashboard', 'DashboardClient.js'), 'utf8');
    expect(dashboardSource).toContain('<PrivateRoute>');
  });

  it('keeps Pricing public and gates only checkout', () => {
    const paymentSource = readFileSync(resolve('src', 'components', 'payment', 'PaymentPage.js'), 'utf8');
    expect(paymentSource).not.toContain('<PrivateRoute>');
    expect(paymentSource).toContain("router.push('/login?next=%2Fpayment')");
  });

  it('keeps login and registration actions available in desktop and mobile navigation', () => {
    const headerSource = readFileSync(resolve('src', 'components', 'layout', 'Header.js'), 'utf8');
    expect(headerSource.match(/href="\/login"/g)).toHaveLength(2);
    expect(headerSource.match(/href="\/register"/g)).toHaveLength(2);
  });
});
