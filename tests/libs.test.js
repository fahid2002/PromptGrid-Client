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
import * as utils from '../src/libs/utils.js';
import { buildGoogleAuthPayload, buildRegistrationData, initialRegistrationForm, isGoogleConfigured, validateProfileImage } from '../src/libs/registration.js';
import * as registration from '../src/libs/registration.js';
import { authDestination } from '../src/libs/auth-navigation.js';

describe('client contracts', () => {
  it('uses the required post-authentication destinations', () => {
    expect(authDestination('register')).toBe('/login');
    expect(authDestination('login')).toBe('/');
  });

  it('renders analytics charts only for array data', () => {
    expect(utils.isChartData?.([{ title: 'Prompt', copies: 1 }])).toBe(true);
    expect(utils.isChartData?.(10)).toBe(false);
    expect(utils.isChartData?.(null)).toBe(false);
  });
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

  it('defaults registration to the public user role', () => {
    expect(initialRegistrationForm()).toEqual({ name: '', email: '', password: '', role: 'user', image: null });
  });

  it('builds multipart registration data with the selected role and optional image', () => {
    const image = new Blob(['profile'], { type: 'image/png' });
    const data = buildRegistrationData({ name: 'Creator', email: 'creator@example.com', password: 'securepass123', role: 'creator', image });
    expect(Object.fromEntries([...data.entries()].filter(([key]) => key !== 'image'))).toEqual({ name: 'Creator', email: 'creator@example.com', password: 'securepass123', role: 'creator' });
    expect(data.get('image')).toBeInstanceOf(Blob);
  });

  it('builds intent-aware Google payloads', () => {
    expect(buildGoogleAuthPayload('token', 'register', 'creator')).toEqual({ accessToken: 'token', intent: 'register', role: 'creator' });
    expect(buildGoogleAuthPayload('token', 'login')).toEqual({ accessToken: 'token', intent: 'login', role: 'user' });
  });

  it('does not treat the environment template as Google configuration', () => {
    expect(isGoogleConfigured('YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID')).toBe(false);
    expect(isGoogleConfigured('')).toBe(false);
    expect(isGoogleConfigured('123.apps.googleusercontent.com')).toBe(true);
  });

  it('keeps the Google control visible while credentials are being configured', () => {
    expect(registration.googleButtonState?.('YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID')).toEqual({ visible: true, enabled: false });
    expect(registration.googleButtonState?.('123.apps.googleusercontent.com')).toEqual({ visible: true, enabled: true });
  });

  it('validates profile image type and size', () => {
    expect(validateProfileImage({ type: 'text/plain', size: 10 })).toBe('Choose a JPEG, PNG, or WebP profile photo.');
    expect(validateProfileImage({ type: 'image/png', size: (5 * 1024 * 1024) + 1 })).toBe('Profile photo must be 5 MB or smaller.');
    expect(validateProfileImage({ type: 'image/webp', size: 1024 })).toBeNull();
  });
});
