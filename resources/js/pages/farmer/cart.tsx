import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/ui/card';
import FarmerLayout from '../../layouts/FarmerLayout';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { debounce } from 'lodash';

// Import Components
import CartHeader from '../../components/cart/CartHeader';
import CartList from '../../components/cart/CartList';
import CartSummary from '../../components/cart/CartSummary';
import CartSavingsNotice from '../../components/cart/CartSavingsNotice';
import EmptyCart from '../../components/cart/EmptyCart';

// Import Types
import { CartItem } from '../../components/cart/types';

/**
 * Cart Page Component
 *
 * Optimized features:
 * - Implements optimistic UI updates for quantity changes for better user experience
 * - Uses debounced API calls to reduce server load and improve responsiveness
 * - Calculates totals client-side for instant feedback when changing quantities
 * - Prevents multiple concurrent requests when rapidly clicking +/- buttons
 * - Ensures header cart counter updates immediately when items are removed
 */

interface CartProps {
    cartItems: CartItem[];
    cartTotal: number;
    cartSavings: number;
}

const Cart = ({ cartItems, cartTotal, cartSavings }: CartProps) => {
    const { patch, delete: destroy, processing } = useForm();
    const [itemsInCart, setItemsInCart] = useState(cartItems);
    const [isProcessing, setIsProcessing] = useState(false);
    const [localCartTotal, setLocalCartTotal] = useState(cartTotal);
    const [localCartSavings, setLocalCartSavings] = useState(cartSavings);
    const { toast } = useToast();
    const cart = useCart();

    // Update items when cartItems prop changes
    useEffect(() => {
        setItemsInCart(cartItems);
        setLocalCartTotal(cartTotal);
        setLocalCartSavings(cartSavings);
    }, [cartItems, cartTotal, cartSavings]);

    // Sync zustand cart with backend cart
    useEffect(() => {
        // Check if the cart items have actually changed before syncing
        // Compare ids and quantities to determine if a sync is needed
        const zustandItems = cart.items;
        const backendIds = new Set(cartItems.map(item => item.id));
        const zustandIds = new Set(zustandItems.map(item => item.id));

        // Check if IDs are different
        const hasIdDifferences =
            backendIds.size !== zustandIds.size ||
            [...backendIds].some(id => !zustandIds.has(id)) ||
            [...zustandIds].some(id => !backendIds.has(id));

        // Check if quantities are different for items with same ID
        const hasQuantityDifferences =
            cartItems.some(backendItem => {
                const storeItem = zustandItems.find(item => item.id === backendItem.id);
                return storeItem && storeItem.quantity !== backendItem.quantity;
            });

        // Only sync if there are actual differences
        if (hasIdDifferences || hasQuantityDifferences) {
            // Use the synchronize method to fully update the Zustand store
            cart.synchronize(cartItems);
        }
    }, [cartItems, cart]);

    // Recalculate cart totals locally
    const recalculateCartTotals = useCallback((updatedItems: CartItem[]) => {
        let total = 0;
        let savings = 0;

        updatedItems.forEach(item => {
            // Calculate item total price including any discount
            const itemUnitPrice = parseFloat(String(item.unit_price || 0));
            const itemQuantity = parseInt(String(item.quantity || 0));
            const itemDiscountPercentage = parseFloat(String(item.discount_percentage || 0));

            let itemTotalPrice = itemUnitPrice * itemQuantity;

            if (itemDiscountPercentage > 0) {
                itemTotalPrice = itemTotalPrice - (itemTotalPrice * (itemDiscountPercentage / 100));
            }

            // Update total price for the item
            item.total_price = itemTotalPrice;

            // Add to cart totals
            total += itemTotalPrice;
            savings += (itemUnitPrice * itemQuantity) - itemTotalPrice;
        });

        setLocalCartTotal(total);
        setLocalCartSavings(savings);
        return updatedItems;
    }, []);

    // Debounced server update function
    const debouncedServerUpdate = useCallback(
        debounce(async (id: number, quantity: number) => {
            try {
                await axios.patch(`/farmer/cart/${id}`, {
                    quantity,
                });
            } catch (error) {
                console.error('Failed to update item quantity', error);

                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: 'Failed to update item quantity'
                });
            } finally {
                setIsProcessing(false);
            }
        }, 500),
        []
    );

    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;

        try {
            // Update local state for immediate UI feedback
            const updatedItems = itemsInCart.map(item => {
                if (item.id === id) {
                    return { ...item, quantity };
                }
                return item;
            });

            // Recalculate totals and update state
            const itemsWithUpdatedTotals = recalculateCartTotals([...updatedItems]);
            setItemsInCart(itemsWithUpdatedTotals);

            // Update frontend cart state for the header icon
            cart.updateQuantity(id, quantity);

            // Debounced server request
            debouncedServerUpdate(id, quantity);
        } catch (error) {
            console.error('Failed to update item quantity', error);

            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to update item quantity'
            });
        }
    };

    const removeItem = async (id: number) => {
        // Don't allow multiple concurrent removals
        if (isProcessing) return;

        try {
            setIsProcessing(true);

            // Immediately remove from Zustand store to update the header immediately
            cart.removeItem(id);

            // Optimistic UI update in the cart page
            const updatedItems = itemsInCart.filter((item) => item.id !== id);
            setItemsInCart(updatedItems);

            // Recalculate totals after removal
            recalculateCartTotals([...updatedItems]);

            // Then make the API call
            await axios.delete(`/farmer/cart/${id}`);

            // Force refresh the page to ensure all components update correctly
            // This is a simple but effective solution when reactive updates aren't working
            window.location.reload();

            // The following code won't execute due to the page reload
            toast({
                title: 'Item removed',
                variant: 'success',
                description: 'Item removed from cart successfully'
            });

        } catch (error) {
            console.error('Failed to remove item from cart', error);

            // If there's an error, revert the UI change
            setItemsInCart(cartItems);
            setLocalCartTotal(cartTotal);
            setLocalCartSavings(cartSavings);

            // Also revert the Zustand store if the backend operation failed
            cart.synchronize(cartItems);

            // Show error toast
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to remove item from cart'
            });

        } finally {
            setIsProcessing(false);
        }
    };

    // Calculate savings
    const totalSavings = localCartSavings;
    const savingsPercentage = localCartTotal > 0 ? (totalSavings / (localCartTotal + totalSavings)) * 100 : 0;

    return (
        <FarmerLayout>
            <Head title="Shopping Cart" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-8 min-h-199"
            >
                <CartHeader />

                {itemsInCart.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <CartList
                                items={itemsInCart}
                                updateQuantity={updateQuantity}
                                removeItem={removeItem}
                                isProcessing={isProcessing}
                            />

                            <CartSavingsNotice
                                totalSavings={totalSavings}
                                savingsPercentage={savingsPercentage}
                            />
                        </div>

                        <div>
                            <Card>
                                <CartSummary
                                    cartTotal={localCartTotal}
                                    cartSavings={localCartSavings}
                                    processing={processing}
                                />
                            </Card>
                        </div>
                    </div>
                ) : (
                    <Card>
                        <EmptyCart />
                    </Card>
                )}
            </motion.div>
        </FarmerLayout>
    );
};

export default Cart;
