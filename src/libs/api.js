import { normalizeApiError } from './utils.js';

let refreshPromise = null;
// These endpoints return action-specific 401 responses (invalid MFA code,
// expired challenge, invalid reset code, etc.). Refreshing here would replace
// that useful error with a misleading "session expired" message.
const noRefreshPaths = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/refresh',
  '/auth/mfa/verify-login',
  '/auth/mfa/send-email-login',
  '/auth/mfa/verify-email-login',
  '/auth/password/reset/send-code',
  '/auth/password/reset',
]);

function requestOptions(options) {
  return {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };
}

async function readResponse(response) {
  if (response.status === 204) return null;
  return response.json().catch(() => ({}));
}

async function refreshSession() {
  const response = await fetch('/api/auth/refresh', requestOptions({ method: 'POST' }));
  const data = await readResponse(response);
  if (!response.ok) throw new Error(normalizeApiError(data));
  return data;
}

export async function api(path, options = {}, canRefresh = true) {
  const response = await fetch(`/api${path}`, requestOptions(options));
  const data = await readResponse(response);

  if (response.status === 401 && canRefresh && !noRefreshPaths.has(path)) {
    refreshPromise ||= refreshSession().finally(() => { refreshPromise = null; });
    await refreshPromise;
    return api(path, options, false);
  }

  if (!response.ok) throw new Error(normalizeApiError(data));
  return data;
}
