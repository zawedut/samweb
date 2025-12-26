import { useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const COLORS = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
    "#F43F5E",
    "#14B8A6",
];

type WheelProps = {
    participants: string[];
    onWinnerSelected: (winner: string) => void;
};

const Wheel = ({ participants, onWinnerSelected }: WheelProps) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const wheelRef = useRef(null);

    const spinWheel = () => {
        if (isSpinning || participants.length < 2) return;

        setIsSpinning(true);
        const newRotation = rotation + 1800 + Math.random() * 360; // At least 5 full spins
        setRotation(newRotation);

        // Calculate winner
        const segmentAngle = 360 / participants.length;
        const normalizedRotation = newRotation % 360;
        const winningIndex = Math.floor(
            ((360 - normalizedRotation) % 360) / segmentAngle
        );
        const winner = participants[winningIndex];

        setTimeout(() => {
            setIsSpinning(false);
            onWinnerSelected(winner);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        }, 8000); // 8 seconds spin
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Pointer */}
                <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-12 bg-white clip-path-triangle shadow-xl"
                    style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
                />

                {/* Wheel */}
                <motion.div
                    ref={wheelRef}
                    className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative bg-slate-800"
                    animate={{ rotate: rotation }}
                    transition={{ duration: 8, ease: [0.2, 0.8, 0.2, 1] }} // Custom cubic-bezier for realistic spin
                >
                    {participants.map((p, i) => {
                        const angle = 360 / participants.length;
                        const rotate = i * angle;
                        const skew = 90 - angle;

                        return (
                            <div
                                key={i}
                                className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left border-b border-l border-white/10"
                                style={{
                                    transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                                    backgroundColor: COLORS[i % COLORS.length],
                                }}
                            >
                                <div
                                    className="absolute left-0 bottom-0 w-full h-full flex items-end justify-center pb-4"
                                    style={{
                                        transform: `skewY(${skew}deg) rotate(${
                                            angle / 2
                                        }deg)`,
                                    }}
                                >
                                    <span className="text-white font-bold text-lg md:text-xl drop-shadow-md whitespace-nowrap transform -translate-y-8 md:-translate-y-12">
                                        {p}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Center Button */}
                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-200 hover:scale-105 active:scale-95 transition-transform z-10"
                >
                    <span className="font-black text-slate-800 text-xl">
                        {isSpinning ? "..." : "หมุน!"}
                    </span>
                </button>
            </div>

            <p className="mt-8 text-slate-400 animate-pulse">
                {isSpinning
                    ? "กำลังเฟ้นหาผู้โชคดี..."
                    : "กดปุ่มตรงกลางเพื่อเริ่มความบันเทิง"}
            </p>
        </div>
    );
};

export default Wheel;
