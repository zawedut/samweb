import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6',
    '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6'
];

const Wheel = ({ participants, onWinnerSelected }) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const wheelRef = useRef(null);

    const count = participants.length;
    const segmentAngle = 360 / count;
    const size = 360; // SVG viewBox size
    const center = size / 2;
    const radius = size / 2 - 4; // Leave room for border

    // Dynamic font size based on participant count
    const getFontSize = () => {
        if (count <= 3) return 18;
        if (count <= 5) return 15;
        if (count <= 7) return 13;
        return 11;
    };

    // Create SVG path for a pie segment
    const getSegmentPath = (index) => {
        const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

        return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };

    // Get text position (centered in segment, pushed outward)
    const getTextPosition = (index) => {
        const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
        const textRadius = radius * 0.62;
        return {
            x: center + textRadius * Math.cos(midAngle),
            y: center + textRadius * Math.sin(midAngle),
            angle: (index + 0.5) * segmentAngle,
        };
    };

    const spinWheel = () => {
        if (isSpinning || count < 2) return;

        setIsSpinning(true);
        // 8-12 full spins + random position
        const newRotation = rotation + 2880 + Math.random() * 1440;
        setRotation(newRotation);

        // Calculate winner — pointer is at top (0°/360°)
        const normalizedRotation = newRotation % 360;
        const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
        const winner = participants[winningIndex];

        setTimeout(() => {
            setIsSpinning(false);
            onWinnerSelected(winner);
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }, 10000);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Pointer */}
                <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-12 bg-white shadow-xl"
                    style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                />

                {/* Wheel */}
                <motion.div
                    ref={wheelRef}
                    className="w-full h-full"
                    animate={{ rotate: rotation }}
                    transition={{
                        duration: 10,
                        ease: [0.12, 0.6, 0.08, 1],
                    }}
                >
                    <svg
                        viewBox={`0 0 ${size} ${size}`}
                        className="w-full h-full drop-shadow-2xl"
                    >
                        {/* Circle border */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius + 2}
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                        />

                        {/* Segments */}
                        {participants.map((p, i) => {
                            const textPos = getTextPosition(i);
                            // Rotate text so it reads outward from center
                            let textRotation = textPos.angle;
                            // Flip text that would be upside down
                            if (textRotation > 90 && textRotation < 270) {
                                textRotation += 180;
                            }

                            return (
                                <g key={i}>
                                    <path
                                        d={getSegmentPath(i)}
                                        fill={COLORS[i % COLORS.length]}
                                        stroke="rgba(255,255,255,0.15)"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={textPos.x}
                                        y={textPos.y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="white"
                                        fontSize={getFontSize()}
                                        fontWeight="bold"
                                        transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
                                        style={{
                                            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                                            fontFamily: 'system-ui, sans-serif',
                                        }}
                                    >
                                        {p.length > 6 ? p.slice(0, 5) + '…' : p}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </motion.div>

                {/* Center Button */}
                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-200 hover:scale-105 active:scale-95 transition-transform z-10"
                >
                    <span className="font-black text-slate-800 text-xl">
                        {isSpinning ? '...' : 'หมุน!'}
                    </span>
                </button>
            </div>

            <p className="mt-8 text-slate-400 animate-pulse">
                {isSpinning ? 'กำลังเฟ้นหาผู้โชคดี...' : 'กดปุ่มตรงกลางเพื่อเริ่มความบันเทิง'}
            </p>
        </div>
    );
};

export default Wheel;
