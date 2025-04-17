import FarmFooter from '@/components/farm-footer';
import FarmHeader from '@/components/farm-header';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo } from 'react';
import { usePage } from '@inertiajs/react';

interface FarmerLayoutProps {
    children: React.ReactNode;
}

// Memoize the header and footer components to prevent unnecessary rerenders
const MemoizedHeader = memo(FarmHeader);
const MemoizedFooter = memo(FarmFooter);

const FarmerLayout = ({ children }: FarmerLayoutProps) => {
    // Get the current page URL to use as a key for AnimatePresence
    const { url } = usePage();

    return (
        <div className="bg-background min-h-screen">
            <MemoizedHeader />

            <main className="bg-background text-foreground">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={url}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <MemoizedFooter />
        </div>
    );
};

export default FarmerLayout;
