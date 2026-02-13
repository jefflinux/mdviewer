export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export type ViewMode = 'editor' | 'preview' | 'split';

export interface FileInfo {
  name: string;
  content: string;
}
