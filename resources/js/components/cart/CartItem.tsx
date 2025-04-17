import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { CartItem as CartItemType } from './types';

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    isProcessing: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem, isProcessing }) => {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);

    useEffect(() => {
        setLocalQuantity(item.quantity);
    }, [item.quantity]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity)) {
            setLocalQuantity(newQuantity);
        }
    };

    const handleQuantityBlur = () => {
        if (localQuantity !== item.quantity && localQuantity > 0) {
            updateQuantity(item.id, localQuantity);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (localQuantity !== item.quantity && localQuantity > 0) {
                updateQuantity(item.id, localQuantity);
            }
        }
    };

    const incrementQuantity = () => {
        if (isProcessing) return;
        const newQuantity = localQuantity + 1;
        setLocalQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    const decrementQuantity = () => {
        if (isProcessing || localQuantity <= 1) return;
        const newQuantity = localQuantity - 1;
        setLocalQuantity(newQuantity);
        updateQuantity(item.id, newQuantity);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-3 py-4"
            >
                <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                                src={item.product.image_path || '/placeholder-product.jpg'}
                                alt={item.product.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <h3 className="text-base font-medium">
                                <Link href={`/farmer/products/${item.product.id}`}>{item.product.name}</Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{item.product.product_type.name}</p>
                            <div className="mt-1 flex text-sm">
                                <p className="text-gray-500">SKU: {item.product.sku}</p>
                            </div>
                            <div className="flex items-end justify-between text-sm">
                                <div className="mt-2 flex items-center">
                                    <Label htmlFor={`quantity-${item.id}`} className="sr-only">
                                        Quantity
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-r-none"
                                        onClick={decrementQuantity}
                                        disabled={isProcessing || localQuantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <Input
                                        id={`quantity-${item.id}`}
                                        name="quantity"
                                        type="number"
                                        className="h-8 w-14 rounded-none text-center"
                                        value={localQuantity}
                                        min={1}
                                        onChange={handleQuantityChange}
                                        onBlur={handleQuantityBlur}
                                        onKeyDown={handleKeyDown}
                                        disabled={isProcessing}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-l-none"
                                        onClick={incrementQuantity}
                                        disabled={isProcessing}
                                    >
                                        +
                                    </Button>
                                </div>
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-600"
                                        onClick={() => removeItem(item.id)}
                                        disabled={isProcessing}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-base font-medium text-gray-900">
                            $
                            {typeof item.total_price === 'number'
                                ? item.total_price.toFixed(2)
                                : parseFloat(String(item.total_price || 0)).toFixed(2)}
                        </p>
                        {item.discount_percentage > 0 && (
                            <p className="text-sm text-gray-500">
                                <span className="line-through">
                                    $
                                    {typeof item.unit_price === 'number' && typeof item.quantity === 'number'
                                        ? (item.unit_price * item.quantity).toFixed(2)
                                        : (parseFloat(String(item.unit_price || 0)) * parseFloat(String(item.quantity || 0))).toFixed(2)}
                                </span>{' '}
                                ({item.discount_percentage}% off)
                            </p>
                        )}
                    </div>
                </div>
                <Separator />
            </motion.div>
        </AnimatePresence>
    );
};

export default CartItem;
