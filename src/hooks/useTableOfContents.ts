import { useState, useMemo, useCallback } from 'react';
import type { HeadingItem } from '../types';
import { extractHeadings } from '../utils/extractHeadings';

export function useTableOfContents(content: string) {
  const [isOpen, setIsOpen] = useState(false);

  const headings: HeadingItem[] = useMemo(() => extractHeadings(content), [content]);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { headings, isOpen, toggle, scrollToHeading };
}
