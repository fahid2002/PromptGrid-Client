import { describe, expect, it } from 'vitest';
import { NOTIFICATION_POLL_MS } from '../src/data/notification-config.js';
import { dashboardEndpoint } from '../src/libs/utils.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isDismissKey, shouldDismissPopover } from '../src/libs/popover.js';

describe('notification and audit navigation', () => {
  it('polls every 30 seconds and maps admin history', () => {
    expect(NOTIFICATION_POLL_MS).toBe(30000);
    expect(dashboardEndpoint('admin/audit')).toBe('/dashboard/admin/audit');
  });

  it('dismisses only outside pointer targets and Escape keys', () => {
    const inside = {};
    const outside = {};
    const container = { contains: (target) => target === inside };
    expect(shouldDismissPopover(container, inside)).toBe(false);
    expect(shouldDismissPopover(container, outside)).toBe(true);
    expect(isDismissKey('Escape')).toBe(true);
    expect(isDismissKey('Enter')).toBe(false);
  });

  it('closes notifications on outside interaction and navigation', () => {
    const source = readFileSync(resolve('src/components/notifications/NotificationBell.js'), 'utf8');
    expect(source).toContain("addEventListener('pointerdown'");
    expect(source).toContain("addEventListener('keydown'");
    expect(source).toContain('usePathname');
  });
});
