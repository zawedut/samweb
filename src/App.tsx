import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticipantSelector from "./components/ParticipantSelector";
import Wheel from "./components/Wheel";
import BillCalculator from "./components/BillCalculator";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";

function App() {
    const [step, setStep] = useState(1); // 1: Select, 2: Wheel, 3: Calculate
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
        []
    );
    const [payer, setPayer] = useState<string | null>(null);

    const toggleParticipant = (name: string) => {
        setSelectedParticipants((prev) =>
            prev.includes(name)
                ? prev.filter((p) => p !== name)
                : [...prev, name]
        );
    };

    const handleWinner = (winner: string) => {
        setPayer(winner);
        setTimeout(() => setStep(3), 3000); // Wait for confetti and realization
    };

    const reset = () => {
        setStep(1);
        setPayer(null);
        setSelectedParticipants([]);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden relative font-sans">
            {/* Background Gradients - Optimized for Mobile */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-purple-500/30 rounded-full blur-[60px] md:blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-500/30 rounded-full blur-[60px] md:blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-cyan-500/20 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-screen">
                <header className="text-center mb-8 md:mb-12">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl mb-2 md:mb-4"
                    >
                        โปรแกรมสุ่มคนจ่าย Sam Steak <span className="text-white">🥩</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-sm md:text-lg flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} className="text-yellow-400" />
                        กินด้วยกัน จ่ายด้วยกัน... แต่เอ็งจ่ายก่อนนะ
                    </motion.p>
                </header>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="w-full flex flex-col items-center"
                        >
                            <ParticipantSelector
                                selected={selectedParticipants}
                                onToggle={toggleParticipant}
                            />

                            <button
                                disabled={selectedParticipants.length < 2}
                                onClick={() => setStep(2)}
                                className={`
                  mt-8 group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg md:text-xl transition-all
                  ${
                      selectedParticipants.length < 2
                          ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 shadow-lg shadow-blue-600/30"
                  }
                `}
                            >
                                ไปหมุนวงล้อแห่งความซวย
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                                ใครจะเป็นผู้โชคดี (จ่ายตัง)? 🤞
                            </h2>
                            <Wheel
                                participants={selectedParticipants}
                                onWinnerSelected={handleWinner}
                            />
                            <button
                                onClick={() => setStep(1)}
                                className="mt-12 text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <RotateCcw size={16} /> กลับไปเลือกคนใหม่
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="text-center mb-8">
                                <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-300 font-bold text-lg md:text-xl mb-4 animate-bounce">
                                    👑 ผู้โชคดีได้แก่... {payer}
                                </div>
                            </div>

                            <BillCalculator
                                payer={payer ?? ""}
                                participants={selectedParticipants}
                            />

                            <button
                                onClick={reset}
                                className="mt-12 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> เริ่มใหม่หมด
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
