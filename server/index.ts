import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fetch, ProxyAgent } from 'undici';
import { getAllChunks } from './tarotKnowledgeBase';
import { TarotVectorStore, ScoredChunk } from './vectorStore';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8787;

app.use(express.json({ limit: '1mb' }));

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;

const ai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.API_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/',
  // @ts-ignore
  fetch,
  fetchOptions: proxyUrl ? { dispatcher: new ProxyAgent(proxyUrl) } as any : undefined,
});
const MODEL = process.env.API_MODEL || 'glm-4-flash';

// ── RAG 初始化 ────────────────────────────────────────────────
const vectorStore = new TarotVectorStore(ai);

(async () => {
  try {
    await vectorStore.initialize(getAllChunks());
  } catch (err) {
    console.error('[rag] Initialization failed, falling back to direct lookup:', err);
  }
})();
// ─────────────────────────────────────────────────────────────

type Card = { name: string; nameCn: string; isReversed: boolean };
type Spread = 'single' | 'three';

function buildPrompt(question: string, cards: Card[], spread: Spread, ragChunks: ScoredChunk[]): string {
  let spreadContext = '';
  if (spread === 'single') {
    spreadContext = `牌阵：单牌阵\n- 第1张牌：${cards[0].nameCn} (${cards[0].isReversed ? '逆位' : '正位'})`;
  } else if (spread === 'three') {
    spreadContext = `牌阵：三牌阵 (过去、现在、未来)
- 过去：${cards[0].nameCn} (${cards[0].isReversed ? '逆位' : '正位'})
- 现在：${cards[1].nameCn} (${cards[1].isReversed ? '逆位' : '正位'})
- 未来：${cards[2].nameCn} (${cards[2].isReversed ? '逆位' : '正位'})`;
  }

  const knowledgeSection = ragChunks.length > 0
    ? ragChunks.map(c => `- [${c.cardNameCn}·${c.type}] ${c.text}`).join('\n')
    : '（知识库暂不可用）';

  return `你是一位温和、务实、专业的塔罗解读师。你的任务是根据用户提出的具体问题、所抽塔罗牌及其正逆位，给出清晰、可操作的建议。

请严格遵守以下规则：
1. 不使用"命运""注定""宇宙""神秘力量"等模糊或宿命论词汇。
2. 解读必须结合用户的问题（例如感情、事业、自我成长）。
3. 每张牌的含义必须基于下方 RAG 检索到的知识库内容，不得自行编造象征意义。
4. 语气自然、有共情力，像知心朋友面对面聊天，避免"总之""需要注意的是"等套话，多用"你现在可能感觉…""我建议你…"。
5. 输出格式必须严格遵守如下结构（不得使用JSON，不得添加任何额外标记）：

TOPIC:[本次牌阵的核心牌名，仅填中文牌名，例如：星币侍从]
BRIEF:[一句话核心讯息，格式为"[牌名][正/逆]位：[简短的核心警示或指引]"]
---
当 [牌名][正/逆]位出现，它[简述牌意]，告诉我们[结合分析]...

### ① 当前现状
[具有同理心地描述现状]

### ② 可能的发展方向
[基于牌面的趋势预测，语气自然委婉]

### ③ 建议
[提供一个微小但具体的行动建议，像朋友般中肯]

── RAG 检索知识库 ──
${knowledgeSection}

现在，请根据以下信息生成解读：
- 用户问题：${question || '(未提供具体问题，请作一般性现状与建议解读)'}
- 抽到的牌：
${spreadContext}
`;
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, rag: vectorStore.isReady() });
});

app.post('/api/reading', async (req: Request, res: Response) => {
  const { question, cards, spread } = req.body as {
    question?: string;
    cards?: Card[];
    spread?: Spread;
  };

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'cards is required' });
  }
  if (spread !== 'single' && spread !== 'three') {
    return res.status(400).json({ error: 'spread must be "single" or "three"' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    // RAG 检索：用问题 + 牌名 + 正逆位作为查询
    const ragQuery = [
      question ?? '',
      ...cards.map(c => `${c.nameCn}${c.isReversed ? '逆位' : '正位'}`),
    ].join(' ');

    const ragChunks = vectorStore.isReady()
      ? await vectorStore.search(ragQuery, 8)
      : [];

    const prompt = buildPrompt(question ?? '', cards, spread, ragChunks);

    const stream = await ai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let accumulated = '';
    let metaSent = false;

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (!text) continue;
      accumulated += text;

      if (!metaSent) {
        const sepIdx = accumulated.indexOf('\n---');
        if (sepIdx !== -1) {
          const header = accumulated.slice(0, sepIdx);
          sendEvent({
            type: 'meta',
            coreTopic: header.match(/TOPIC:\s*(.+)/)?.[1]?.trim() ?? '',
            coreBrief: header.match(/BRIEF:\s*(.+)/)?.[1]?.trim() ?? '',
          });
          const afterSep = accumulated.slice(sepIdx + 4).trimStart();
          if (afterSep) sendEvent({ type: 'chunk', text: afterSep });
          metaSent = true;
        }
      } else {
        sendEvent({ type: 'chunk', text });
      }
    }

    if (!metaSent) {
      sendEvent({ type: 'meta', coreTopic: '解读', coreBrief: '' });
      sendEvent({ type: 'chunk', text: accumulated });
    }

    sendEvent({ type: 'done' });
    res.end();
  } catch (error: any) {
    console.error('Error generating reading:', error);
    sendEvent({ type: 'error', message: error?.status === 429 ? 'API 请求过于频繁，请等待约1分钟后重试' : '解读失败，请稍后重试' });
    res.end();
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { question, cards, spread, reading, messages } = req.body as {
    question?: string;
    cards?: Card[];
    spread?: Spread;
    reading?: string;
    messages?: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!cards || !messages || messages.length === 0) {
    return res.status(400).json({ error: 'cards and messages are required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    // RAG：用最新一条用户追问检索相关知识
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
    const ragQuery = [lastUserMsg, ...cards.map(c => c.nameCn)].join(' ');
    const ragChunks = vectorStore.isReady() ? await vectorStore.search(ragQuery, 5) : [];
    const ragSection = ragChunks.length > 0
      ? '\n\n补充知识库（RAG检索）：\n' + ragChunks.map(c => `- ${c.text}`).join('\n')
      : '';

    const cardDesc = cards.map(c => `${c.nameCn}（${c.isReversed ? '逆位' : '正位'}）`).join('、');

    const systemPrompt = `你是一位温和、务实、专业的塔罗解读师。用户已完成一次塔罗解读，现在希望深入探讨。

本次解读背景：
- 用户原始问题：${question || '（未提供）'}
- 牌阵类型：${spread === 'single' ? '单牌阵' : '三牌阵'}
- 抽到的牌：${cardDesc}
- 初始解读内容：
${reading || '（无）'}${ragSection}

请基于以上背景回答用户的追问。语气自然、有共情力，像知心朋友一样，不要重复初始解读内容，直接针对追问给出新的洞见和建议。`;

    const stream = await ai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (!text) continue;
      sendEvent({ type: 'chunk', text });
    }

    sendEvent({ type: 'done' });
    res.end();
  } catch (error: any) {
    console.error('Error generating follow-up:', error);
    sendEvent({ type: 'error', message: error?.status === 429 ? 'API 请求过于频繁，请等待约1分钟后重试' : '回答失败，请稍后重试' });
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
