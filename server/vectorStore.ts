import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import type { KnowledgeChunk } from './tarotKnowledgeBase';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, 'embeddings-cache.json');
const EMBED_MODEL = 'embedding-2';
const BATCH_SIZE = 20;

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
}

export type ScoredChunk = KnowledgeChunk & { score: number };

export class TarotVectorStore {
  private store: (KnowledgeChunk & { embedding: number[] })[] = [];
  private ready = false;

  constructor(private ai: OpenAI) {}

  async initialize(chunks: KnowledgeChunk[]): Promise<void> {
    let cache: Record<string, number[]> = {};

    if (fs.existsSync(CACHE_PATH)) {
      try {
        const raw = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) as { id: string; e: number[] }[];
        cache = Object.fromEntries(raw.map(r => [r.id, r.e]));
        console.log(`[rag] Loaded ${Object.keys(cache).length} cached embeddings`);
      } catch {
        console.warn('[rag] Cache invalid, regenerating');
      }
    }

    const missing = chunks.filter(c => !cache[c.id]);

    if (missing.length > 0) {
      console.log(`[rag] Generating embeddings for ${missing.length} chunks...`);

      for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE);
        try {
          const res = await this.ai.embeddings.create({
            model: EMBED_MODEL,
            input: batch.map(c => c.text),
          });
          batch.forEach((chunk, j) => { cache[chunk.id] = res.data[j].embedding; });
        } catch {
          // Fallback: embed one by one
          for (const chunk of batch) {
            const res = await this.ai.embeddings.create({
              model: EMBED_MODEL,
              input: [chunk.text],
            });
            cache[chunk.id] = res.data[0].embedding;
          }
        }
        console.log(`[rag] ${Math.min(i + BATCH_SIZE, missing.length)}/${missing.length}`);
      }

      try {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(
          Object.entries(cache).map(([id, e]) => ({ id, e }))
        ));
        console.log('[rag] Cache saved');
      } catch (e) {
        console.warn('[rag] Cache save failed:', e);
      }
    }

    this.store = chunks
      .filter(c => cache[c.id])
      .map(c => ({ ...c, embedding: cache[c.id] }));

    this.ready = true;
    console.log(`[rag] Ready — ${this.store.length} chunks indexed`);
  }

  async search(query: string, topK = 6): Promise<ScoredChunk[]> {
    if (!this.ready || this.store.length === 0) return [];

    const res = await this.ai.embeddings.create({
      model: EMBED_MODEL,
      input: [query],
    });
    const qv = res.data[0].embedding;

    return this.store
      .map(c => ({ ...c, score: cosine(qv, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  isReady() { return this.ready; }
}
