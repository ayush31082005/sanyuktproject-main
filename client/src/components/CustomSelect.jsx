import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2.5 bg-[#0D0D0D] border transition-all cursor-pointer flex items-center justify-between group ${
                    isOpen ? 'border-[#C8A96A] ring-1 ring-[#C8A96A]/30' : 'border-[#C8A96A]/20 hover:border-[#C8A96A]/50'
                }`}
            >
                <span className={`text-sm font-bold uppercase tracking-widest ${selectedOption ? 'text-[#F5E6C8]' : 'text-[#F5E6C8]/25'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#C8A96A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[100] w-full bg-[#1A1A1A] border border-[#C8A96A]/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${
                                        value === option.value
                                            ? 'bg-[#C8A96A] text-[#0D0D0D]'
                                            : 'text-[#F5E6C8]/70 hover:bg-[#C8A96A]/10 hover:text-[#C8A96A]'
                                    }`}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
