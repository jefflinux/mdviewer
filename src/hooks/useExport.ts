import { useCallback, useRef } from 'react';
import { exportToPdf } from '../utils/exportToPdf';
import { exportToHtml } from '../utils/exportToHtml';

export function useExport(filename: string) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = useCallback(async () => {
    if (previewRef.current) {
      await exportToPdf(previewRef.current, filename);
    }
  }, [filename]);

  const handleExportHtml = useCallback(() => {
    if (previewRef.current) {
      exportToHtml(previewRef.current, filename);
    }
  }, [filename]);

  return { previewRef, handleExportPdf, handleExportHtml };
}
