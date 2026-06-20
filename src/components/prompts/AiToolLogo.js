import Image from 'next/image';
import { aiToolInfo } from '@/data/ai-tools.js';

export function AiToolLogo({ tool, size = 30 }) {
  const info = aiToolInfo(tool);
  return <Image src={info.logo} alt={`${info.name} logo`} width={size} height={size} />;
}
