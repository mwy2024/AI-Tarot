export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function getFollowUpStream(
  context: {
    question: string;
    cards: { name: string; nameCn: string; isReversed: boolean }[];
    spread: 'single' | 'three';
    reading: string;
  },
  messages: ChatMessage[],
  onChunk: (text: string) => void,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...context, messages }),
  });

  if (!res.ok || !res.body) {
    onChunk('抱歉，暂时无法回答，请稍后再试。');
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const dataLine = part.split('\n').find(l => l.startsWith('data: '));
      if (!dataLine) continue;
      let event: any;
      try { event = JSON.parse(dataLine.slice(6)); } catch { continue; }

      if (event.type === 'chunk') onChunk(event.text);
      else if (event.type === 'error') onChunk(event.message ?? '回答出现错误，请重试。');
    }
  }
}

export type ReadingMeta = {
  coreTopic: string;
  coreBrief: string;
};

export async function getTarotReadingStream(
  question: string,
  cards: { name: string; nameCn: string; isReversed: boolean }[],
  spread: 'single' | 'three',
  onMeta: (meta: ReadingMeta) => void,
  onChunk: (text: string) => void,
): Promise<void> {
  const res = await fetch('/api/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, cards, spread }),
  });

  if (!res.ok || !res.body) {
    onMeta({ coreTopic: '解读失败', coreBrief: '系统暂时无法连接' });
    onChunk('抱歉，网络似乎不太通畅，暂时无法获取解读。请稍后再试一次吧。');
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const dataLine = part.split('\n').find(l => l.startsWith('data: '));
      if (!dataLine) continue;

      let event: any;
      try {
        event = JSON.parse(dataLine.slice(6));
      } catch {
        continue;
      }

      if (event.type === 'meta') {
        onMeta({ coreTopic: event.coreTopic, coreBrief: event.coreBrief });
      } else if (event.type === 'chunk') {
        onChunk(event.text);
      } else if (event.type === 'error') {
        onMeta({ coreTopic: '解读失败', coreBrief: '' });
        onChunk(event.message ?? '解读出现错误，请重试。');
      }
    }
  }
}
