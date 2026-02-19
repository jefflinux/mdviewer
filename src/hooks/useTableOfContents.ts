import { useState, useMemo, useCallback } from 'react';
import type { HeadingItem } from '../types';
import { extractHeadings } from '../utils/extractHeadings';

export function useTableOfContents(content: string) {
  const [isOpen, setIsOpen] = useState(false);

  const headings: HeadingItem[] = useMemo(() => {
    const result = extractHeadings(content);
    if (content.length > 100 && result.length === 0) {
      console.warn('[useTableOfContents] 0 headings for content length:', content.length);
    }
    return result;
  }, [content]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { headings, isOpen, toggle, close, scrollToHeading };
}
