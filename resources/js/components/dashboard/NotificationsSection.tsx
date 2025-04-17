import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import NotificationItem from './NotificationItem';
import ActionButton from './ActionButton';
import SectionHeader from './SectionHeader';
import { PlusCircle, AlertTriangle, Settings } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

const NotificationsSection = () => {
    return (
        <>
            <SectionHeader title="Notifications & Quick Actions" className="mt-8" delay={0.55} />
            <div className="grid gap-6 md:grid-cols-3">
                <motion.div
                    className="md:col-span-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="h-full">
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">Notifications</h2>
                            <div className="space-y-4">
                                <NotificationItem
                                    icon={<PlusCircle size={20} />}
                                    color="var(--primary)"
                                    title="Order Shipped"
                                    description="Your order #12345 has been shipped and will arrive in 3-5 business days."
                                    time="2 hours ago"
                                    delay={0.6}
                                />
                                <NotificationItem
                                    icon={<AlertTriangle size={20} />}
                                    color="var(--chart-1)"
                                    title="Price Drop"
                                    description="An item in your wishlist has dropped in price."
                                    time="Yesterday"
                                    delay={0.7}
                                />
                                <NotificationItem
                                    icon={<Settings size={20} />}
                                    color="var(--chart-4)"
                                    title="New Products Available"
                                    description="Check out our latest seed varieties for the upcoming season."
                                    time="3 days ago"
                                    delay={0.8}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                    <Card className="h-full">
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
                            <div className="space-y-3">
                                <ActionButton
                                    href="/farmer/crops/create"
                                    title="List New Crop"
                                    description="Add a new crop to your inventory"
                                    delay={0.65}
                                />
                                <ActionButton href="/farmer/orders" title="Manage Orders" description="View and manage your orders" delay={0.7} />
                                <ActionButton
                                    href="/farmer/farm-profile"
                                    title="Update Farm Profile"
                                    description="Keep your information up to date"
                                    delay={0.75}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <WeatherWidget />
            </div>
        </>
    );
};

export default NotificationsSection;