import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, DollarSign, User, Frown, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

type BillCalculatorProps = {
    payer: string;
    participants: string[];
};

type Result = {
    totalMoneyReady: number;
    difference: number;
    isMatch: boolean;
};

type Contribution = Record<string, number>;

const BillCalculator = ({ payer, participants }: BillCalculatorProps) => {
    const [totalBill, setTotalBill] = useState("");
    const [payerCost, setPayerCost] = useState("");
    const [contributions, setContributions] = useState<Contribution>({});
    const [results, setResults] = useState<Result | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const newContribs: Contribution = participants.reduce((acc, p) => {
            if (p !== payer) acc[p] = 0;
            return acc;
        }, {} as Contribution);

        setContributions(newContribs);
        setResults(null);
        setShowModal(false);
    }, [participants, payer]);

    const handleContributionChange = (person: string, amount: number) => {
        setContributions((prev) => ({
            ...prev,
            [person]: amount,
        }));
    };

    const calculate = () => {
        const bill = parseFloat(totalBill) || 0;
        const payerShare = parseFloat(payerCost) || 0;

        const totalCollectedFromFriends = Object.values(contributions).reduce(
            (total, val) => total + val,
            0
        );

        const totalMoneyReady = payerShare + totalCollectedFromFriends;
        const difference = totalMoneyReady - bill;
        const isMatch = Math.abs(difference) < 0.01;

        setResults({
            totalMoneyReady,
            difference,
            isMatch,
        });
        setShowModal(true);

        if (isMatch) {
            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.6 },
                colors: ["#10B981", "#34D399", "#059669", "#FBBF24"],
            });
        } else if (difference > 0) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ["#EAB308", "#FACC15", "#FEF08A"],
            });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-xl mt-4 md:mt-8 relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    <Calculator size={24} />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        เครื่องคิดเลขทวงหนี้ 💸
                    </h2>
                    <p className="text-slate-400 text-sm">
                        เช็คซิว่าเพื่อนจ่ายครบหรือยัง
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Total Bill Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                        ค่าเสียหายทั้งหมด (บาท)
                    </label>
                    <div className="relative">
                        <DollarSign
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            size={18}
                        />
                        <input
                            type="number"
                            value={totalBill}
                            onChange={(e) => setTotalBill(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-lg"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-700/50 my-4" />

                {/* Payer's Input */}
                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    <label className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <User size={16} />
                        ส่วนของ {payer} (คนจ่าย)
                    </label>
                    <input
                        type="number"
                        value={payerCost}
                        onChange={(e) => setPayerCost(e.target.value)}
                        className="w-full bg-slate-900/80 border border-blue-500/30 rounded-lg py-2 px-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder={`${payer} สั่งไปเท่าไหร่?`}
                    />
                </div>

                {/* Friends' Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participants
                        .filter((p) => p !== payer)
                        .map((p) => (
                            <div key={p}>
                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                    ส่วนของ {p}
                                </label>
                                <input
                                    type="number"
                                    value={contributions[p] || ""}
                                    onChange={(e) =>
                                        handleContributionChange(
                                            p,
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="0.00"
                                />
                            </div>
                        ))}
                </div>

                <button
                    onClick={calculate}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                    ตรวจสอบยอดเงิน
                </button>
            </div>

            {/* Result Modal */}
            <AnimatePresence>
                {showModal && results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`
                w-full max-w-md p-8 rounded-3xl shadow-2xl text-center border-4
                ${
                    results.isMatch
                        ? "bg-gradient-to-br from-green-900 to-slate-900 border-green-500"
                        : results.difference > 0
                        ? "bg-gradient-to-br from-yellow-900 to-slate-900 border-yellow-500"
                        : "bg-gradient-to-br from-red-900 to-slate-900 border-red-500"
                }
              `}
                        >
                            <div className="mb-6 flex justify-center">
                                {results.isMatch ? (
                                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_#10B981]">
                                        <PartyPopper
                                            size={48}
                                            className="text-white"
                                        />
                                    </div>
                                ) : results.difference > 0 ? (
                                    <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_#EAB308]">
                                        <DollarSign
                                            size={48}
                                            className="text-white"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_#EF4444]">
                                        <Frown
                                            size={48}
                                            className="text-white"
                                        />
                                    </div>
                                )}
                            </div>

                            <h3
                                className={`text-4xl font-black mb-2 uppercase italic transform -rotate-2 
                ${
                    results.isMatch
                        ? "text-green-400"
                        : results.difference > 0
                        ? "text-yellow-400"
                        : "text-red-400"
                }`}
                            >
                                {results.isMatch
                                    ? "MISSION PASSED!"
                                    : results.difference > 0
                                    ? "STONKS! 📈"
                                    : "WASTED"}
                            </h3>

                            <p className="text-xl font-bold text-white mb-6">
                                {results.isMatch
                                    ? "ครบจบ แยกย้าย! (Mission Passed)"
                                    : results.difference > 0
                                    ? "กำไรว่ะ! เอาไปเลี้ยงหนมต่อ (Stonks)"
                                    : "เงินไม่ครบ! ใครเนียนไม่จ่าย? (Wasted)"}
                            </p>

                            <div className="bg-black/30 rounded-xl p-4 mb-6 backdrop-blur-md">
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>ยอดที่ต้องจ่าย:</span>
                                    <span>
                                        {(parseFloat(totalBill) || 0).toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>เก็บได้จริง:</span>
                                    <span>
                                        {results.totalMoneyReady.toFixed(2)}
                                    </span>
                                </div>
                                <div
                                    className={`flex justify-between text-xl font-bold border-t border-white/10 pt-2 
                  ${
                      results.isMatch
                          ? "text-green-400"
                          : results.difference > 0
                          ? "text-yellow-400"
                          : "text-red-400"
                  }`}
                                >
                                    <span>ส่วนต่าง:</span>
                                    <span>
                                        {results.difference > 0 ? "+" : ""}
                                        {results.difference.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className={`
                  w-full py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95
                  ${
                      results.isMatch
                          ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30"
                          : results.difference > 0
                          ? "bg-yellow-500 hover:bg-yellow-400 text-white shadow-lg shadow-yellow-500/30"
                          : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30"
                  }
                `}
                            >
                                {results.isMatch
                                    ? "แยกย้าย!"
                                    : results.difference > 0
                                    ? "หวานเจี๊ยบ!"
                                    : "ลองใหม่"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BillCalculator;
