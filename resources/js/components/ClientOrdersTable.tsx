import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from './ui/table';
import { Card } from './ui/card';
import { CreditCard } from 'lucide-react';

// Status badge component similar to existing one in dashboard
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export interface ClientOrder {
    id: number;
    order_number: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    created_at: string;
    delivery_date?: string;
    status: string;
    total_amount: number;
    items: {
        id: number;
        crop_id: number;
        crop_name: string;
        quantity: number;
        price: number;
    }[];
}

interface ClientOrdersTableProps {
    orders: ClientOrder[];
    title?: string;
    showViewAll?: boolean;
    viewAllLink?: string;
    emptyStateMessage?: string;
}

const ClientOrdersTable: React.FC<ClientOrdersTableProps> = ({
    orders,
    title = "Client Orders",
    showViewAll = true,
    viewAllLink = "/farmer/orders",
    emptyStateMessage = "You have no client orders yet"
}) => {
    return (
        <div>
            {title && (
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {showViewAll && (
                        <Button variant="outline" asChild size="sm" className="group">
                            <a href={viewAllLink} className="flex items-center gap-2">
                                View All Orders
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform group-hover:translate-x-1"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </motion.svg>
                            </a>
                        </Button>
                    )}
                </div>
            )}

            <Card className='p-0'>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 border-b">
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Order Number</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Client</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Date</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Delivery</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Status</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Total</TableHead>
                                    <TableHead className="text-muted-foreground h-12 px-4 text-left text-sm font-medium">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        className="hover:bg-muted/30 border-b transition-colors"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                    >
                                        <TableCell className="p-4 text-sm">{order.order_number}</TableCell>
                                        <TableCell className="p-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.client_name}</span>
                                                <span className="text-muted-foreground text-xs">{order.client_email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="p-4 text-sm">
                                            {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Not scheduled'}
                                        </TableCell>
                                        <TableCell className="p-4 text-sm">
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell className="p-4 text-sm font-medium">
                                            ${typeof order.total_amount === 'string'
                                                ? parseFloat(order.total_amount).toFixed(2)
                                                : order.total_amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="p-4 text-sm">
                                            <Button variant="ghost" size="sm" asChild className="group">
                                                <a href={`/farmer/crops?tab=orders&order=${order.id}`} className="flex items-center gap-1">
                                                    View
                                                    <motion.svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                                                    >
                                                        <path d="m9 18 6-6-6-6" />
                                                    </motion.svg>
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
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
                                strokeWidth={2}
                            />
                            <p className="text-lg">{emptyStateMessage}</p>
                        </motion.div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ClientOrdersTable;