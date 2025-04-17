import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

interface OrderStatusChartProps {
    data: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
    // Calculate the total
    const total = Object.values(data).reduce((acc, value) => acc + value, 0);

    // Status colors
    const statusColors = {
        pending: '#F59E0B',      // Amber 500
        processing: '#3B82F6',   // Blue 500
        shipped: '#10B981',      // Emerald 500
        delivered: '#059669',    // Green 600
        cancelled: '#EF4444'     // Red 500
    };

    // Create data array for rendering
    const statusData = [
        { name: 'Pending', value: data.pending, color: statusColors.pending },
        { name: 'Processing', value: data.processing, color: statusColors.processing },
        { name: 'Shipped', value: data.shipped, color: statusColors.shipped },
        { name: 'Delivered', value: data.delivered, color: statusColors.delivered },
        { name: 'Cancelled', value: data.cancelled, color: statusColors.cancelled }
    ].filter(item => item.value > 0);

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Order Status Breakdown</h3>
                    <p className="text-muted-foreground text-sm">Status distribution of your orders</p>
                </div>

                {total > 0 ? (
                    <>
                        <div className="h-40 flex items-end justify-between gap-2 mb-4">
                            {statusData.map((status, index) => {
                                const percentage = Math.round((status.value / total) * 100);
                                const height = `${Math.max(percentage, 5)}%`;

                                return (
                                    <motion.div
                                        key={status.name}
                                        className="flex-1 flex flex-col items-center"
                                        initial={{ height: 0 }}
                                        animate={{ height }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="relative w-full flex-1 min-h-[10px] rounded-t-sm" style={{ backgroundColor: status.color }}>
                                            <motion.div
                                                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-foreground py-1 px-2 rounded shadow-sm text-xs font-medium"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 + (index * 0.1) }}
                                            >
                                                {percentage}%
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {statusData.map((status, index) => (
                                <motion.div
                                    key={status.name}
                                    className="flex items-center gap-2 text-sm"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + (index * 0.1) }}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                                    <div className="flex items-center justify-between w-full">
                                        <span>{status.name}</span>
                                        <span className="font-medium">{status.value}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground opacity-40 mb-2"
                        >
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <path d="M3 6h18" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <p className="text-muted-foreground">No order data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderStatusChart;