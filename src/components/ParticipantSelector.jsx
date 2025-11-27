import React from 'react';
import { Check, User } from 'lucide-react';
import { motion } from 'framer-motion';

const FRIENDS = [
    "ภูมิ", "เปรม", "เจ็ต", "ท็อป", "เบส",
    "ซี", "บะจ่าง", "เปปเป้อ", "อชิ", "นาโน"
];

const ParticipantSelector = ({ selected, onToggle }) => {
    return (
        <div className="w-full max-w-md mx-auto p-6 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Who's in the Squad?
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {FRIENDS.map((friend) => {
                    const isSelected = selected.includes(friend);
                    return (
                        <motion.button
                            key={friend}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onToggle(friend)}
                            className={`
                relative flex items-center justify-between p-3 rounded-xl transition-all duration-200
                ${isSelected
                                    ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50'}
                border
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                  p-2 rounded-full 
                  ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-400'}
                `}>
                                    <User size={16} />
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                    {friend}
                                </span>
                            </div>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-blue-400"
                                >
                                    <Check size={18} />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default ParticipantSelector;
