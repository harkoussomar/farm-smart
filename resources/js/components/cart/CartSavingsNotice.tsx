import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';

interface CartSavingsNoticeProps {
    totalSavings: number;
    savingsPercentage: number;
}

const CartSavingsNotice: React.FC<CartSavingsNoticeProps> = ({ totalSavings, savingsPercentage }) => {
    if (totalSavings <= 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6"
        >
            <Card className="border-green-100 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20">
                <div className="flex items-center gap-4 p-4">
                    <div className="text-green-600 dark:text-green-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2 9h3.365c.427 0 .784-.318.866-.739C6.795 5.509 9.213 4 12 4c2.786 0 5.204 1.509 5.769 4.261.082.421.439.739.866.739H22" />
                            <path d="M2 9v4c0 3.314 2.686 6 6 6h8c3.314 0 6-2.686 6-6V9" />
                            <path d="M15 13v-2" />
                            <path d="M9 13v-2" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-green-700 dark:text-green-400">
                            You're saving ${typeof totalSavings === 'number'
                                ? totalSavings.toFixed(2)
                                : parseFloat(String(totalSavings || 0)).toFixed(2)}
                            ({Math.round(savingsPercentage)}% off)!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                            Discounts automatically applied to eligible items.
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CartSavingsNotice;