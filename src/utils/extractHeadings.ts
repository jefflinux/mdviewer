import GithubSlugger from 'github-slugger';
import type { HeadingItem } from '../types';

export function extractHeadings(markdown: string): HeadingItem[] {
  const slugger = new GithubSlugger();
  const headings: HeadingItem[] = [];
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      headings.push({
        id: slugger.slug(text),
        text,
        level,
      });
    }
  }

  return headings;
}
