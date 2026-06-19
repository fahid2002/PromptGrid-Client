export const privatePrefixes = ['/dashboard', '/prompts', '/payment'];
export const formatNumber = (value) => Number(value || 0).toLocaleString();
export const normalizeApiError = (value) => value?.message || 'Something went wrong';
export const initials = (name = '') => name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
export const reportReasons = ['Inappropriate Content', 'Spam', 'Copyright Violation'];

export function dashboardEndpoint(view, page = 1) {
  const endpoints = {
    '': '/dashboard',
    'my-prompts': '/dashboard/prompts',
    'saved-prompts': '/dashboard/bookmarks',
    'my-reviews': '/dashboard/reviews',
    analytics: '/dashboard/analytics',
    'admin/users': '/dashboard/admin/users',
    'admin/payments': '/dashboard/admin/payments',
    'admin/reports': '/dashboard/admin/reports',
    'admin/analytics': '/dashboard/admin/stats',
  };
  if (view === 'admin/prompts') return `/dashboard/admin/prompts?page=${page}&limit=6`;
  return endpoints[view] ?? null;
}
