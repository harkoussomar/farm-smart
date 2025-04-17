import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    delay?: number;
    color?: string;
}

const StatCard = ({ title, value, icon, delay = 0, color = 'var(--primary)' }: StatCardProps) => (
    <AnimatedCard delay={delay} className="relative p-6 overflow-hidden">
        <div className="flex items-start justify-between">
            <div className="z-10 flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <motion.p
                    className="text-3xl font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: delay + 0.3 }}
                >
                    {value}
                </motion.p>
            </div>
            <motion.div
                className="p-2 rounded-full text-primary bg-primary/10"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
                {icon}
            </motion.div>
        </div>
        <div className="absolute w-24 h-24 rounded-full -right-6 -bottom-6 opacity-10" style={{ backgroundColor: color }} />
    </AnimatedCard>
);

export default StatCard;