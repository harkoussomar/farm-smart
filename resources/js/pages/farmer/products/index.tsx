import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronRight, Package, Search, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define placeholder image as a constant instead of importing
const placeholderProduct = '/img/placeholder-product.png';

// Product Badge Component
const ProductTypeBadge = ({ type }) => {
    const colors = {
        Seeds: { bg: 'bg-green-100', text: 'text-green-800' },
        Fertilizers: { bg: 'bg-blue-100', text: 'text-blue-800' },
        Pesticides: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        Tools: { bg: 'bg-purple-100', text: 'text-purple-800' },
        Equipment: { bg: 'bg-red-100', text: 'text-red-800' },
        default: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };

    const color = colors[type] || colors.default;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${color.bg} ${color.text}`}
        >
            {type}
        </motion.div>
    );
};

// Animated Card Component
const AnimatedProductCard = ({ product, index }) => {
    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2 },
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            className="h-full"
        >
            <Card className="flex flex-col h-full p-0 overflow-hidden border">
                <div className="relative overflow-hidden h-36">
                    <motion.img
                        src={product.image_path || placeholderProduct}
                        alt={product.name || 'Product'}
                        className="object-cover w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                            e.currentTarget.onerror = null; // Prevent infinite loop
                            e.currentTarget.src = placeholderProduct;
                        }}
                    />
                    <ProductTypeBadge type={product.product_type?.name || 'Other'} />
                </div>
                <div className="flex flex-col flex-1 p-3">
                    <motion.h3
                        className="font-semibold truncate text-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                        {product.name || 'Unnamed Product'}
                    </motion.h3>
                    <motion.p
                        className="mb-2 text-xs text-muted-foreground line-clamp-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        {product.description || 'No description available'}
                    </motion.p>

                    <motion.div
                        className="flex justify-between mb-2 text-xs text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span className="truncate">{product.product_type?.name || 'Other'}</span>
                        </div>
                    </motion.div>

                    <div className="flex items-center justify-between mt-auto">
                        <motion.span
                            className="text-sm font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        >
                            ${parseFloat(product.price || 0).toFixed(2)}
                        </motion.span>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        >
                            <Button asChild size="sm" variant="outline" className="px-2 text-xs group h-7">
                                <Link href={`/farmer/products/${product.id}`} className="flex items-center gap-1">
                                    View
                                    <ChevronRight className="w-3 h-3 transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

// Empty State Component
const EmptyProductsState = ({ resetFilters }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 text-center col-span-full"
        >
            <Package className="mx-auto mb-2 text-muted-foreground/60" size={48} strokeWidth={1.5} />
            <h3 className="mb-2 text-lg font-medium">No products found</h3>
            <p className="max-w-md mb-6 text-muted-foreground">
                We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button onClick={resetFilters} className="gap-2">
                <X className="w-4 h-4" /> Reset Filters
            </Button>
        </motion.div>
    );
};

interface ProductsProps {
    products: Array<{
        id: number;
        name: string;
        description: string;
        price: number;
        image_path: string;
        product_type: {
            id: number;
            name: string;
        };
    }>;
    productTypes: Array<{
        id: number;
        name: string;
    }>;
    filters: {
        search?: string;
        type?: string;
        sort?: string;
    };
    recentOrders?: Array<{
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        created_at: string;
        payment_status: string;
    }>;
    orderFilters?: {
        orderSearch?: string;
        orderStatus?: string;
        paymentStatus?: string;
    };
}

// Status Badge Component for Orders
const StatusBadge = ({ status, className = '' }) => {
    // Handle null or undefined status
    if (!status) {
        status = 'unknown';
    }

    const getStatusColor = (statusValue: string) => {
        switch (statusValue) {
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

// Payment Status Badge Component for Orders
const PaymentStatusBadge = ({ status, className = '' }) => {
    // Handle null or undefined status
    if (!status) {
        status = 'pending';
    }

    const getPaymentStatusColor = (statusValue: string) => {
        switch (statusValue) {
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

export default function Products({ products = [], productTypes = [], filters = {}, recentOrders = [], orderFilters = {} }: ProductsProps) {
    // Create safe initial filters
    const initialFilters = filters || {};

    // Set up state with careful null checks
    const [searchTerm, setSearchTerm] = useState(typeof initialFilters.search === 'string' ? initialFilters.search : '');
    const [typeFilter, setTypeFilter] = useState(typeof initialFilters.type === 'string' ? initialFilters.type : 'all');
    const [sortBy, setSortBy] = useState(typeof initialFilters.sort === 'string' ? initialFilters.sort : 'name_asc');
    const [allProducts, setAllProducts] = useState(Array.isArray(products) ? products : []);
    const [filteredProducts, setFilteredProducts] = useState(Array.isArray(products) ? products : []);

    // Order filters with careful null checks
    const safeOrderFilters = orderFilters || {};
    const [searchOrderTerm, setSearchOrderTerm] = useState(typeof safeOrderFilters.orderSearch === 'string' ? safeOrderFilters.orderSearch : '');
    const [orderStatusFilter, setOrderStatusFilter] = useState(
        typeof safeOrderFilters.orderStatus === 'string' ? safeOrderFilters.orderStatus : 'all',
    );
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(
        typeof safeOrderFilters.paymentStatus === 'string' ? safeOrderFilters.paymentStatus : 'all',
    );
    const [allOrders, setAllOrders] = useState(Array.isArray(recentOrders) ? recentOrders : []);
    const [filteredOrders, setFilteredOrders] = useState(Array.isArray(recentOrders) ? recentOrders : []);

    // Active tab state
    const [activeTab, setActiveTab] = useState('products');

    // Handle filter changes for products
    const handleFilterChange = (key: string, value: string) => {
        try {
            if (key === 'search') setSearchTerm(value || '');
            if (key === 'type') setTypeFilter(value || 'all');
            if (key === 'sort') setSortBy(value || 'name_asc');

            // Apply filters client-side
            applyClientSideFilters();
        } catch (error) {
            console.error('Error in handleFilterChange:', error);
        }
    };

    // Apply client-side filters for products
    const applyClientSideFilters = () => {
        try {
            let filtered = [...allProducts];

            // Apply search filter
            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                filtered = filtered.filter(
                    (product) => (product?.name || '').toLowerCase().includes(search) || (product?.description || '').toLowerCase().includes(search),
                );
            }

            // Apply type filter
            if (typeFilter !== 'all') {
                filtered = filtered.filter((product) => product?.product_type?.id.toString() === typeFilter);
            }

            // Apply sorting
            filtered.sort((a, b) => {
                if (!a || !b) return 0;

                switch (sortBy) {
                    case 'name_asc':
                        return (a.name || '').localeCompare(b.name || '');
                    case 'name_desc':
                        return (b.name || '').localeCompare(a.name || '');
                    case 'price_asc':
                        return parseFloat(a.price || 0) - parseFloat(b.price || 0);
                    case 'price_desc':
                        return parseFloat(b.price || 0) - parseFloat(a.price || 0);
                    case 'date_asc':
                        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                    case 'date_desc':
                        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                    default:
                        return 0;
                }
            });

            setFilteredProducts(filtered);
        } catch (error) {
            console.error('Error applying client-side filters:', error);
            setFilteredProducts(allProducts);
        }
    };

    // Clear specific filter
    const clearFilter = (key: string) => {
        try {
            if (key === 'search') setSearchTerm('');
            if (key === 'type') setTypeFilter('all');
            if (key === 'sort') setSortBy('name_asc');

            // Apply updated filters
            setTimeout(() => applyClientSideFilters(), 0);
        } catch (error) {
            console.error('Error in clearFilter:', error);
        }
    };

    // Reset all product filters
    const resetFilters = () => {
        try {
            setSearchTerm('');
            setTypeFilter('all');
            setSortBy('name_asc');

            // Reset to all products
            setFilteredProducts(allProducts);
        } catch (error) {
            console.error('Error in resetFilters:', error);
        }
    };

    // Handle order filter changes
    const handleOrderFilterChange = (key: string, value: string) => {
        try {
            if (key === 'orderSearch') setSearchOrderTerm(value || '');
            if (key === 'orderStatus') setOrderStatusFilter(value || 'all');
            if (key === 'paymentStatus') setPaymentStatusFilter(value || 'all');

            // Apply filters client-side
            applyClientSideOrderFilters();
        } catch (error) {
            console.error('Error in handleOrderFilterChange:', error);
        }
    };

    // Apply client-side filters for orders
    const applyClientSideOrderFilters = () => {
        try {
            let filtered = [...allOrders];

            // Apply search filter
            if (searchOrderTerm) {
                const search = searchOrderTerm.toLowerCase();
                filtered = filtered.filter((order) => (order?.order_number || '').toLowerCase().includes(search));
            }

            // Apply status filter
            if (orderStatusFilter !== 'all') {
                filtered = filtered.filter((order) => (order?.status || '').toLowerCase() === orderStatusFilter.toLowerCase());
            }

            // Apply payment status filter
            if (paymentStatusFilter !== 'all') {
                filtered = filtered.filter((order) => (order?.payment_status || '').toLowerCase() === paymentStatusFilter.toLowerCase());
            }

            setFilteredOrders(filtered);
        } catch (error) {
            console.error('Error applying client-side order filters:', error);
            setFilteredOrders(allOrders);
        }
    };

    // Clear specific order filter
    const clearOrderFilter = (key: string) => {
        try {
            if (key === 'orderSearch') setSearchOrderTerm('');
            if (key === 'orderStatus') setOrderStatusFilter('all');
            if (key === 'paymentStatus') setPaymentStatusFilter('all');

            // Apply updated filters
            setTimeout(() => applyClientSideOrderFilters(), 0);
        } catch (error) {
            console.error('Error in clearOrderFilter:', error);
        }
    };

    // Reset all order filters
    const resetOrderFilters = () => {
        try {
            setSearchOrderTerm('');
            setOrderStatusFilter('all');
            setPaymentStatusFilter('all');

            // Reset to all orders
            setFilteredOrders(allOrders);
        } catch (error) {
            console.error('Error in resetOrderFilters:', error);
        }
    };

    // Get sort label
    const getSortLabel = (sortValue: string): string => {
        if (!sortValue) return 'Sort';

        try {
            const sortOptions = {
                name_asc: 'Name (A-Z)',
                name_desc: 'Name (Z-A)',
                price_asc: 'Price (Low to High)',
                price_desc: 'Price (High to Low)',
                date_asc: 'Date (Oldest)',
                date_desc: 'Date (Newest)',
            };

            return sortOptions[sortValue] || 'Sort';
        } catch (error) {
            console.error('Error in getSortLabel:', error);
            return 'Sort';
        }
    };

    // Format date with additional safety
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString || '';
            }
            return format(date, 'MMM d, yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString || '';
        }
    };

    useEffect(() => {
        // Parse URL parameters for tab
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const tabParam = queryParams.get('tab');

            // Set active tab if specified
            if (tabParam === 'orders') {
                setActiveTab('orders');
            }

            // Initialize product data
            setAllProducts(Array.isArray(products) ? products : []);
            setFilteredProducts(Array.isArray(products) ? products : []);

            // Initialize order data
            setAllOrders(Array.isArray(recentOrders) ? recentOrders : []);
            setFilteredOrders(Array.isArray(recentOrders) ? recentOrders : []);
        } catch (error) {
            console.error('Error in useEffect:', error);
            setFilteredProducts([]);
            setFilteredOrders([]);
        }
    }, [products, recentOrders]);

    // Effect to apply filters whenever filter state changes
    useEffect(() => {
        applyClientSideFilters();
    }, [searchTerm, typeFilter, sortBy]);

    // Effect to apply order filters whenever filter state changes
    useEffect(() => {
        applyClientSideOrderFilters();
    }, [searchOrderTerm, orderStatusFilter, paymentStatusFilter]);

    return (
        <FarmerLayout>
            <Head title="My Products" />

            <div className="container py-6 mx-auto">
                <div className="flex flex-col gap-2 px-6 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Farm Requirements Management</h1>
                        <p className="text-muted-foreground">System for tracking and managing essential farm needs.</p>
                    </div>
                </div>

                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full px-5">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="products" className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>Products Store</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Purchase Order Tracking</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="space-y-4">
                        <Card className="py-2 bg-transparent border-none">
                            <CardContent className="p-0">
                                <div className="grid gap-4 mb-6 md:grid-cols-3 lg:grid-cols-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                            <Input
                                                type="search"
                                                placeholder="Search products..."
                                                className="pl-8"
                                                value={searchTerm}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                            />
                                            {searchTerm && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-0 right-0 h-9 w-9"
                                                    onClick={() => clearFilter('search')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Select value={typeFilter} onValueChange={(value) => handleFilterChange('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Product Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                {productTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                                                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                                                <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                                                <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                                                <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                                                <SelectItem value="date_desc">Date (Newest)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {(searchTerm || typeFilter !== 'all' || sortBy !== 'name_asc') && (
                                        <div className="flex items-center md:col-span-3 lg:col-span-1">
                                            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
                                                <X className="w-4 h-4" />
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {filteredProducts.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {filteredProducts.map((product, index) => {
                                            if (!product) return null;
                                            return <AnimatedProductCard key={product.id || `product-${index}`} product={product} index={index} />;
                                        })}
                                    </div>
                                ) : (
                                    <EmptyProductsState resetFilters={resetFilters} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle>Customer Orders</CardTitle>
                                <CardDescription>Track and manage orders from your customers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 mb-6 md:grid-cols-3 lg:grid-cols-4">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                            <Input
                                                type="search"
                                                placeholder="Search orders..."
                                                className="pl-8"
                                                value={searchOrderTerm}
                                                onChange={(e) => handleOrderFilterChange('orderSearch', e.target.value)}
                                            />
                                            {searchOrderTerm && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-0 right-0 h-9 w-9"
                                                    onClick={() => clearOrderFilter('orderSearch')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Select value={orderStatusFilter} onValueChange={(value) => handleOrderFilterChange('orderStatus', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Order Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select
                                            value={paymentStatusFilter}
                                            onValueChange={(value) => handleOrderFilterChange('paymentStatus', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Payment Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Payments</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="refunded">Refunded</SelectItem>
                                                <SelectItem value="failed">Failed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {(searchOrderTerm || orderStatusFilter !== 'all' || paymentStatusFilter !== 'all') && (
                                        <div className="flex items-center md:col-span-3 lg:col-span-1">
                                            <Button variant="outline" size="sm" onClick={resetOrderFilters} className="gap-2">
                                                <X className="w-4 h-4" />
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {filteredOrders.length > 0 ? (
                                    <div className="relative overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Order #</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Payment</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredOrders.map((order) => {
                                                    if (!order) return null;
                                                    return (
                                                        <TableRow key={order.id || Math.random()}>
                                                            <TableCell className="font-medium">{order.order_number || 'N/A'}</TableCell>
                                                            <TableCell>{formatDate(order.created_at || '')}</TableCell>
                                                            <TableCell>
                                                                <StatusBadge status={order.status || 'unknown'} />
                                                            </TableCell>
                                                            <TableCell>
                                                                <PaymentStatusBadge status={order.payment_status || 'unknown'} />
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                ${parseFloat(order.total_amount || 0).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button asChild size="sm" variant="outline">
                                                                    <Link href={`/farmer/orders/${order.id}`}>Details</Link>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <ShoppingBag className="mb-4 text-muted-foreground" size={48} strokeWidth={1.5} />
                                        <h3 className="mb-2 text-lg font-medium">No orders found</h3>
                                        <p className="max-w-md mb-6 text-muted-foreground">
                                            There are no orders matching your current filters. Try adjusting your search criteria.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </FarmerLayout>
    );
}
