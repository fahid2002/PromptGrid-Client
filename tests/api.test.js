import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../src/libs/api.js';

const response = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });

afterEach(() => vi.unstubAllGlobals());

describe('API session refresh', () => {
  it('refreshes once and retries the original request after access expiry', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(401, { message: 'Session expired' }))
      .mockResolvedValueOnce(response(200, { user: { role: 'user' } }))
      .mockResolvedValueOnce(response(200, { value: 'retried' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api('/dashboard')).resolves.toEqual({ value: 'retried' });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/api/dashboard', '/api/auth/refresh', '/api/dashboard']);
  });

  it('does not refresh authentication endpoints recursively', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(401, { message: 'Invalid email or password' }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(api('/auth/login', { method: 'POST', body: '{}' })).rejects.toThrow('Invalid email or password');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
