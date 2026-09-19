export const metadata = {
  title: 'Terms | PromptGrid',
  description: 'Terms for using the PromptGrid AI prompt marketplace.',
};

export default function TermsPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <article className="hard-card mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-black">Terms</h1>
        <p className="mt-3 text-sm muted">Last updated: September 20, 2026</p>

        <div className="mt-8 grid gap-7 leading-7 muted">
          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">1. Using PromptGrid</h2>
            <p className="mt-3">PromptGrid is a marketplace for discovering, creating, reviewing, and managing AI prompts. By using the service, you agree to use it lawfully, protect your account, and follow these terms.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">2. Accounts</h2>
            <p className="mt-3">You are responsible for providing accurate account information and keeping your login details secure. Do not impersonate another person, share access in a way that creates a security risk, or use an account for unauthorized activity.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">3. Prompt content</h2>
            <p className="mt-3">You keep ownership of content you submit, but you give PromptGrid permission to store, display, moderate, index, and provide that content as part of the marketplace. Submit only content you own or have permission to share. Do not submit malware, illegal content, personal secrets, copyrighted material without permission, or content intended to harm people or systems.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">4. Moderation and enforcement</h2>
            <p className="mt-3">Prompts may be reviewed by automated tools and human moderators for safety, quality, clarity, and marketplace suitability. We may edit visibility, reject, remove, restrict, or suspend content and accounts that violate these terms or create risk for the community.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">5. AI Tools</h2>
            <p className="mt-3">AI-generated output can be incomplete, inaccurate, or unsuitable for your purpose. You are responsible for reviewing output before relying on it. Do not use PromptGrid or its AI output as a substitute for professional legal, medical, financial, security, or other expert advice.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">6. Premium access and payments</h2>
            <p className="mt-3">Some prompt content or features may require premium access. Payments are processed through Stripe and are subject to the price and checkout terms shown before payment. Access may be limited or changed if a payment is reversed, disputed, or found to be unauthorized.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">7. Availability and responsibility</h2>
            <p className="mt-3">We work to keep PromptGrid available and secure, but we do not guarantee uninterrupted service or that every prompt or AI response will be accurate. You are responsible for how you use prompts, generated output, and content discovered through the marketplace.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">8. Changes and contact</h2>
            <p className="mt-3">We may update these terms as PromptGrid evolves. Continued use after an update means you accept the revised terms. For questions about these terms, use the official PromptGrid support contact provided by the site owner.</p>
          </section>
        </div>
      </article>
    </section>
  );
}
