import { useState, useCallback } from 'react';

const DEFAULT_CONTENT = `# Welcome to Markdown Viewer

A full-featured **Markdown viewer** and editor with live preview.

## Features

- **Live Preview** — See your changes in real time
- **Syntax Highlighting** — For code blocks
- **GFM Support** — Tables, task lists, strikethrough
- **Mermaid Diagrams** — Flowcharts, sequence diagrams, and more
- **Table of Contents** — Auto-generated from headings
- **Export** — Save as PDF or HTML
- **File Operations** — Open, drag & drop, paste

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| Export | ✅ |

## Task List

- [x] Set up project
- [x] Implement editor
- [ ] Write documentation

## Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Open File] --> B{Edit Markdown}
    B --> C[Live Preview]
    C --> D[Export PDF]
    C --> E[Export HTML]
\`\`\`

---

> Start editing on the left to see the preview update in real time!
`;

export function useMarkdown() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [filename, setFilename] = useState('untitled.md');

  const updateContent = useCallback((value: string) => {
    setContent(value);
  }, []);

  const loadFile = useCallback((name: string, text: string) => {
    setFilename(name);
    setContent(text);
  }, []);

  const reset = useCallback(() => {
    setContent(DEFAULT_CONTENT);
    setFilename('untitled.md');
  }, []);

  return { content, filename, updateContent, loadFile, reset, setFilename };
}
