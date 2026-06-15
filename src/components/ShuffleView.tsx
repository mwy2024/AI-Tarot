import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TarotCard from './TarotCard';
import { TAROT_DECK } from '../utils/tarotData';

const TEXTS = [
  "闭上双眼，深呼吸...",
  "在心中默念你的疑惑...",
  "命运的轨迹正在交织...",
  "洗牌完成。请保持专注，点击继续"
];

export default function ShuffleView({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2500);
    const t2 = setTimeout(() => setPhase(2), 5000);
    const t3 = setTimeout(() => {
      setPhase(3);
      setIsShuffled(true);
    }, 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Use 12 cards for the mandala animation
  const cards = Array.from({ length: 12 }).map((_, i) => i);

  return (
    <motion.div
      key="shuffle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-[70vh] w-full relative overflow-hidden"
    >
      {/* Mystical background glow */}
      <motion.div 
        className="absolute inset-0 bg-gold-900/10 blur-[60px] rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="h-24 mb-16 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.h2
            key={phase}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-xl md:text-2xl font-serif tracking-widest text-silver-purple-gradient text-glow-purple drop-shadow-md text-center"
          >
            {TEXTS[phase]}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="relative w-40 h-64 md:w-48 md:h-80 perspective-1000 mb-20 z-10">
        {cards.map((i) => {
          const angle = (i / cards.length) * Math.PI * 2;
          const radius = 120; // Spread radius
          
          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ x: 0, y: 0, rotateZ: 0, scale: 0 }}
              animate={
                isShuffled
                  ? { 
                      x: 0, 
                      y: 0, 
                      rotateZ: (i - 5.5) * 2,
                      scale: 1,
                      transition: { duration: 1, type: 'spring', bounce: 0.4, delay: i * 0.05 }
                    }
                  : {
                      x: [0, Math.sin(angle) * radius, Math.sin(angle + Math.PI) * radius * 0.5, 0],
                      y: [0, -Math.cos(angle) * radius, -Math.cos(angle + Math.PI) * radius * 0.5, 0],
                      rotateZ: [0, angle * (180 / Math.PI), angle * (180 / Math.PI) + 180, 360],
                      scale: [0, 1, 1, 1],
                      zIndex: [i, i, 12 - i, i]
                    }
              }
              transition={
                isShuffled
                  ? {} // Handled in animate object
                  : {
                      duration: 7.5,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.8, 1]
                    }
              }
            >
              <TarotCard
                name={TAROT_DECK[0].name}
                numeral={TAROT_DECK[0].numeral}
                image={TAROT_DECK[0].image}
                isFlipped={false}
                className="w-full h-full shadow-2xl shadow-purple-900/30 border border-purple-500/20"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="h-20 flex items-center justify-center z-10">
        <AnimatePresence>
          {isShuffled && (
            <motion.button
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              onClick={onComplete}
              className="group relative px-12 py-3 bg-transparent border border-gold-500/40 rounded-full overflow-hidden transition-all duration-500 hover:border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
              <span className="relative font-serif text-lg tracking-[0.3em] text-purple-100 font-light">
                继续
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
