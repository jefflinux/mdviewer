import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { SplitPane } from './components/Layout/SplitPane';
import { MarkdownEditor } from './components/Editor/MarkdownEditor';
import { MarkdownPreview } from './components/Preview/MarkdownPreview';
import { TableOfContents } from './components/TableOfContents/TableOfContents';
import { useMarkdown } from './hooks/useMarkdown';
import { useFileHandler } from './hooks/useFileHandler';
import { useTableOfContents } from './hooks/useTableOfContents';
import { useExport } from './hooks/useExport';
import type { ViewMode } from './types';
import './styles/variables.css';

function App() {
  const { content, filename, updateContent, loadFile } = useMarkdown();
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const { headings, isOpen: tocOpen, toggle: toggleToc, close: closeToc, scrollToHeading } = useTableOfContents(content);
  const { previewRef, handleExportPdf, handleExportHtml } = useExport(filename);
  const { isDragging, openFile, handleDragOver, handleDragLeave, handleDrop } = useFileHandler({
    onLoad: loadFile,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        openFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleToc();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        setViewMode('editor');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        setViewMode('split');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '3') {
        e.preventDefault();
        setViewMode('preview');
      }
    },
    [openFile, toggleToc]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        if (viewMode === 'split') {
          setViewMode('editor');
        }
        closeToc();
      }
    };
    handle(mq);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, [viewMode, closeToc]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Header
        filename={filename}
        viewMode={viewMode}
        tocOpen={tocOpen}
        onViewModeChange={setViewMode}
        onOpenFile={openFile}
        onToggleToc={toggleToc}
        onExportPdf={handleExportPdf}
        onExportHtml={handleExportHtml}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <TableOfContents
          headings={headings}
          isOpen={tocOpen}
          onScrollTo={scrollToHeading}
          onClose={closeToc}
        />
        <SplitPane
          viewMode={viewMode}
          editor={<MarkdownEditor value={content} onChange={updateContent} />}
          preview={<MarkdownPreview ref={previewRef} content={content} />}
        />
      </div>

      {isDragging && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 105, 218, 0.1)',
            border: '3px dashed #0969da',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '24px 48px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              fontSize: '18px',
              fontWeight: 600,
              color: '#0969da',
            }}
          >
            Drop your Markdown file here
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
