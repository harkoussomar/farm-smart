import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import CartItem from './CartItem';
import { CartItem as CartItemType } from './types';

interface CartListProps {
    items: CartItemType[];
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    isProcessing: boolean;
}

const CartList: React.FC<CartListProps> = ({
    items,
    updateQuantity,
    removeItem,
    isProcessing,
}) => {
    return (
        <Card>
            <div className="rounded-lg p-6">
                <div className="flow-root">
                    <AnimatePresence>
                        <ul role="list" className="-my-6 divide-y">
                            {items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                    isProcessing={isProcessing}
                                />
                            ))}
                        </ul>
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};

export default CartList;