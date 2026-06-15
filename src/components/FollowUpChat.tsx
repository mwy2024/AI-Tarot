import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getFollowUpStream, ChatMessage } from '../services/gemini';
import MagicCircle from './MagicCircle';

type Props = {
  question: string;
  cards: { name: string; nameCn: string; isReversed: boolean }[];
  spread: 'single' | 'three';
  reading: string;
};

export default function FollowUpChat({ question, cards, spread, reading }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';
    const assistantIndex = nextMessages.length;

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    await getFollowUpStream(
      { question, cards, spread, reading },
      nextMessages,
      (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[assistantIndex] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      },
    );

    setIsLoading(false);
  };

  return (
    <div className="w-full mt-10 border-t border-purple-500/20 pt-8">
      {!open ? (
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 border border-purple-400/40 rounded-full hover:border-purple-300/70 transition-all font-serif tracking-widest text-sm text-purple-200/70 hover:text-purple-100"
          >
            <span className="text-[#d4af37] text-xs">✦</span>
            继续深入提问
            <span className="text-[#d4af37] text-xs">✦</span>
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative rounded-2xl overflow-hidden"
        >
          {/* Magic circle background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <MagicCircle className="w-full h-full opacity-20" />
          </div>
          <div className="relative z-10 p-4">
          <h3 className="font-serif text-center text-lg tracking-[0.3em] uppercase mb-6 text-glow-purple text-silver-purple-gradient">
            延伸提问
          </h3>

          <div className="flex flex-col gap-4 mb-6 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      msg.role === 'user'
                        ? 'max-w-[80%] bg-purple-600/30 border border-purple-400/30 rounded-2xl rounded-tr-sm px-4 py-3 text-purple-100 text-sm'
                        : 'max-w-[90%] bg-[#1a1030]/60 border border-purple-500/20 rounded-2xl rounded-tl-sm px-4 py-3 text-purple-200 text-sm markdown-body'
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {isLoading && i === messages.length - 1 && (
                          <span className="inline-block w-[2px] h-[1em] bg-purple-400 ml-0.5 align-middle animate-pulse" />
                        )}
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="继续追问..."
              rows={2}
              disabled={isLoading}
              className="flex-1 bg-purple-950/70 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-100 text-sm placeholder:text-purple-300/30 focus:outline-none focus:border-purple-400/60 resize-none disabled:opacity-50 backdrop-blur-sm"
            />
            <button
              onClick={send}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 border border-purple-400/50 rounded-xl hover:border-purple-300 hover:bg-purple-500/10 transition-all font-serif text-sm text-purple-100 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              发送
            </button>
          </div>
          </div>{/* end z-10 */}
        </motion.div>
      )}
    </div>
  );
}
