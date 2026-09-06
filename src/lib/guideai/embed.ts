/* ============================================================
   EMBEDDING LAYER

   Two embedders behind one interface.

   `lexical-tfidf-v1` (default, what ships): TF-IDF weighted term vectors
   over the corpus vocabulary, L2-normalised, compared with cosine
   similarity. This is lexical retrieval — real vector search, but not a
   neural embedding, and it is never described as one. It runs in the
   browser with no key, no network call and no database, which is why the
   public demo cannot break for a recruiter.

   `openai:text-embedding-3-small` (implemented, not enabled): the same
   interface backed by real OpenAI embeddings. `npm run guideai:embed`
   rebuilds the index with it when OPENAI_API_KEY is set. Because the
   portfolio is a fully static site, using it at runtime also needs a
   query embedding, which means a server route and a key — see the note in
   scripts/guideai-embed.ts.

   Whichever index is present, the UI reads its `embedder` field and says
   so on screen, so the architecture claim always matches what is running.
   ============================================================ */

import indexData from './resource-index.json';

export type EmbedderId = 'lexical-tfidf-v1' | 'openai:text-embedding-3-small';

export type ResourceIndex = {
  embedder: EmbedderId;
  /** human-readable, shown in the pipeline trace */
  embedder_label: string;
  dimension: number;
  generated_at: string;
  /** lexical only: the shared vocabulary and inverse document frequencies */
  vocabulary: string[];
  idf: number[];
  /** resource id -> unit vector */
  vectors: Record<string, number[]>;
};

export const INDEX = indexData as ResourceIndex;

/** Tokenisation shared by the index builder and the query path. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'this', 'from', 'are', 'was', 'has',
  'have', 'not', 'but', 'their', 'them', 'they', 'than', 'then', 'when',
  'what', 'which', 'who', 'how', 'why', 'its', 'it', 'is', 'be', 'been',
  'can', 'could', 'would', 'should', 'may', 'might', 'will', 'one', 'two',
  'into', 'over', 'out', 'about', 'because', 'those', 'these', 'each',
  'other', 'some', 'more', 'most', 'much', 'very', 'own', 'same', 'both',
  'you', 'your', 'a', 'an', 'of', 'in', 'on', 'to', 'at', 'or', 'as', 'by',
  'if', 'it', 'so', 'do', 'does', 'did', 'up', 'off',
]);

/** Build a unit-length TF-IDF vector against the index vocabulary. */
export function lexicalEmbed(text: string, index: ResourceIndex): number[] {
  const position = new Map(index.vocabulary.map((term, i) => [term, i]));
  const vec = new Array(index.vocabulary.length).fill(0);
  const tokens = tokenize(text);
  if (tokens.length === 0) return vec;

  const counts = new Map<string, number>();
  tokens.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));

  counts.forEach((count, term) => {
    const i = position.get(term);
    if (i === undefined) return;
    /* log-scaled term frequency times inverse document frequency */
    vec[i] = (1 + Math.log(count)) * index.idf[i];
  });

  return normalize(vec);
}

export function normalize(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  return norm === 0 ? v : v.map((x) => x / norm);
}

/** Both vectors are unit length, so the dot product is the cosine. */
export function cosine(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length && i < b.length; i += 1) sum += a[i] * b[i];
  return sum;
}

/**
 * Embed a query with whichever embedder built the index. The OpenAI path
 * needs a network call, so it is only reachable where one is available;
 * the shipped index is lexical and this stays synchronous.
 */
export function embedQuery(text: string, index: ResourceIndex = INDEX): number[] {
  if (index.embedder === 'lexical-tfidf-v1') return lexicalEmbed(text, index);
  throw new Error(
    `Index was built with ${index.embedder}, which needs a server-side query embedding. See scripts/guideai-embed.ts.`,
  );
}
