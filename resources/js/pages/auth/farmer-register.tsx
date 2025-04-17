import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Leaf, Loader, Sprout } from 'lucide-react';
import { useState } from 'react';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const FarmerRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        post('/farmer/register', {
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
        animate: { scale: 1, opacity: 1, transition: { delay: 1.1, type: 'spring', stiffness: 200 } },
        whileHover: { scale: 1.05, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 },
    };


    return (
        <motion.div
            className="from-background to-secondary/20 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b px-4 py-12"
            variants={pageAnimation}
            initial="initial"
            animate="animate"
        >
            <div className="relative z-10 w-full max-w-md">
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
                        <Leaf size={48} className="text-primary" />
                    </motion.div>
                    <motion.h1
                        className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Farmer Registration
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground mt-2 text-sm"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Join our community and start growing your future
                    </motion.p>
                </motion.div>

                <motion.div variants={cardAnimation} initial="initial" animate="animate">
                    <Card className="bg-card/40 border-primary/10 shadow-primary/5 p-8 shadow-lg backdrop-blur-xs">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={0}>
                                <Label htmlFor="name" className="text-foreground/80 font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                    className="border-border/30 focus:border-primary focus:ring-primary/30"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </motion.div>

                            <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={1}>
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
                                    className="border-border/30 focus:border-primary focus:ring-primary/30"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </motion.div>

                            <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={2}>
                                <Label htmlFor="password" className="text-foreground/80 font-medium">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    placeholder="Create a secure password"
                                    className="border-border/30 focus:border-primary focus:ring-primary/30"
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </motion.div>

                            <motion.div className="space-y-2" variants={formItemAnimation} initial="initial" animate="animate" custom={3}>
                                <Label htmlFor="password_confirmation" className="text-foreground/80 font-medium">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="Confirm your password"
                                    className="border-border/30 focus:border-primary focus:ring-primary/30"
                                />
                                {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
                            </motion.div>

                            <motion.div
                                className="flex items-center space-x-2"
                                variants={formItemAnimation}
                                initial="initial"
                                animate="animate"
                                custom={4}
                            >
                                <Checkbox
                                    id="terms"
                                    checked={data.terms}
                                    onCheckedChange={(checked) => setData('terms', checked)}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label htmlFor="terms" className="text-foreground/80 text-sm">
                                    I agree to the Terms of Service and Privacy Policy
                                </Label>
                            </motion.div>
                            {errors.terms && <InputError message={errors.terms} />}

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
                                    {isLoading ? 'Growing Your Account...' : 'Join the Community'}
                                </Button>
                            </motion.div>

                            <motion.div
                                className="mt-6 text-center text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <span className="text-muted-foreground">Already have an account? </span>
                                <motion.a href="/farmer/login" className="text-primary font-medium hover:underline" whileHover={{ scale: 1.05 }}>
                                    Log in
                                </motion.a>
                            </motion.div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FarmerRegister;
