export function RegistrationNotes({ role }) {
  const roleLabel = role === 'creator' ? 'Creator' : 'User';
  return (
    <aside className="hard-card rounded-[2rem] p-6 sm:p-7 md:sticky md:top-28" aria-label="Registration notes">
      <p className="section-label">Registration notes</p>
      <h2 className="mt-2 font-display text-2xl font-black">Data saved securely</h2>
      <p className="mt-4 text-sm leading-7 muted">Your account is stored in MongoDB, your password is hashed, and login creates a secure HTTP-only JWT cookie.</p>
      <ul className="mt-6 grid gap-3 text-sm font-bold muted">
        <li>✓ Name and unique email</li>
        <li>✓ Optional Cloudinary profile photo</li>
        <li>✓ Role: {roleLabel}</li>
        <li>✓ Subscription: Free</li>
        {role === 'creator' ? <li>✓ Prompts require admin approval</li> : <li>✓ Save, copy and review prompts</li>}
      </ul>
      <div className="auth-light-surface mt-7 rounded-2xl border border-[#17192d]/15 bg-[#f4f6ff] p-4 text-xs font-semibold leading-5">
        Administrator accounts are never available from public registration.
      </div>
    </aside>
  );
}
