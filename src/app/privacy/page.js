export const metadata = {
  title: 'Privacy | PromptGrid',
  description: 'How PromptGrid collects, uses, and protects information.',
};

export default function PrivacyPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <article className="hard-card mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-black">Privacy</h1>
        <p className="mt-3 text-sm muted">Last updated: September 20, 2026</p>

        <div className="mt-8 grid gap-7 leading-7 muted">
          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">1. What this notice covers</h2>
            <p className="mt-3">This notice explains what PromptGrid may collect when you browse the marketplace, create an account, submit prompts, use AI Tools, or contact us. We aim to collect only information needed to operate and improve the service.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">2. Information we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Account information such as your name, email address, role, profile image, and authentication provider.</li>
              <li>Prompt content, tags, reviews, bookmarks, copies, reports, notifications, and dashboard activity.</li>
              <li>Session and security information stored in secure authentication cookies.</li>
              <li>Payment and subscription records, such as transaction and Stripe session identifiers. Payment card details are handled by Stripe rather than stored by PromptGrid.</li>
              <li>Technical information needed to keep the website secure and functioning, such as request and error information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">3. How we use information</h2>
            <p className="mt-3">We use information to authenticate accounts, publish and moderate prompts, provide bookmarks and reviews, process premium access, respond to reports, improve search and recommendations, prevent abuse, and maintain the security and reliability of PromptGrid.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">4. AI Tools and third-party services</h2>
            <p className="mt-3">When you use an AI Tool or the assistant, the text and context needed for that request may be sent from our server to Google Gemini to generate a response, improve a prompt, run a prompt, moderate content, search prompts, or answer a question. Do not submit passwords, payment details, private keys, confidential business information, or other sensitive data.</p>
            <p className="mt-3">PromptGrid also relies on service providers for hosting, database storage, authentication, image storage, payment processing, and Google sign-in. Those providers process information only as needed to provide their services.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">5. Retention and security</h2>
            <p className="mt-3">We keep information while it is needed for your account, the service, security, dispute handling, or legal obligations. We use access controls, hashed passwords, protected session cookies, and server-side authentication checks, but no online service can guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">6. Your choices</h2>
            <p className="mt-3">You may update account and prompt information through the available dashboard features. You may stop using the service or request access, correction, or deletion of account information, subject to records we must retain for security, transactions, or legal reasons.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-black text-[var(--ink)]">7. Changes and contact</h2>
            <p className="mt-3">We may update this notice when the service changes. The “Last updated” date will show when the latest version was published. For privacy questions or requests, use the official PromptGrid support contact provided by the site owner.</p>
          </section>
        </div>
      </article>
    </section>
  );
}
