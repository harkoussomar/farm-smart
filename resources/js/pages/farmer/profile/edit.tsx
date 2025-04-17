import { Head, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface EditProps {
    user: {
        name: string;
        email: string;
    };
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({ user, mustVerifyEmail, status }: EditProps) {
    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    // State for showing delete confirmation
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('farmer.profile.update'), {
            onSuccess: () => {
                toast.success('Profile updated successfully');
            },
        });
    };

    // Function to handle account deletion
    const handleDeleteAccount = () => {
        if (!password) {
            setPasswordError('Password is required to confirm account deletion');
            return;
        }

        setIsDeletingAccount(true);
        setPasswordError('');

        // Actual deletion logic using Inertia's router
        router.delete(route('farmer.profile.destroy'), {
            data: { password },
            onSuccess: () => {
                toast.success('Your account has been deleted successfully');
                // Redirect to home page after successful deletion
                window.location.href = route('welcome');
            },
            onError: (errors) => {
                if (errors.password) {
                    setPasswordError(errors.password);
                } else {
                    toast.error('Failed to delete account. Please try again later.');
                    console.error('Delete account errors:', errors);
                }
                setIsDeletingAccount(false);
            },
            onFinish: () => {
                setIsDeletingAccount(false);
            }
        });
    };

    return (
        <FarmerLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</CardTitle>
                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                    Update your account's profile information and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                        {errors.name && <div className="mt-2 text-sm text-red-600">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                        />
                                        {errors.email && <div className="mt-2 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    {mustVerifyEmail && status === 'verification-link-sent' && (
                                        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}

                                    <CardFooter className="px-0 pt-4">
                                        <Button disabled={processing}>Save</Button>
                                    </CardFooter>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Account</CardTitle>
                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!showDeleteConfirmation ? (
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowDeleteConfirmation(true)}
                                            type="button"
                                        >
                                            Delete Account
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 border rounded-md p-4 bg-red-50 dark:bg-red-950/20">
                                        <div className="text-sm font-medium">
                                            Are you sure you want to delete your account? This action cannot be undone.
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password to confirm"
                                                    disabled={isDeletingAccount}
                                                />
                                                {passwordError && (
                                                    <div className="mt-2 text-sm text-red-600">{passwordError}</div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowDeleteConfirmation(false);
                                                        setPassword('');
                                                        setPasswordError('');
                                                    }}
                                                    type="button"
                                                    disabled={isDeletingAccount}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDeleteAccount}
                                                    type="button"
                                                    disabled={isDeletingAccount}
                                                >
                                                    {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </FarmerLayout>
    );
}