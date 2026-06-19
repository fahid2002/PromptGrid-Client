import { Suspense } from 'react';
import AllPromptsClient from '@/components/prompts/AllPromptsClient.js';

export default function Page() {
  return (
    // Suspense is used because AllPromptsClient uses useSearchParams
    <Suspense>
      <AllPromptsClient />
    </Suspense>
  );
}