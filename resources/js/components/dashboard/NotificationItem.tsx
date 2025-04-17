import React from 'react';
import { motion } from 'framer-motion';

interface NotificationItemProps {
    icon?: React.ReactNode;
    color: string;
    title: string;
    description: string;
    time: string;
    delay?: number;
}

const NotificationItem = ({ icon, color, title, description, time, delay = 0 }: NotificationItemProps) => (
    <motion.div
        className="flex items-start gap-4 border-b pb-4 last:border-b-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ x: 5, transition: { duration: 0.2 } }}
    >
        <div className={`mt-2 h-2 w-2 rounded-full`} style={{ backgroundColor: color }} />
        <div>
            <p className="font-medium">{title}</p>
            <p className="text-muted-foreground text-sm">{description}</p>
            <p className="text-muted-foreground mt-1 text-xs">{time}</p>
        </div>
    </motion.div>
);

export default NotificationItem;