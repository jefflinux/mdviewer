import { useState, useCallback, useEffect } from 'react';
import type { DragEvent } from 'react';

interface UseFileHandlerOptions {
  onLoad: (name: string, content: string) => void;
}

export function useFileHandler({ onLoad }: UseFileHandlerOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onLoad(file.name, text);
      };
      reader.readAsText(file);
    },
    [onLoad]
  );

  const openFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) readFile(file);
    };
    input.click();
  }, [readFile]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain');
      if (text && document.activeElement?.tagName !== 'TEXTAREA' && !document.activeElement?.closest('.cm-editor')) {
        onLoad('pasted.md', text);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onLoad]);

  return { isDragging, openFile, handleDragOver, handleDragLeave, handleDrop };
}
