import * as React from "react"
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types';
import { subscribeWithSelector } from 'zustand/middleware';

// Create a global event for cart updates
const CART_UPDATED_EVENT = 'cart-updated';

// Helper function to dispatch cart update events
function dispatchCartUpdate() {
    // First dispatch immediately
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));

    // Then dispatch again after a small delay to ensure it propagates
    // This helps with race conditions and event timing issues
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, {
            bubbles: true,
            detail: { timestamp: Date.now() }
        }));
    }, 50);
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    synchronize: (backendItems: CartItem[]) => void;
}

export const useCart = create<CartStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                items: [],
                addItem: (item) =>
                    set((state) => {
                        const existingItem = state.items.find((i) => i.id === item.id);
                        if (existingItem) {
                            const newState = {
                                items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
                            };
                            dispatchCartUpdate();
                            return newState;
                        }
                        const newState = { items: [...state.items, item] };
                        dispatchCartUpdate();
                        return newState;
                    }),
                removeItem: (id) =>
                    set((state) => {
                        // Simple direct filter to remove the item
                        const updatedItems = state.items.filter((item) => item.id !== id);

                        // Log for debugging
                        console.log("Removing item", id, "from cart. Before:", state.items.length, "After:", updatedItems.length);

                        // Immediate state update
                        dispatchCartUpdate();

                        // Force refresh the entire application state by setting again
                        setTimeout(() => {
                            // Get current state after the first update
                            const currentItems = get().items;

                            // Check if item still exists (could happen due to race conditions)
                            if (currentItems.some(item => item.id === id)) {
                                console.log("Item still exists after removal, forcing second update");
                                // Force another update
                                set({ items: currentItems.filter(item => item.id !== id) });
                                dispatchCartUpdate();
                            }
                        }, 100);

                        return { items: updatedItems };
                    }),
                updateQuantity: (id, quantity) =>
                    set((state) => {
                        const newState = {
                            items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
                        };
                        dispatchCartUpdate();
                        return newState;
                    }),
                clearCart: () => {
                    dispatchCartUpdate();
                    return set({ items: [] });
                },
                synchronize: (backendItems) => {
                    // Get current items
                    const currentItems = get().items;

                    // Deep compare to avoid unnecessary updates
                    const needsUpdate = backendItems.length !== currentItems.length ||
                        backendItems.some((backendItem, index) => {
                            const storeItem = currentItems.find(item => item.id === backendItem.id);
                            if (!storeItem) return true;
                            return storeItem.quantity !== backendItem.quantity;
                        });

                    // Only update state if there's a difference
                    if (needsUpdate) {
                        // Full synchronization with backend data
                        set({ items: [...backendItems] });
                        dispatchCartUpdate();
                    }
                },
            }),
            {
                name: 'cart-storage', // unique name for localStorage
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ items: state.items }), // Only persist the items array
            }
        )
    )
);

// Custom hook to listen for cart updates
export function useCartUpdates(callback: () => void) {
    React.useEffect(() => {
        const handleCartUpdate = () => {
            callback();
        };

        window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
        };
    }, [callback]);
}
