import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import 'github-markdown-css/github-markdown-light.css';
import { CodeBlock } from './CodeBlock';
import { normalizeSlug } from '../../utils/normalizeSlug';
import styles from './MarkdownPreview.module.css';

const sanitizeSchema = {
  ...defaultSchema,
  clobber: defaultSchema.clobber?.filter((attr) => attr !== 'id' && attr !== 'name') || [],
};

/** Rehype plugin: collapse consecutive hyphens in all id attributes. */
function rehypeNormalizeIds() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (function walk(node: any) {
      if (node.properties?.id && typeof node.properties.id === 'string') {
        node.properties.id = normalizeSlug(node.properties.id);
      }
      if (node.children) {
        for (const child of node.children) walk(child);
      }
    })(tree);
  };
}

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content }, ref) => {
    return (
      <div className={styles.preview}>
        <div ref={ref} className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeSlug, rehypeNormalizeIds]}
            components={{
              a({ href, children, node, ...props }) {
                if (href && href.startsWith('#')) {
                  return (
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        const id = decodeURIComponent(href.slice(1));
                        const el = document.getElementById(id);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                );
              },
              code({ className, children, node, ...props }) {
                const isInline = !className;
                if (isInline) {
                  return <code {...props}>{children}</code>;
                }
                return (
                  <CodeBlock className={className} {...props}>
                    {children}
                  </CodeBlock>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
);

MarkdownPreview.displayName = 'MarkdownPreview';
