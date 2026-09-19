import AiToolsClient from '@/components/ai/AiToolsClient.js';
import { PrivateRoute } from '@/libs/auth-context.js';

export const metadata = {
  title: 'AI Tools | PromptGrid',
  description: 'Build, test, moderate, and discover AI prompts with PromptGrid tools.',
};

export default function AiToolsPage() {
  return (
    <PrivateRoute>
      <AiToolsClient />
    </PrivateRoute>
  );
}
