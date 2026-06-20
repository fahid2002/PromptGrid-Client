export function initialRegistrationForm() {
  return { name: '', email: '', password: '', role: 'user', image: null };
}

export function buildRegistrationData(form) {
  const data = new FormData();
  data.set('name', form.name);
  data.set('email', form.email);
  data.set('password', form.password);
  data.set('role', form.role);
  if (form.image) data.set('image', form.image, form.image.name || 'profile-image');
  return data;
}

export function buildGoogleAuthPayload(credential, intent, role = 'user') {
  return { credential, intent, role };
}

export function isGoogleConfigured(clientId) {
  return Boolean(clientId && !clientId.startsWith('YOUR_') && clientId.includes('.apps.googleusercontent.com'));
}

export function googleButtonState(clientId) {
  return { visible: true, enabled: isGoogleConfigured(clientId) };
}

export function validateProfileImage(image) {
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowedTypes.has(image.type)) return 'Choose a JPEG, PNG, or WebP profile photo.';
  if (image.size > 5 * 1024 * 1024) return 'Profile photo must be 5 MB or smaller.';
  return null;
}
