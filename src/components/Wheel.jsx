import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';

const COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
];

const Wheel = ({ participants, onWinnerSelected }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const controls = useAnimation();
    const rotationRef = useRef(0);

    const spinWheel = async () => {
        if (isSpinning || participants.length < 2) return;

        setIsSpinning(true);

        const segmentAngle = 360 / participants.length;
        const randomOffset = Math.random() * 360;
        // Increase spins for more suspense (8-10 full spins)
        const totalRotation = 3600 + randomOffset;

        const currentRotation = rotationRef.current;
        const newRotation = currentRotation + totalRotation;
        rotationRef.current = newRotation;

        await controls.start({
            rotate: newRotation,
            transition: {
                duration: 8, // Longer duration for suspense
                ease: [0.2, 0.8, 0.2, 1],
                type: "tween"
            }
        });

        // Calculate winner
        const normalizedRotation = newRotation % 360;
        const winningIndex = Math.floor(
            (participants.length - (normalizedRotation % 360) / segmentAngle)
        ) % participants.length;

        const actualIndex = (winningIndex + participants.length) % participants.length;
        const winner = participants[actualIndex];

        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: COLORS
        });

        setIsSpinning(false);
        onWinnerSelected(winner);
    };

    if (participants.length === 0) {
        return <div className="text-center text-slate-400">Add friends to spin!</div>;
    }

    const segmentAngle = 360 / participants.length;

    return (
        <div className="flex flex-col items-center justify-center py-4 md:py-8 w-full">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 filter drop-shadow-lg">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-white" />
                </div>

                {/* Wheel */}
                <motion.div
                    className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden relative bg-slate-800"
                    animate={controls}
                    style={{ rotate: rotationRef.current }}
                >
                    {/* Segments Background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `conic-gradient(
                from 0deg,
                ${participants.map((_, i) =>
                                `${COLORS[i % COLORS.length]} ${i * (100 / participants.length)}% ${(i + 1) * (100 / participants.length)}%`
                            ).join(', ')}
              )`
                        }}
                    />

                    {/* Text Labels */}
                    {participants.map((p, i) => {
                        const angle = (i * segmentAngle) + (segmentAngle / 2); // Center of segment
                        return (
                            <div
                                key={p}
                                className="absolute w-full h-full left-0 top-0 flex justify-center"
                                style={{
                                    transform: `rotate(${angle}deg)`,
                                }}
                            >
                                <div
                                    className="mt-8 md:mt-12 transform origin-top"
                                    style={{
                                        // No extra rotation needed if we want it radiating out
                                    }}
                                >
                                    <span className="block text-white font-black text-sm md:text-lg uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm whitespace-nowrap max-w-[100px] md:max-w-[140px] overflow-hidden text-ellipsis text-center">
                                        {p}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800 rounded-full border-4 border-slate-700 z-10 flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                </div>
            </div>

            <button
                onClick={spinWheel}
                disabled={isSpinning || participants.length < 2}
                className={`
          mt-8 px-10 py-4 rounded-full font-black text-xl tracking-wide transition-all transform
          ${isSpinning || participants.length < 2
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] active:scale-95'}
        `}
            >
                {isSpinning ? 'SPINNING...' : 'SPIN IT! 🎰'}
            </button>
        </div>
    );
};

export default Wheel;
