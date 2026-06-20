import ReactMarkdown from 'react-markdown';
import type { ReactNode } from 'react';
import styles from './Markdown.module.scss';

export type MarkdownProps = {
  children: string;
  inline?: boolean;
  className?: string;
};

// Inline mode: unwrap the paragraph so the content sits inline (e.g. a project
// description inside a card) instead of becoming a block <p>.
const INLINE_COMPONENTS = {
  p: ({ children }: { children?: ReactNode }) => <>{children}</>,
} as const;

/**
 * Renders CommonMark to React elements via react-markdown (no dangerouslySetInnerHTML).
 * Block mode wraps output in a .markdown container the module styles.
 */
export function Markdown({ children, inline = false, className }: MarkdownProps) {
  if (inline) {
    return <ReactMarkdown components={INLINE_COMPONENTS}>{children}</ReactMarkdown>;
  }
  const classes = [styles.markdown, className].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
