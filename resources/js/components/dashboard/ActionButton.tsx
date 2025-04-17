import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ActionButtonProps {
    href: string;
    title: string;
    description: string;
    delay?: number;
}

const ActionButton = ({ href, title, description, delay = 0 }: ActionButtonProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        className="w-full"
    >
        <Button variant="outline" asChild className="group h-24 w-full">
            <a href={href} className="relative flex flex-col overflow-hidden">
                <span className="text-lg transition-transform duration-300 group-hover:translate-y-0">{title}</span>
                <span className="text-muted-foreground text-xs transition-transform duration-300 group-hover:translate-y-0">{description}</span>
                <div className="bg-primary absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </a>
        </Button>
    </motion.div>
);

export default ActionButton;