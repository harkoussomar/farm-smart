import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    delay?: number;
    className?: string;
}

const SectionHeader = ({ title, delay = 0.15, className = '' }: SectionHeaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`pb-2 ${className}`}
        >
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
        </motion.div>
    );
};

export default SectionHeader;