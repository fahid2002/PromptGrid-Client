import { describe, expect, it } from 'vitest';
import { NOTIFICATION_POLL_MS } from '../src/data/notification-config.js';
import { dashboardEndpoint } from '../src/libs/utils.js';

describe('notification and audit navigation', () => {
  it('polls every 30 seconds and maps admin history', () => {
    expect(NOTIFICATION_POLL_MS).toBe(30000);
    expect(dashboardEndpoint('admin/audit')).toBe('/dashboard/admin/audit');
  });
});
