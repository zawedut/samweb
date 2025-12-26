import { motion } from "framer-motion";
import { Check, UserPlus } from "lucide-react";

const PARTICIPANTS = [
    "ภูมิ",
    "เปรม",
    "เจ็ต",
    "ท็อป",
    "เบส",
    "ซี",
    "บะจ่าง",
    "เปปเป้อ",
    "อชิ",
    "นาโน",
];

type ParticipantSelectorProps = {
    selected: string[];
    onToggle: (name: string) => void;
};

const ParticipantSelector = ({
    selected,
    onToggle,
}: ParticipantSelectorProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <UserPlus size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">
                    เลือกเหยื่อที่จะโดนเชือด 🔪
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                {PARTICIPANTS.map((name) => {
                    const isSelected = selected.includes(name);
                    return (
                        <motion.button
                            key={name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onToggle(name)}
                            className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2
                ${
                    isSelected
                        ? "bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }
              `}
                        >
                            <span
                                className={`font-bold text-lg ${
                                    isSelected ? "text-white" : "text-slate-400"
                                }`}
                            >
                                {name}
                            </span>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1"
                                >
                                    <Check size={12} className="text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="mt-6 text-center text-slate-500 text-sm">
                เลือกอย่างน้อย 2 คนนะจ๊ะ ({selected.length} คนแล้ว)
            </div>
        </div>
    );
};

export default ParticipantSelector;
