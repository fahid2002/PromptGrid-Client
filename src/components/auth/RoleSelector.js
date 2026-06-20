const roles = [
  { value: 'user', label: 'User', description: 'Discover, save and review prompts' },
  { value: 'creator', label: 'Creator', description: 'Publish prompts after admin approval' },
  { value: 'admin', label: 'Admin', description: 'Use the fixed administrator credential' },
];

export function RoleSelector({ value, onChange, includeAdmin = false, compact = false }) {
  const visibleRoles = includeAdmin ? roles : roles.filter((role) => role.value !== 'admin');
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-black">Choose your role</legend>
      <div className={`grid gap-3 ${includeAdmin ? 'grid-cols-3' : 'sm:grid-cols-2'}`}>
        {visibleRoles.map((role) => (
          <label key={role.value} className={`auth-role-option cursor-pointer rounded-2xl border-2 transition ${compact ? 'p-3 text-center' : 'p-4'} ${value === role.value ? 'auth-role-selected border-[#17192d] bg-[#d9ff2f] shadow-[4px_4px_0_#17192d]' : 'border-[#17192d] bg-white/70 hover:bg-[#d9ff2f]/20'}`}>
            <input className="sr-only" type="radio" name="role" value={role.value} checked={value === role.value} onChange={() => onChange(role.value)} />
            <span className={`block font-display font-black ${compact ? 'text-sm' : 'text-lg'}`}>{role.label}</span>
            <span className={compact ? 'sr-only' : 'auth-role-description mt-1 block text-xs font-semibold leading-5 text-[#697086]'}>{role.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
