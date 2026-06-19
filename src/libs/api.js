import { normalizeApiError } from './utils.js';

export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, { credentials: 'include', ...options, headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers } });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(normalizeApiError(data));
  return data;
}
