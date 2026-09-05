"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-[hsl(var(--primary))]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h4 className="mt-2 mb-1 font-display text-sm font-bold">{children}</h4>,
  h2: ({ children }) => <h4 className="mt-2 mb-1 font-display text-sm font-bold">{children}</h4>,
  h3: ({ children }) => <h5 className="mt-2 mb-1 text-xs font-bold text-[hsl(var(--primary))]">{children}</h5>,
  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-[hsl(var(--accent))]/60 bg-[hsl(var(--muted))]/40 py-1 pl-3 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-2.5 border-[hsl(var(--border))]" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[hsl(var(--primary))] underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[hsl(var(--muted))] px-1 py-0.5 font-mono text-[11px]">{children}</code>
  ),
};

interface ChatMarkdownProps {
  content: string;
}

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <div className="text-xs sm:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
