// Routes that require logged-in user access
export const privatePrefixes = [
  '/dashboard',
  '/prompts',
  '/payment',
];

// Formats numbers with commas
export const formatNumber = (value) =>
  Number(value || 0).toLocaleString();

export const isChartData = (value) => Array.isArray(value);

// Normalizes API error message
export const normalizeApiError = (value) =>
  value?.message || 'Something went wrong';

// Creates initials from user name
export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// Report reason options
export const reportReasons = [
  'Inappropriate Content',
  'Spam',
  'Copyright Violation',
];

export function dashboardEndpoint(view, page = 1) {
  // Dashboard API endpoints based on current dashboard view
  const endpoints = {
    '': '/dashboard',
    'my-prompts': '/dashboard/prompts',
    'saved-prompts': '/dashboard/bookmarks',
    'my-reviews': '/dashboard/reviews',
    analytics: '/dashboard/analytics',
    'admin/users': '/dashboard/admin/users',
    'admin/payments': '/dashboard/admin/payments',
    'admin/reports': '/dashboard/admin/reports',
    'admin/audit': '/dashboard/admin/audit',
    'admin/analytics': '/dashboard/admin/stats',
  };

  // Admin prompts endpoint needs pagination
  if (view === 'admin/prompts') {
    return `/dashboard/admin/prompts?page=${page}&limit=6`;
  }

  // Return matching endpoint, otherwise null
  return endpoints[view] ?? null;
}
