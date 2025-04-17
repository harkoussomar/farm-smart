import { motion } from 'framer-motion';
import React from 'react';
import { Circle } from 'lucide-react';

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = 'var(--primary)' }: ProgressRingProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ width: size, height: size, position: 'relative' }}>
                    {/* Background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Circle
                            size={size}
                            className="text-border"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                    </div>

                    {/* Progress circle with animation */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ rotate: -90 }}
                        animate={{ rotate: -90 }}
                    >
                        <motion.div
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                        >
                            <Circle
                                size={size}
                                className="text-primary"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                style={{
                                    strokeDashoffset,
                                    stroke: color,
                                    strokeLinecap: 'round'
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className="font-bold"
                            style={{ fontSize: size / 5 }}
                        >
                            {`${Math.round(progress)}%`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressRing;