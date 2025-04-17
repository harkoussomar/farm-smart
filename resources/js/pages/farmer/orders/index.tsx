import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../../components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import FarmerLayout from '../../../layouts/FarmerLayout';
import { Card, CardContent } from '../../../components/ui/card';
import {
    Filter,
    Search,
    X,
    SortAsc,
    SortDesc,
    ShoppingBag,
    Clock,
    DollarSign,
    ArrowRight
} from 'lucide-react';

interface OrdersProps {
    orders: {
        data: Array<{
            id: number;
            order_number: string;
            status: string;
            total_amount: number;
            created_at: string;
            payment_status: string;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters?: {
        status?: string;
        payment_status?: string;
        search?: string;
    };
}

// Custom animated components
const AnimatedCard = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}
    >
        {children}
    </motion.div>
);

const StatusBadge = ({ status, className = '' }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)} ${className}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.span>
    );
};

const PaymentStatusBadge = ({ status, className = '' }) => {
    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(status)} ${className}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.span>
    );
};

const Orders = ({ orders, filters }: OrdersProps) => {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(filters?.payment_status || 'all');
    const [pageLoaded, setPageLoaded] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Set a flag when the page has loaded to trigger animations
        setPageLoaded(true);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const generatePaginationLink = (page: number) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());

        if (statusFilter !== 'all') {
            params.append('status', statusFilter);
        }

        if (paymentFilter !== 'all') {
            params.append('payment_status', paymentFilter);
        }

        if (searchTerm) {
            params.append('search', searchTerm);
        }

        return `/farmer/orders?${params.toString()}`;
    };

    const applyFilters = () => {
        router.get('/farmer/orders', {
            search: searchTerm,
            status: statusFilter,
            payment_status: paymentFilter,
        }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPaymentFilter('all');
        router.get('/farmer/orders', {}, { preserveState: true });
    };

    return (
        <FarmerLayout>
            <Head title="Order History" />

            <div className="container mx-auto px-6 py-8 min-h-199">
                <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <motion.h1
                        className="text-3xl font-bold"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Order History
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        View and manage your past orders
                    </motion.p>
                </motion.div>

                {/* Search and Filter Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search orders by order number..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyFilters();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    setTimeout(() => {
                                        router.get('/farmer/orders', {
                                            search: searchTerm,
                                            status: value,
                                            payment_status: paymentFilter,
                                        }, { preserveState: true });
                                    }, 0);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Order Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <Card className="mt-2">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Advanced Filters</h3>
                                    <Button
                                        variant="ghost"
                                        onClick={resetFilters}
                                        className="h-8 text-sm"
                                    >
                                        Reset
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Payment Status</label>
                                        <Select
                                            value={paymentFilter}
                                            onValueChange={setPaymentFilter}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Payment Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="failed">Failed</SelectItem>
                                                <SelectItem value="refunded">Refunded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Date Range</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                placeholder="From"
                                                className="w-full"
                                            />
                                            <Input
                                                type="date"
                                                placeholder="To"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={applyFilters} className="w-full md:w-auto">
                                        Apply Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {orders.data.length > 0 ? (
                    <AnimatedCard delay={0.4}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {orders.data.map((order, index) => (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                                className="hover:bg-muted/30 border-b transition-colors"
                                            >
                                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={order.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <PaymentStatusBadge status={order.payment_status} />
                                                </TableCell>
                                                <TableCell>
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 + 0.1 * index }}
                                                        className="font-medium"
                                                    >
                                                        ${order.total_amount.toFixed(2)}
                                                    </motion.span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button asChild size="sm" variant="outline" className="group">
                                                            <Link href={`/farmer/orders/${order.id}`} className="flex items-center gap-1">
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
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="ghost" asChild className="group relative overflow-hidden">
                                                            <Link href={`/farmer/orders/${order.id}/reorder`} className="flex items-center gap-1">
                                                                Reorder
                                                                <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>

                        {orders.meta.last_page > 1 && (
                            <motion.div
                                className="border-t p-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <Pagination>
                                    <PaginationContent>
                                        {orders.meta.current_page > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious href={generatePaginationLink(orders.meta.current_page - 1)} />
                                            </PaginationItem>
                                        )}

                                        {Array.from({ length: orders.meta.last_page }).map((_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href={generatePaginationLink(i + 1)}
                                                    isActive={i + 1 === orders.meta.current_page}
                                                    className="transition-all duration-300 hover:scale-110"
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {orders.meta.current_page < orders.meta.last_page && (
                                            <PaginationItem>
                                                <PaginationNext href={generatePaginationLink(orders.meta.current_page + 1)} />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </motion.div>
                        )}
                    </AnimatedCard>
                ) : (
                    <AnimatedCard delay={0.4} className="p-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <ShoppingBag
                                size={64}
                                className="text-primary/50 mb-6"
                                strokeWidth={2}
                            />
                            <h2 className="mb-4 text-xl font-medium">No orders found</h2>
                            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                            <Button asChild className="group relative overflow-hidden">
                                <Link href="/farmer/products" className="flex items-center gap-2">
                                    <span className="relative z-10">Browse Products</span>
                                    <ArrowRight
                                        className="relative z-10 transition-transform group-hover:translate-x-1"
                                        size={16}
                                    />
                                    <div className="bg-primary/10 absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                                </Link>
                            </Button>
                        </motion.div>
                    </AnimatedCard>
                )}

                {/* Order Stats Section */}
                {orders.data.length > 0 && (
                    <motion.div
                        className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <AnimatedCard delay={1.0} className="relative overflow-hidden p-6">
                            <div className="flex items-start justify-between">
                                <div className="z-10">
                                    <h3 className="text-muted-foreground text-sm font-medium">Total Orders</h3>
                                    <p className="text-3xl font-bold">{orders.meta.total}</p>
                                </div>
                                <div className="text-primary bg-primary/10 rounded-full p-2">
                                    <ShoppingBag size={24} />
                                </div>
                            </div>
                            <div className="bg-primary absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10" />
                        </AnimatedCard>

                        <AnimatedCard delay={1.1} className="relative overflow-hidden p-6">
                            <div className="flex items-start justify-between">
                                <div className="z-10">
                                    <h3 className="text-muted-foreground text-sm font-medium">Recent Activity</h3>
                                    <p className="text-3xl font-bold">{formatDate(orders.data[0]?.created_at || new Date().toISOString())}</p>
                                </div>
                                <div className="text-primary bg-primary/10 rounded-full p-2">
                                    <Clock size={24} />
                                </div>
                            </div>
                            <div className="bg-chart-4 absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10" />
                        </AnimatedCard>

                        <AnimatedCard delay={1.2} className="relative overflow-hidden p-6">
                            <div className="flex items-start justify-between">
                                <div className="z-10">
                                    <h3 className="text-muted-foreground text-sm font-medium">Total Spent</h3>
                                    <p className="text-3xl font-bold">
                                        ${orders.data.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-primary bg-primary/10 rounded-full p-2">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <div className="bg-chart-1 absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10" />
                        </AnimatedCard>
                    </motion.div>
                )}
            </div>
        </FarmerLayout>
    );
};

export default Orders;
