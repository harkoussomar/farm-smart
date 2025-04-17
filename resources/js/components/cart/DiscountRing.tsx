import React from 'react';
import { motion } from 'framer-motion';

interface DiscountRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

const DiscountRing: React.FC<DiscountRingProps> = ({
    percentage,
    size = 48,
    strokeWidth = 4,
    color = 'var(--primary)'
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--border)" strokeWidth={strokeWidth} fill="none" />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    fill="none"
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">
                    {`${Math.round(percentage)}%`}
                </text>
            </svg>
        </div>
    );
};

export default DiscountRing;