import { load, JSON_SCHEMA } from 'js-yaml';

const files = import.meta.glob<string>('./prompts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export interface Prompt {
  id: string;
  title: string;
  tags: string[];
  category: string;
  createdAt: string;
  body: string;
}

interface PromptFrontmatter {
  id?: string;
  title?: string;
  tags?: string[];
  category?: string;
  createdAt?: string | number;
}

function parseFrontmatter(raw: string): { data: PromptFrontmatter; content: string } {
  const text = raw.replace(/^\uFEFF/, '');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  // JSON_SCHEMA evita que datas sem aspas (2026-10-02) virem objetos Date
  const data = (load(match[1], { schema: JSON_SCHEMA }) ?? {}) as PromptFrontmatter;
  return { data, content: match[2] };
}

let cache: Prompt[] | null = null;

function loadAll(): Prompt[] {
  if (!cache) {
    cache = Object.entries(files).map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      return {
        id: data.id ?? path.split('/').pop()!.replace('.md', ''),
        title: data.title ?? '',
        tags: data.tags ?? [],
        category: data.category ?? '',
        createdAt: String(data.createdAt ?? ''),
        body: content.trim(),
      };
    });
  }
  return cache;
}

export const getPrompts = () => loadAll();
export const getPromptById = (id: string) => loadAll().find(p => p.id === id);
export const getTags = () => [...new Set(loadAll().flatMap(p => p.tags))].sort();
