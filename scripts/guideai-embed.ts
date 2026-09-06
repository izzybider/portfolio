/**
 * Builds src/lib/guideai/resource-index.json.
 *
 *   npm run guideai:embed                 -> lexical TF-IDF index (default)
 *   OPENAI_API_KEY=sk-... npm run guideai:embed --openai
 *                                         -> real OpenAI embeddings
 *
 * On the OpenAI path this writes 1536-dimension text-embedding-3-small
 * vectors for the corpus. Note that the portfolio is a fully static export:
 * an OpenAI-backed index also needs the *query* embedded with the same
 * model at request time, which means adding a server route and exposing
 * OPENAI_API_KEY to it. Until that exists, the shipped index is lexical so
 * the public demo works with no key, no database and no failure mode.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CORPUS } from '../src/lib/guideai/corpus';
import { tokenize, normalize } from '../src/lib/guideai/embed';

const useOpenAI = process.argv.includes('--openai');
const OUT = path.join(process.cwd(), 'src/lib/guideai/resource-index.json');

/** Everything about a resource that should be searchable. */
const documentText = (r: (typeof CORPUS)[number]) =>
  [r.title, r.category, r.behavior_tags.join(' '), r.context_tags.join(' '), r.content, r.escalation_note].join(' ');

function buildLexical() {
  const docs = CORPUS.map(documentText);
  const tokenized = docs.map(tokenize);

  const df = new Map<string, number>();
  tokenized.forEach((tokens) => {
    new Set(tokens).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1));
  });
  /* Drop terms that appear in only one document: they cannot connect a
     query to more than one resource and only add dimensions. */
  const vocabulary = [...df.entries()]
    .filter(([, n]) => n >= 2)
    .map(([t]) => t)
    .sort();
  const N = CORPUS.length;
  const idf = vocabulary.map((t) => Math.log((N + 1) / ((df.get(t) ?? 0) + 1)) + 1);

  const position = new Map(vocabulary.map((t, i) => [t, i]));
  const vectors: Record<string, number[]> = {};
  CORPUS.forEach((r, i) => {
    const vec = new Array(vocabulary.length).fill(0);
    const counts = new Map<string, number>();
    tokenized[i].forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
    counts.forEach((count, term) => {
      const p = position.get(term);
      if (p === undefined) return;
      vec[p] = (1 + Math.log(count)) * idf[p];
    });
    vectors[r.id] = normalize(vec).map((x) => Number(x.toFixed(6)));
  });

  return {
    embedder: 'lexical-tfidf-v1' as const,
    embedder_label: 'TF-IDF lexical vectors (cosine)',
    dimension: vocabulary.length,
    generated_at: new Date().toISOString(),
    vocabulary,
    idf: idf.map((x) => Number(x.toFixed(6))),
    vectors,
  };
}

async function buildOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error('OPENAI_API_KEY is not set. Run without --openai for the lexical index.');
    process.exit(1);
  }
  const model = 'text-embedding-3-small';
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, input: CORPUS.map(documentText) }),
  });
  if (!res.ok) {
    console.error(`OpenAI request failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const json = (await res.json()) as { data: { index: number; embedding: number[] }[] };
  const vectors: Record<string, number[]> = {};
  json.data.forEach((d) => {
    vectors[CORPUS[d.index].id] = normalize(d.embedding).map((x) => Number(x.toFixed(6)));
  });
  return {
    embedder: `openai:${model}` as const,
    embedder_label: `OpenAI ${model} (cosine)`,
    dimension: json.data[0].embedding.length,
    generated_at: new Date().toISOString(),
    vocabulary: [],
    idf: [],
    vectors,
  };
}

async function main() {
  const index = useOpenAI ? await buildOpenAI() : buildLexical();
  fs.writeFileSync(OUT, `${JSON.stringify(index, null, 0)}\n`);
  console.log(
    `wrote ${OUT}\n  embedder: ${index.embedder}\n  dimension: ${index.dimension}\n  documents: ${Object.keys(index.vectors).length}`,
  );
}

main();
