import GithubSlugger from 'github-slugger';
import type { HeadingItem } from '../types';
import { normalizeSlug } from './normalizeSlug';

export function extractHeadings(markdown: string): HeadingItem[] {
  const slugger = new GithubSlugger();
  const headings: HeadingItem[] = [];
  if (!markdown) return headings;

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
      if (text) {
        headings.push({
          id: normalizeSlug(slugger.slug(text)),
          text,
          level,
        });
      }
    }
  }

  if (headings.length === 0 && lines.length > 10) {
    console.warn('[extractHeadings] No headings found in', lines.length, 'lines. First line:', JSON.stringify(lines[0]?.substring(0, 80)));
  }

  return headings;
}
