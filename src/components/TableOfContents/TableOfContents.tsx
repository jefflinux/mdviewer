import type { HeadingItem } from '../../types';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  headings: HeadingItem[];
  isOpen: boolean;
  onScrollTo: (id: string) => void;
  onClose: () => void;
}

export function TableOfContents({ headings, isOpen, onScrollTo, onClose }: TableOfContentsProps) {
  const levelClass = (level: number) => {
    const map: Record<number, string> = {
      1: styles.level1,
      2: styles.level2,
      3: styles.level3,
      4: styles.level4,
      5: styles.level5,
      6: styles.level6,
    };
    return map[level] || styles.level6;
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? '' : styles.backdropHidden}`}
        onClick={onClose}
      />
      <nav className={`${styles.sidebar} ${isOpen ? '' : styles.sidebarHidden}`}>
        <div className={styles.title}>Table of Contents</div>
        {headings.length === 0 ? (
          <div className={styles.empty}>No headings found</div>
        ) : (
          <ul className={styles.list}>
            {headings.map((heading, index) => (
              <li key={`${heading.id}-${index}`}>
                <button
                  className={`${styles.item} ${levelClass(heading.level)}`}
                  onClick={() => onScrollTo(heading.id)}
                  title={heading.text}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}
