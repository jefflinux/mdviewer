import { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import styles from './MermaidBlock.module.css';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict',
});

interface MermaidBlockProps {
  chart: string;
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useId().replace(/:/g, '-');

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      if (!containerRef.current) return;
      try {
        // mermaid.render() with securityLevel:'strict' produces sanitized SVG
        const { svg } = await mermaid.render(`mermaid-${uniqueId}`, chart);
        if (!cancelled && containerRef.current) {
          // Clear previous content safely
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          // Parse the SVG and insert as DOM nodes (not raw HTML string)
          const parser = new DOMParser();
          const doc = parser.parseFromString(svg, 'image/svg+xml');
          const svgElement = doc.documentElement;
          containerRef.current.appendChild(
            document.importNode(svgElement, true)
          );
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          if (containerRef.current) {
            while (containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
          }
        }
      }
    }

    renderChart();
    return () => { cancelled = true; };
  }, [chart, uniqueId]);

  if (error) {
    return <div className={styles.error}>Mermaid Error: {error}</div>;
  }

  return <div ref={containerRef} className={styles.mermaid} />;
}
