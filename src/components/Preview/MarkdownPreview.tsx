import { forwardRef, type MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import 'github-markdown-css/github-markdown-light.css';
import { CodeBlock } from './CodeBlock';
import styles from './MarkdownPreview.module.css';

const sanitizeSchema = {
  ...defaultSchema,
  clobber: defaultSchema.clobber?.filter((attr) => attr !== 'id' && attr !== 'name') || [],
};

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content }, ref) => {
    const handleHashClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <div className={styles.preview}>
        <div ref={ref} className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeSlug]}
            components={{
              a({ href, children, ...props }) {
                if (href && href.startsWith('#')) {
                  return (
                    <a
                      href={href}
                      onClick={(e) => handleHashClick(e, href)}
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
              code({ className, children, ...props }) {
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
