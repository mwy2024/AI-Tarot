/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import Background3D from './components/Background3D';
import StarryOverlay from './components/StarryOverlay';
import TarotCard from './components/TarotCard';
import { TAROT_DECK } from './utils/tarotData';
import { getTarotReadingStream } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import ShuffleView from './components/ShuffleView';
import FollowUpChat from './components/FollowUpChat';

type Step = 'intro' | 'spread' | 'shuffle' | 'question' | 'select' | 'reading';
type SpreadType = 'single' | 'three';

const SPREAD_CARDS = {
  single: 1,
  three: 3,
};

const RANDOM_QUESTIONS = [
  "我最近的职业发展会怎样？",
  "我近期的感情生活会有什么变化？",
  "接下来的一个月，我需要注意什么？",
  "我的财运在未来半年内如何？",
  "我应该在哪些方面提升自己？",
  "近期有什么潜在的机会在等待我？"
];

export default function App() {
  const [step, setStep] = useState<Step>('intro');
  const [spread, setSpread] = useState<SpreadType>('single');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [coreTopic, setCoreTopic] = useState('');
  const [coreBrief, setCoreBrief] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [deck, setDeck] = useState<(typeof TAROT_DECK[0] & { isReversed: boolean })[]>([]);

  useEffect(() => {
    setDeck(
      [...TAROT_DECK]
        .sort(() => Math.random() - 0.5)
        .map(card => ({ ...card, isReversed: Math.random() > 0.5 }))
    );
  }, []);

  useEffect(() => {
    if (selectedCards.length > 0) {
      const lastSelected = selectedCards[selectedCards.length - 1];
      const el = document.getElementById(`tarot-card-${lastSelected}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCards]);

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || selectedCards.length >= SPREAD_CARDS[spread]) return;
    
    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);
    
    if (newSelected.length === SPREAD_CARDS[spread]) {
      generateReading(newSelected);
    }
  };

  const generateReading = async (indices: number[]) => {
    setIsGenerating(true);
    setIsStreaming(false);
    setCoreTopic('');
    setCoreBrief('');
    setInterpretation('');
    setTimeout(() => setStep('reading'), 1500);
    const drawnCards = indices.map(i => ({ name: deck[i].name, nameCn: deck[i].nameCn, isReversed: deck[i].isReversed }));
    try {
      await getTarotReadingStream(
        question,
        drawnCards,
        spread,
        (meta) => {
          setCoreTopic(meta.coreTopic);
          setCoreBrief(meta.coreBrief);
          setIsGenerating(false);
          setIsStreaming(true);
        },
        (chunk) => {
          setInterpretation(prev => prev + chunk);
        },
      );
    } finally {
      setIsStreaming(false);
    }
  };


  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_QUESTIONS.length);
    setQuestion(RANDOM_QUESTIONS[randomIndex]);
  };

  const handleBack = () => {
    switch (step) {
      case 'spread':
        setStep('intro');
        break;
      case 'shuffle':
        setStep('spread');
        break;
      case 'question':
        setStep('spread');
        break;
      case 'select':
        setSelectedCards([]);
        setStep('question');
        break;
      case 'reading':
        setSelectedCards([]);
        setCoreTopic('');
        setCoreBrief('');
        setInterpretation('');
        setStep('select');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950 via-[#130026] to-black text-purple-200 font-sans selection:bg-purple-500/30">
      <Background3D />
      <StarryOverlay showMoon={step === 'intro'} intensity={step === 'intro' ? 'high' : 'low'} />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        {step !== 'intro' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 left-6 sm:top-8 sm:left-10 z-50"
          >
            <button
              onClick={handleBack}
              disabled={isGenerating || step === 'shuffle'}
              className="text-purple-300/60 hover:text-purple-100 flex items-center gap-2 font-serif transition-colors text-sm tracking-widest disabled:opacity-30 disabled:cursor-not-allowed group py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              {step === 'shuffle' ? '洗牌中' : '返回'}
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="text-center relative"
            >
              {/* Magic dust drifting up around the title */}
              <div className="absolute inset-x-0 -top-10 h-64 pointer-events-none overflow-visible">
                {Array.from({ length: 18 }).map((_, i) => {
                  const left = `${(i * 5.5 + 3) % 100}%`;
                  const dx = `${(i % 2 === 0 ? 1 : -1) * (10 + (i * 7) % 40)}px`;
                  const dy = `${-(90 + (i * 11) % 80)}px`;
                  const delay = `${(i * 0.4) % 6}s`;
                  const duration = `${5 + (i % 5)}s`;
                  const size = `${2 + (i % 3)}px`;
                  return (
                    <span
                      key={i}
                      className="absolute bottom-0 rounded-full"
                      style={{
                        left,
                        width: size,
                        height: size,
                        background: 'radial-gradient(circle, rgba(253,230,138,0.95) 0%, rgba(216,180,254,0.6) 60%, transparent 100%)',
                        boxShadow: '0 0 8px rgba(253,230,138,0.7)',
                        ['--dx' as never]: dx,
                        ['--dy' as never]: dy,
                        animation: `float-dust ${duration} ease-out ${delay} infinite`,
                      }}
                    />
                  );
                })}
              </div>

              <h1 className="relative font-serif text-6xl md:text-8xl mb-6 text-glow-purple tracking-tighter text-silver-purple-gradient">
                AI 塔罗占卜
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6 text-purple-300/70">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/60" />
                <span className="text-xs tracking-[0.4em] font-serif">✦  STARLIGHT  ✦</span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400/60" />
              </div>
              <p className="text-purple-100 mb-6 max-w-md mx-auto font-light tracking-wide opacity-90">
                倾听星辰的指引，揭示命运的轨迹。在这里，古老的智慧将为你解答心中的疑惑。
              </p>
              <p className="text-xs font-serif mb-8 tracking-wide text-glow text-gold-gradient opacity-60">
                深夜 11:00–03:00 及情绪激动时，建议避免占卜
              </p>
              <button
                onClick={() => setStep('spread')}
                className="group relative px-10 py-4 bg-transparent border border-purple-400/60 rounded-full overflow-hidden transition-all hover:border-purple-300 mystic-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 via-purple-500/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative font-serif text-xl tracking-widest text-purple-100 flex items-center gap-2">
                  <span className="text-[#fde68a] text-sm">✦</span>
                  开始占卜
                  <span className="text-[#fde68a] text-sm">✦</span>
                </span>
              </button>
            </motion.div>
          )}

          {step === 'spread' && (
            <motion.div
              key="spread"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center w-full max-w-4xl px-4"
            >
              <h2 className="font-serif text-3xl md:text-5xl mb-12 text-glow-purple text-silver-purple-gradient">
                请选择命运之阵
              </h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                {[
                  { id: 'single', name: '单牌阵', desc: '一张牌的阵法，适合日常指引、简单问题、快速解答。当你只需要一个简单的答案或指引时，最适合使用。', cards: 1 },
                  { id: 'three', name: '三牌阵', desc: '经典的三张牌阵：过去-现在-未来。帮助你梳理时间线，适合了解事情的发展脉络。', cards: 3 }
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSpread(s.id as SpreadType);
                      setStep('shuffle');
                    }}
                    className="flex-1 bg-purple-950/40 border border-purple-500/30 p-8 rounded-2xl cursor-pointer hover:bg-purple-900/40 hover:border-purple-400/60 transition-all group"
                  >
                    <h3 className="text-2xl font-serif text-purple-200 mb-4 group-hover:text-purple-100">{s.name}</h3>
                    <div className="mb-4 text-purple-300 opacity-80 text-sm h-12">{s.desc}</div>
                    <div className="text-purple-400/60 font-serif tracking-widest">抽取 {s.cards} 张</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'shuffle' && (
            <ShuffleView onComplete={() => setStep('question')} />
          )}

          {step === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl flex flex-col items-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center text-glow-purple text-silver-purple-gradient">
                你心中的疑惑是什么？
              </h2>
              <div className="w-full p-6 bg-purple-950/60 border border-purple-500/30 rounded-2xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.05)] relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例如：我最近的职业发展会怎样？"
                  className="w-full h-40 bg-transparent text-purple-100 focus:outline-none resize-none text-lg placeholder:text-purple-300/30"
                />
                <button
                  onClick={handleRandomQuestion}
                  className="absolute bottom-4 right-6 text-sm font-serif text-purple-300/60 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>
                  随机问题
                </button>
              </div>
              <div className="w-full flex flex-col gap-1.5 mb-6 px-1">
                {[
                  { icon: '✅', text: '问题尽量简短明确，建议不超过 10 字' },
                  { icon: '❌', text: '健康、生死相关问题请咨询专业医生' },
                  { icon: '❌', text: '请勿打听他人私事或意图，尊重他人自由意志' },
                  { icon: '❌', text: '避免问"注定会怎样"，选择权永远在自己手中' },
                ].map((tip, i) => (
                  <p key={i} className="text-xs font-serif tracking-wide flex items-start gap-1.5 opacity-70">
                    <span className="shrink-0">{tip.icon}</span>
                    <span className="text-glow text-gold-gradient">{tip.text}</span>
                  </p>
                ))}
              </div>
              <button
                disabled={!question.trim()}
                onClick={() => setStep('select')}
                className="group relative px-8 py-4 bg-transparent border border-purple-500/50 rounded-full overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400"
              >
                <div className="absolute inset-0 bg-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative font-serif text-xl tracking-widest text-purple-100">开始抽牌</span>
              </button>
            </motion.div>
          )}

          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-3xl md:text-4xl mb-4 text-center text-glow-purple text-silver-purple-gradient"
              >
                {selectedCards.length < SPREAD_CARDS[spread] ? `请抽取 ${SPREAD_CARDS[spread]} 张牌 (${selectedCards.length}/${SPREAD_CARDS[spread]})` : "命运的指引..."}
              </motion.h2>
              <p className="text-purple-200 font-serif italic mb-2 opacity-80">78张命运之牌已平铺，请凭直觉选择</p>
              <p className="text-xs font-serif mb-8 tracking-wide text-glow text-gold-gradient opacity-60">✦ 闭眼片刻，将注意力放在问题上，再睁眼选牌</p>

              <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-8 md:px-12 pt-10 pb-8 sm:pt-16 sm:pb-12 md:pt-24 md:pb-16 bg-gradient-to-b from-purple-900/40 to-[#130026]/80 rounded-[2rem] sm:rounded-[3rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.5)] border border-purple-800/30 backdrop-blur-sm">
                <div className="w-full py-24 sm:py-32 -my-24 sm:-my-32">
                  <div className="relative w-full h-20 sm:h-28 md:h-36 lg:h-40 mx-auto px-2 sm:px-4 mt-2 sm:mt-4 md:mt-6">
                    {deck.map((card, i) => {
                    const isSelected = selectedCards.includes(i);
                    const isFull = selectedCards.length === SPREAD_CARDS[spread];
                    const isOtherSelected = isFull && !isSelected;
                    const xOffset = `-${(i / 77) * 100}%`;

                    return (
                      <motion.div
                        key={card.id}
                        id={`tarot-card-${i}`}
                        className={clsx(
                          "absolute top-0 cursor-pointer transition-shadow duration-500 origin-bottom",
                          "w-10 h-16 sm:w-14 sm:h-24 md:w-16 md:h-28 lg:w-20 lg:h-36",
                          isSelected
                            ? "z-50 shadow-[0_0_40px_12px_rgba(212,175,55,0.8)] rounded-sm"
                            : "z-10 hover:z-30 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]",
                          isOtherSelected && "opacity-30 pointer-events-none"
                        )}
                        style={{
                          left: `${(i / 77) * 100}%`,
                        }}
                        initial={{ x: xOffset, y: "-10%" }}
                        animate={{
                          x: xOffset,
                          y: isSelected ? "-40%" : "-10%",
                          scale: isSelected ? 1.5 : 1,
                        }}
                        whileHover={!isFull && !isSelected ? { scale: 1.3, y: "-30%" } : {}}
                        onClick={() => handleCardClick(i)}
                      >
                        <TarotCard
                          name={card.name}
                          numeral={card.numeral}
                          image={card.image}
                          isFlipped={isSelected}
                          isReversed={card.isReversed}
                          className="w-full h-full rounded-sm"
                        />
                      </motion.div>
                    );
                  })}
                  </div>
                </div>
              </div>

              {selectedCards.length < SPREAD_CARDS[spread] && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    let randomIndices: number[] = [...selectedCards];
                    while (randomIndices.length < SPREAD_CARDS[spread]) {
                      const randomIndex = Math.floor(Math.random() * deck.length);
                      if (!randomIndices.includes(randomIndex)) {
                        randomIndices.push(randomIndex);
                        handleCardClick(randomIndex);
                      }
                    }
                  }}
                  className="mt-16 px-6 py-2 border border-purple-500/30 rounded-full hover:border-purple-500/80 hover:bg-purple-500/10 transition-all font-serif tracking-widest text-sm"
                >
                  <span className="text-purple-100">随机抽取剩余卡牌</span>
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-5xl glass-panel p-6 md:p-12 rounded-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col items-center gap-6 mb-12">
                 <div className="text-center mb-4">
                   <h3 className="font-serif text-xl text-silver-purple-gradient text-glow-purple mb-2">你的问题</h3>
                   <p className="text-purple-100 text-lg italic opacity-90">"{question}"</p>
                 </div>
                 
                 {selectedCards.length > 0 && (
                   <div className="flex flex-col items-center gap-8 w-full">
                     <span className="font-serif text-sm text-purple-200 opacity-80 uppercase tracking-widest">
                       命运之牌 ({spread === 'single' ? '单牌阵' : spread === 'three' ? '三牌阵' : '十字牌阵'})
                     </span>
                     
                     <div className={clsx(
                       "flex justify-center gap-4 md:gap-8 w-full flex-row flex-wrap"
                     )}>
                       {selectedCards.map((cardIndex, i) => {
                         let label = "";
                         if (spread === 'three') {
                           label = i === 0 ? "过去" : i === 1 ? "现在" : "未来";
                         }

                         return (
                           <div key={cardIndex} className="flex flex-col items-center gap-4">
                             {label && <span className="font-serif text-purple-300/80 text-sm">{label}</span>}
                             <TarotCard
                               name={deck[cardIndex].name}
                               numeral={deck[cardIndex].numeral}
                               image={deck[cardIndex].image}
                               isFlipped={true}
                               isReversed={deck[cardIndex].isReversed}
                               className={clsx(
                                 "pointer-events-none shadow-2xl shadow-purple-500/20",
                                 spread === 'single' ? "w-32 h-56 md:w-48 md:h-80" : "w-24 h-40 md:w-32 md:h-56"
                               )}
                             />
                             <div className="text-center mt-2 max-w-[120px] md:max-w-[160px]">
                               <h4 className="font-serif text-sm md:text-base text-silver-purple-gradient text-glow-purple tracking-wider">
                                 {deck[cardIndex].nameCn} {deck[cardIndex].isReversed ? "(逆位)" : "(正位)"}
                               </h4>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}
              </div>

              <div className="prose prose-invert prose-purple max-w-none font-serif text-lg leading-relaxed text-left">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-purple-200 animate-pulse">正在解读星辰的启示...</p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="w-full flex-1"
                  >
                    {(coreTopic || interpretation) && (
                      <div className="w-full">
                        {/* 核心讯息 */}
                        {coreTopic && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 w-full"
                          >
                            <div className="flex items-center gap-2 mb-4 px-1">
                              <span className="text-[#d4af37] text-xl leading-none">✦</span>
                              <h3 className="text-gray-100 font-bold text-lg tracking-wide">核心讯息</h3>
                            </div>
                            <div className="bg-[#241a3a] border border-[#402e5c] rounded-xl p-5 shadow-lg w-full">
                              <h4 className="text-[#a16df2] text-lg font-bold mb-3">{coreTopic}</h4>
                              <p className="text-[#9ca3af] text-[15px] leading-relaxed">{coreBrief}</p>
                            </div>
                          </motion.div>
                        )}

                        {/* 流式正文 */}
                        <div className="markdown-body">
                          <ReactMarkdown>{interpretation}</ReactMarkdown>
                          {isStreaming && (
                            <span className="inline-block w-[2px] h-[1.1em] bg-purple-400 ml-0.5 align-middle animate-pulse" />
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {!isGenerating && interpretation && (
                <FollowUpChat
                  question={question}
                  cards={selectedCards.map(i => ({
                    name: deck[i].name,
                    nameCn: deck[i].nameCn,
                    isReversed: deck[i].isReversed,
                  }))}
                  spread={spread}
                  reading={interpretation}
                />
              )}

              {!isGenerating && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedCards([]);
                      setQuestion('');
                      setCoreTopic('');
                      setCoreBrief('');
                      setInterpretation('');
                      setStep('spread');
                      setDeck(
                        [...TAROT_DECK]
                          .sort(() => Math.random() - 0.5)
                          .map(card => ({ ...card, isReversed: Math.random() > 0.5 }))
                      );
                    }}
                    className="font-serif text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
                  >
                    <span className="text-purple-200">再次占卜</span>
                  </button>
                  <div className="flex flex-col items-center gap-1 mt-2">
                    {[
                      '✦ 同一问题建议间隔 7 天后再问，结果会更准',
                      '✦ 每月可在月光下净化一次牌组',
                    ].map((tip, i) => (
                      <p key={i} className="text-xs font-serif tracking-wide text-glow text-gold-gradient opacity-60">{tip}</p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
