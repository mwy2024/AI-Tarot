import { motion } from 'motion/react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TarotCardProps {
  name?: string;
  numeral?: string;
  image?: string;
  isFlipped: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TarotCard({ name, numeral, image, isFlipped, isReversed, onClick, className }: TarotCardProps) {
  return (
    <motion.div
      className={twMerge(clsx("relative cursor-pointer perspective-1000 group", className))}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          rotateZ: isFlipped && isReversed ? 180 : 0 
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rounded-sm border border-gold-500/40 bg-zinc-950 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-shadow duration-300">
          <img 
            src="/card-back.jpg" 
            alt="Tarot Card Back" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a dark pattern if the image is not found
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]', 'from-zinc-800', 'to-black');
            }}
          />
          {/* Fallback pattern (hidden by default, shown if image fails to load) */}
          <div className="absolute inset-1.5 border border-gold-500/30 rounded-sm flex items-center justify-center -z-10">
             <div className="w-12 h-12 border border-gold-400/40 rotate-45" />
          </div>
        </div>

        {/* Front of Card */}
        <div
          className="absolute inset-0 backface-hidden rounded-sm border border-gold-500/50 bg-zinc-950 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-2 border border-gold-500/30 rounded-sm flex flex-col items-center justify-between p-3 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black">
              <span className="font-serif text-silver-purple-gradient text-lg md:text-xl tracking-widest">{numeral}</span>
              <div className="flex-1 w-full flex items-center justify-center my-2 md:my-4 border-y border-gold-500/20">
                 <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold-500/30 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500/10 rounded-full blur-sm" />
                    <div className="w-8 h-8 md:w-10 md:h-10 border border-gold-500/20 rotate-45" />
                 </div>
              </div>
              <span className="font-serif text-purple-200 text-sm md:text-base tracking-wider text-center uppercase leading-tight">{name}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
