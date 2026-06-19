import { normalizeApiError } from './utils.js';

// Common API helper function for frontend requests
export async function api(path, options = {}) {
  // Send request to Next.js API route
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    ...options,

    headers: {
      // Do not manually set Content-Type for FormData uploads
      ...(options.body instanceof FormData
        ? {}
        : {
            'Content-Type': 'application/json',
          }),

      // Keep any extra headers passed from the component
      ...options.headers,
    },
  });

  // Return null if backend sends no content
  if (response.status === 204) return null;

  // Try to read JSON response safely
  const data = await response.json().catch(() => ({}));

  // If request fails, show normalized backend error
  if (!response.ok) {
    throw new Error(normalizeApiError(data));
  }

  // Return successful response data
  return data;
}