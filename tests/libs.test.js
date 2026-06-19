import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  dashboardEndpoint,
  formatNumber,
  normalizeApiError,
  privatePrefixes,
  reportReasons,
} from '../src/libs/utils.js';

describe('client contracts', () => {
  // Tests number formatting without adding any fake values
  it('formats only the actual number received', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(1234)).toBe('1,234');
  });

  // Tests API error message normalization
  it('normalizes API messages', () => {
    expect(normalizeApiError({ message: 'Denied' })).toBe('Denied');
    expect(normalizeApiError(null)).toBe('Something went wrong');
  });

  // Tests all protected route prefixes
  it('lists every private route prefix', () => {
    expect(privatePrefixes).toEqual([
      '/dashboard',
      '/prompts',
      '/payment',
    ]);
  });

  // Tests dashboard endpoint generation for admin prompt pagination
  it('builds paginated admin prompt endpoints', () => {
    expect(dashboardEndpoint('admin/prompts', 3)).toBe(
      '/dashboard/admin/prompts?page=3&limit=6'
    );

    expect(dashboardEndpoint('profile', 1)).toBeNull();
  });

  // Tests report reason values accepted by the API
  it('uses only the report reasons accepted by the API', () => {
    expect(reportReasons).toEqual([
      'Inappropriate Content',
      'Spam',
      'Copyright Violation',
    ]);
  });
});