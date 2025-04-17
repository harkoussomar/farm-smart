import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, ChevronRight, CreditCard } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface OrderItem {
    id: number;
    order_number: string;
    status: string;
    total_amount: number | string;
    created_at: string;
}

interface RecentOrdersSectionProps {
    orders: OrderItem[];
}

const RecentOrdersSection = ({ orders }: RecentOrdersSectionProps) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Recent Orders</h2>
                <Button variant="outline" asChild size="sm" className="group">
                    <a href="/farmer/orders" className="flex items-center gap-2">
                        View All Orders
                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </a>
                </Button>
            </div>

            <Card className='p-0'>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Order Number</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Date</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Status</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Total</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        className="hover:bg-muted/30 border-b transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                    >
                                        <td className="p-4 text-sm">{order.order_number}</td>
                                        <td className="p-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4 text-sm font-medium">${typeof order.total_amount === 'string'
                                            ? parseFloat(order.total_amount).toFixed(2)
                                            : order.total_amount.toFixed(2)}</td>
                                        <td className="p-4 text-sm">
                                            <Button variant="ghost" size="sm" asChild className="group">
                                                <a href={`/farmer/orders/${order.id}`} className="flex items-center gap-1">
                                                    View
                                                    <ChevronRight
                                                        size={14}
                                                        className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                                                    />
                                                </a>
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-muted-foreground mb-6 text-center"
                        >
                            <CreditCard
                                size={48}
                                className="mx-auto mb-4 opacity-50"
                            />
                            <p className="text-lg">You have no orders yet</p>
                            <p className="text-sm">Start browsing our product catalog</p>
                        </motion.div>
                        <Button asChild className="group">
                            <a href="/farmer/products" className="flex items-center gap-2">
                                Browse Products
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </a>
                        </Button>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default RecentOrdersSection;