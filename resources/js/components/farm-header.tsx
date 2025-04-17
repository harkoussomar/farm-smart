import { Link, usePage, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback, memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useCart, useCartUpdates } from '@/hooks/useCart';
import { route } from 'ziggy-js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ModeToggle } from './ui/mode-toggle';

// Define interfaces for type safety
interface User {
    name: string;
}

interface Auth {
    user: User | null;
}

const FarmHeader = () => {
    // Type the props from usePage
    const { auth } = usePage().props as unknown as { auth: Auth };
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Get cart items directly from useCart hook
    const cart = useCart();
    const [cartCount, setCartCount] = useState(cart.items.length);

    // Update the cart count when the cart changes
    const updateCartCount = useCallback(() => {
        setCartCount(cart.items.length);
    }, [cart]);

    // Listen for cart updates using the custom event listener
    useCartUpdates(updateCartCount);

    // Also check for changes directly on cart.items
    useEffect(() => {
        // Initial setup
        setCartCount(cart.items.length);
    }, [cart.items]);

    // Detect scroll for header animation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Create a form instance for logout
    const form = useForm({});

    // Navigation items for main nav and mobile menu
    const mainNavItems = [
        { name: 'Dashboard', href: '/farmer/dashboard' },
        { name: 'Farm Profile', href: '/farmer/farm-profile' },
        { name: 'Farm Visualization', href: '/farmer/farm-visualization' },
        { name: 'Products', href: '/farmer/products' },
        { name: 'Crops', href: '/farmer/crops' },
    ];

    // Function to handle logout
    const handleLogout = () => {
        // Clear cart data before logging out
        useCart.getState().clearCart();

        // Use Inertia's form submission instead of direct form submission
        form.post(route('farmer.logout'), {
            onSuccess: () => {
                // This will automatically redirect to farmer.login page
                // as defined in the controller
            }
        });
    };

    // User menu items for mobile menu
    const userMenuItems = [
        { name: 'Profile', href: '/farmer/profile' },
        { name: 'Farm Information', href: '/farmer/farm-profile' },
        { name: 'Farm Visualization', href: '/farmer/farm-visualization' },
        { name: 'Crops', href: '/farmer/crops' },
        { name: 'Logout', onClick: handleLogout, isLogout: true },
    ];

    return (
        <header
            className={`bg-card border-border sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'bg-card/90 shadow-sm backdrop-blur-md' : ''
                }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Left side: Logo and Navigation */}
                <div className="flex items-center">
                    {/* Mobile menu toggle */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </Button>
                    {/* Logo */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="mr-4 md:mr-8">
                        <Link href="/farmer/dashboard" className="text-primary text-xl font-bold">
                            FarmSmart
                        </Link>
                    </motion.div>
                </div>

                {/* Center: Desktop navigation */}
                <nav className="hidden md:flex items-center space-x-2 lg:space-x-6 overflow-x-auto">
                    {mainNavItems.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                            <Link
                                href={item.href}
                                className={`text-muted-foreground hover:text-foreground group relative text-sm font-medium transition-colors whitespace-nowrap ${url === item.href ? 'text-foreground font-semibold' : ''
                                    }`}
                            >
                                {item.name}
                                <span
                                    className={`bg-primary absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${url === item.href ? 'scale-x-100' : ''
                                        }`}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Right side: Cart, Theme Toggle, User Menu */}
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                    {/* Cart button */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Link href="/farmer/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ring-offset-background hover:ring-ring text-muted-foreground hover:text-foreground group relative cursor-pointer rounded-full transition-all duration-300 hover:ring-2 hover:ring-offset-2"
                            >
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
                                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                                >
                                    <circle cx="8" cy="21" r="1" />
                                    <circle cx="19" cy="21" r="1" />
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                </svg>
                                <motion.span
                                    className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.7 }}
                                    key={cartCount}
                                >
                                    {cartCount}
                                </motion.span>
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <ModeToggle />
                    </motion.div>

                    {/* User dropdown */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <DropdownMenu onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ring-offset-background hover:ring-ring text-muted-foreground hover:text-foreground group relative cursor-pointer rounded-full transition-all duration-300 hover:ring-2 hover:ring-offset-2"
                                >
                                    <Avatar>
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-accent text-accent-foreground">
                                            {auth.user?.name
                                                ?.split(' ')
                                                ?.map((n: string) => n[0])
                                                .join('') ?? ''}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border" asChild>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <DropdownMenuLabel className='text-center bg-secondary'>Hello, {auth.user?.name ?? 'User'}</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-border" />
                                            <Link
                                                href="/farmer/profile"
                                                className="hover:bg-accent hover:text-accent-foreground group flex cursor-pointer items-center"
                                            >
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileHover={{ width: 2 }}
                                                    className="bg-primary mr-2 h-4 overflow-hidden rounded-full"
                                                />
                                                Profile
                                            </Link>

                                            <DropdownMenuSeparator className="bg-border" />
                                            <DropdownMenuItem asChild>
                                                <button
                                                    onClick={handleLogout}
                                                    className="hover:bg-destructive hover:text-destructive-foreground group w-full cursor-pointer text-left transition-colors duration-200"
                                                >
                                                    Logout
                                                </button>
                                            </DropdownMenuItem>
                                        </motion.div>
                                    </DropdownMenuContent>
                                )}
                            </AnimatePresence>
                        </DropdownMenu>
                    </motion.div>
                </div>
            </div>
            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ duration: 0.3 }}
                        className="bg-background fixed inset-0 z-50 flex flex-col"
                    >
                        <div className="flex justify-end p-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
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
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </Button>
                        </div>
                        <nav className="mt-10 flex flex-col items-center gap-6">
                            {mainNavItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`text-lg font-medium ${url === item.href ? 'text-foreground font-semibold' : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="border-border my-4 w-full border-t" />
                            {userMenuItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.1 * (index + mainNavItems.length),
                                    }}
                                >
                                    {item.isLogout ? (
                                        <button
                                            className="text-destructive text-lg font-medium"
                                            onClick={(e) => {
                                                setIsMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                        >
                                            {item.name}
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`text-lg font-medium ${url === item.href ? 'text-foreground font-semibold' : ''}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

// Export with memo to prevent unnecessary rerenders
export default memo(FarmHeader);
