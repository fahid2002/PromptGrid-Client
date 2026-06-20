import { describe, expect, it } from 'vitest';
import * as tools from '../src/data/ai-tools.js';

describe('AI tool registry', () => {
  it('maps supported tools and aliases to local logos', () => {
    expect(tools.aiToolInfo?.('ChatGPT')).toMatchObject({ name: 'ChatGPT', logo: '/ai-tools/chatgpt.svg' });
    expect(tools.aiToolInfo?.('Github Copilot')).toMatchObject({ name: 'GitHub Copilot' });
    expect(tools.aiToolInfo?.('Unknown')).toMatchObject({ logo: '/ai-tools/generic.svg' });
  });
});
