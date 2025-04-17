import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Link } from '@inertiajs/react';
import { CartSummaryProps } from './types';

const CartSummary: React.FC<CartSummaryProps> = ({
    cartTotal,
    cartSavings,
    processing
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Trigger animation when cartTotal changes
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [cartTotal]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6"
        >
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                    <p className="text-muted-foreground text-base">Subtotal</p>
                    <motion.p
                        className="text-base font-medium"
                        animate={{ scale: isAnimating ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        ${typeof (cartTotal + cartSavings) === 'number'
                            ? (cartTotal + cartSavings).toFixed(2)
                            : (parseFloat(String(cartTotal || 0)) + parseFloat(String(cartSavings || 0))).toFixed(2)}
                    </motion.p>
                </div>

                {cartSavings > 0 && (
                    <motion.div
                        className="flex justify-between text-green-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p className="text-base">Discount Savings</p>
                        <p className="text-base font-medium">-${typeof cartSavings === 'number'
                            ? cartSavings.toFixed(2)
                            : parseFloat(String(cartSavings || 0)).toFixed(2)}</p>
                    </motion.div>
                )}

                <Separator />

                <div className="flex justify-between">
                    <p className="text-base font-medium">Order Total</p>
                    <motion.p
                        className="text-lg font-bold"
                        animate={{ scale: isAnimating ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        ${typeof cartTotal === 'number'
                            ? cartTotal.toFixed(2)
                            : parseFloat(String(cartTotal || 0)).toFixed(2)}
                    </motion.p>
                </div>

                <Button
                    className="w-full mt-4"
                    size="lg"
                    asChild
                    disabled={processing || cartTotal <= 0}
                >
                    <Link href="/farmer/checkout">
                        Proceed to Checkout
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
};

export default CartSummary;