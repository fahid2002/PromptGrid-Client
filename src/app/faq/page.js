const questions = [
  {
    question: 'How do I create a prompt on PromptGrid?',
    answer: 'Log in, open your Dashboard, and choose the option to create a prompt. Add a clear title, description, instructions, AI tool, and tags before submitting it for review.',
  },
  {
    question: 'What makes a prompt useful for other creators?',
    answer: 'A useful prompt explains the goal, includes enough context, defines the expected output, and uses variables or examples when they help someone reuse it.',
  },
  {
    question: 'How does prompt moderation work?',
    answer: 'Submitted prompts are reviewed for quality, safety, clarity, and marketplace suitability before they become publicly available.',
  },
  {
    question: 'Can I edit or remove my prompt later?',
    answer: 'Yes. Open your Dashboard to manage prompts you created, update their information, or remove them when they are no longer needed.',
  },
  {
    question: 'What are copies, bookmarks, and reviews used for?',
    answer: 'Copies show how often a prompt is reused, bookmarks help users save prompts, and reviews provide feedback that helps the community find better prompts.',
  },
  {
    question: 'Do I need to log in to use PromptGrid?',
    answer: 'You can browse the public marketplace without an account, but you need to log in to create, copy, bookmark, review, manage prompts, or use the AI Tools route.',
  },
];

export const metadata = {
  title: 'FAQ | PromptGrid',
  description: 'Frequently asked questions for PromptGrid prompt creators and users.',
};

export default function FaqPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="section-label">PromptGrid help center</p>
        <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-2xl leading-7 muted">
          Quick answers for creating, managing, and discovering prompts on PromptGrid.
        </p>

        <div className="mt-10 grid gap-4">
          {questions.map(({ question, answer }) => (
            <details className="soft-card rounded-2xl p-5" key={question}>
              <summary className="cursor-pointer text-lg font-medium">
                {question}
              </summary>
              <p className="mt-4 max-w-3xl leading-7 muted">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
