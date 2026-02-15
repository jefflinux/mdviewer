import type { ViewMode } from '../../types';
import styles from './Header.module.css';

interface HeaderProps {
  filename: string;
  viewMode: ViewMode;
  tocOpen: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenFile: () => void;
  onToggleToc: () => void;
  onExportPdf: () => void;
  onExportHtml: () => void;
}

export function Header({
  filename,
  viewMode,
  tocOpen,
  onViewModeChange,
  onOpenFile,
  onToggleToc,
  onExportPdf,
  onExportHtml,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>MD Viewer <span className={styles.version}>v{__APP_VERSION__}</span></span>
      <span className={styles.filename}>{filename}</span>
      <div className={styles.spacer} />

      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewBtn} ${viewMode === 'editor' ? styles.viewBtnActive : ''}`}
          onClick={() => onViewModeChange('editor')}
          title="Editor only (Ctrl+1)"
        >
          <span className={styles.fullLabel}>Editor</span>
          <span className={styles.shortLabel}>E</span>
        </button>
        <button
          className={`${styles.viewBtn} ${styles.viewBtnSplit} ${viewMode === 'split' ? styles.viewBtnActive : ''}`}
          onClick={() => onViewModeChange('split')}
          title="Split view (Ctrl+2)"
        >
          <span className={styles.fullLabel}>Split</span>
          <span className={styles.shortLabel}>S</span>
        </button>
        <button
          className={`${styles.viewBtn} ${viewMode === 'preview' ? styles.viewBtnActive : ''}`}
          onClick={() => onViewModeChange('preview')}
          title="Preview only (Ctrl+3)"
        >
          <span className={styles.fullLabel}>Preview</span>
          <span className={styles.shortLabel}>P</span>
        </button>
      </div>

      <div className={styles.divider} />

      <button className={`${styles.btn} ${tocOpen ? styles.btnActive : ''}`} onClick={onToggleToc} title="Toggle Table of Contents (Ctrl+\\)">
        TOC
      </button>

      <button className={styles.btn} onClick={onOpenFile} title="Open file (Ctrl+O)">
        Open
      </button>

      <button className={styles.btn} onClick={onExportPdf} title="Export as PDF">
        PDF
      </button>
      <button className={styles.btn} onClick={onExportHtml} title="Export as HTML">
        HTML
      </button>
    </header>
  );
}
