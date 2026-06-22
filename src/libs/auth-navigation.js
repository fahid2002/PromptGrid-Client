export function authDestination(mode) {
  return mode === 'register' ? '/login' : '/';
}
