export const aiTools = [
  ['ChatGPT', 'chatgpt'], ['Claude', 'claude'], ['Gemini', 'gemini'], ['Midjourney', 'midjourney'],
  ['GitHub Copilot', 'github-copilot'], ['Perplexity', 'perplexity'], ['Grok', 'grok'],
].map(([name, slug]) => ({ name, slug, logo: `/ai-tools/${slug}.svg` }));

const aliases = new Map(aiTools.flatMap((tool) => [[tool.name.toLowerCase(), tool], [tool.slug, tool]]));
aliases.set('github copilot', aiTools.find((tool) => tool.slug === 'github-copilot'));

export function aiToolInfo(value = '') {
  return aliases.get(value.trim().toLowerCase()) || { name: value || 'AI Tool', slug: 'generic', logo: '/ai-tools/generic.svg' };
}
