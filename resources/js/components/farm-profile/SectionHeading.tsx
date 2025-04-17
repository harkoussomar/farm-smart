import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
    icon: ReactNode;
    title: string;
    subtitle: string;
    delay?: number;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ icon, title, subtitle, delay = 0 }) => {
    return (
        <motion.div
            className="flex items-center gap-3 my-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
        </motion.div>
    );
};

export default SectionHeading;