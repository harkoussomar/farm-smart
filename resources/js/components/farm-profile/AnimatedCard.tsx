import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, delay = 0, className = '' }) => {
    return (
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
};

export default AnimatedCard;