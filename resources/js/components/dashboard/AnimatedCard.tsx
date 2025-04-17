import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedCardProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

const AnimatedCard = ({ children, delay = 0, className = '' }: AnimatedCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}
    >
        {children}
    </motion.div>
);

export default AnimatedCard;