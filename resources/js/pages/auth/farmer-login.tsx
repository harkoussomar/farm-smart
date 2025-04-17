import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const FarmerLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        // Show welcome message for 3 seconds before fading out
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post('/farmer/login', {
            onSuccess: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    // Animation variants
    const pageAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.6 } },
    };

    const cardAnimation = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.8 } },
    };

    const formItemAnimation = {
        initial: { x: -20, opacity: 0 },
        animate: (i) => ({
            x: 0,
            opacity: 1,
            transition: { delay: 0.5 + i * 0.1, duration: 0.5 },
        }),
    };

    const buttonAnimation = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { delay: 0.8, type: 'spring', stiffness: 200 } },
        whileHover: { scale: 1.05, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 },
    };

    const welcomeAnimation = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.8, type: 'spring', stiffness: 200 } },
        exit: { scale: 1.1, opacity: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            className="from-background to-secondary/20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b px-4 py-12"
            variants={pageAnimation}
            initial="initial"
            animate="animate"
        >
            <AnimatePresence mode="wait">
                {showWelcome ? (
                    <motion.div
                        key="welcome"
                        className="absolute z-20 flex flex-col items-center justify-center text-center"
                        variants={welcomeAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <motion.div
                            className="mb-6 flex justify-center"
                            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1.2, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <Leaf size={80} className="text-primary" />
                        </motion.div>
                        <motion.h1
                            className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent mb-4"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Welcome, Farmer!
                        </motion.h1>
                        <motion.p
                            className="text-foreground/80 text-xl max-w-md"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            We're glad to have you back. Let's grow together!
                        </motion.p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login-form"
                        className="relative z-10 w-full max-w-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="mb-8 text-center"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="mb-4 flex justify-center"
                                initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <Leaf size={60} className="text-primary" />
                            </motion.div>
                            <motion.h1
                                className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                Farmer Login
                            </motion.h1>
                            <motion.p
                                className="text-muted-foreground mt-2 text-sm"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Welcome back! Access your farming dashboard
                            </motion.p>
                        </motion.div>

                        <motion.div variants={cardAnimation} initial="initial" animate="animate">
                            <Card className="bg-card/40 border-primary/10 shadow-primary/5 p-8 shadow-lg backdrop-blur-xs">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={0}>
                                        <Label htmlFor="email" className="text-foreground/80 font-medium">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                            autoFocus
                                            className="border-border/30 focus:border-primary focus:ring-primary/30"
                                        />
                                        {errors.email && <InputError message={errors.email} />}
                                    </motion.div>

                                    <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={1}>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-foreground/80 font-medium">
                                                Password
                                            </Label>
                                            <motion.a
                                                href="/farmer/forgot-password"
                                                className="text-primary text-sm hover:underline"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                Forgot password?
                                            </motion.a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            placeholder="Enter your password"
                                            className="border-border/30 focus:border-primary focus:ring-primary/30"
                                        />
                                        {errors.password && <InputError message={errors.password} />}
                                    </motion.div>

                                    <motion.div
                                        className="flex items-center space-x-2"
                                        variants={formItemAnimation}
                                        initial="initial"
                                        animate="animate"
                                        custom={2}
                                    >
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', checked)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <Label htmlFor="remember" className="text-foreground/80 text-sm">
                                            Remember me
                                        </Label>
                                    </motion.div>

                                    <motion.div variants={buttonAnimation} initial="initial" animate="animate" whileHover="whileHover" whileTap="whileTap">
                                        <Button
                                            type="submit"
                                            className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                                            disabled={processing || isLoading}
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    className="mr-2"
                                                >
                                                    <Loader size={16} />
                                                </motion.div>
                                            ) : null}
                                            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        className="mt-6 text-center text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        <span className="text-muted-foreground">Don't have an account? </span>
                                        <motion.a href="/farmer/register" className="text-primary font-medium hover:underline" whileHover={{ scale: 1.05 }}>
                                            Register
                                        </motion.a>
                                    </motion.div>
                                </form>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FarmerLogin;
