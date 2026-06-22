import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(path), 'utf8');

describe('authentication dark-mode contrast', () => {
  it('uses semantic contrast classes for light surfaces and auth links', () => {
    const authForm = read('src/components/auth/AuthForm.js');
    const googleButton = read('src/components/auth/GoogleAuthButton.js');
    const roleSelector = read('src/components/auth/RoleSelector.js');
    const css = read('src/app/globals.css');

    expect(authForm).toContain('auth-link');
    expect(authForm).toContain('auth-preview');
    expect(googleButton).toContain('auth-light-surface');
    expect(roleSelector).toContain('auth-role-option');
    expect(css).toContain('.dark-mode .auth-link');
    expect(css).toContain('.auth-light-surface');
  });

  it('requests ten approved prompts for the initial marketplace page', () => {
    expect(read('src/components/prompts/AllPromptsClient.js')).toContain("limit: 10");
  });

  it('keeps account details out of the Google button until it is clicked', () => {
    const googleButton = read('src/components/auth/GoogleAuthButton.js');
    expect(googleButton).toContain('useGoogleLogin');
    expect(googleButton).toContain('Continue with Google');
    expect(googleButton).not.toContain('<GoogleLogin');
  });
});
