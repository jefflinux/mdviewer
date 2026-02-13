import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import type { ViewMode } from '../../types';
import styles from './SplitPane.module.css';

interface SplitPaneProps {
  viewMode: ViewMode;
  editor: React.ReactNode;
  preview: React.ReactNode;
}

export function SplitPane({ viewMode, editor, preview }: SplitPaneProps) {
  if (viewMode === 'editor') {
    return <div className={styles.container}><div className={styles.pane}>{editor}</div></div>;
  }

  if (viewMode === 'preview') {
    return <div className={styles.container}><div className={styles.pane}>{preview}</div></div>;
  }

  return (
    <div className={styles.container}>
      <Allotment>
        <Allotment.Pane minSize={200}>
          <div className={styles.pane}>{editor}</div>
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <div className={styles.pane}>{preview}</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
