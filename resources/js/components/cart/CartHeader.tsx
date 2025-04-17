import React from 'react';
import { motion } from 'framer-motion';

const CartHeader: React.FC = () => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">Review your items and proceed to checkout</p>
        </motion.div>
    );
};

export default CartHeader;