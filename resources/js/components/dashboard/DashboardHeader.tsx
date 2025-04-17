import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface DashboardHeaderProps {
    farmerName: string;
}

const DashboardHeader = ({ farmerName }: DashboardHeaderProps) => {
    const [greeting, setGreeting] = useState('Good day');
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    // Set greeting based on time of day
    useEffect(() => {
        const hours = new Date().getHours();
        if (hours < 12) setGreeting('Good morning');
        else if (hours < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    return (
        <motion.div
            className="flex flex-col gap-2"
            style={{ scale, opacity }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <h1 className="text-3xl font-bold">
                    {greeting}, <span className="text-primary">{farmerName}</span>
                </h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
            </motion.div>
        </motion.div>
    );
};

export default DashboardHeader;