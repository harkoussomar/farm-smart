import ClientOrdersTable, { ClientOrder } from '@/components/ClientOrdersTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmerLayout from '@/layouts/FarmerLayout';
import { sampleClientOrders } from '@/utils/mockClientData';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, ChevronRight, Clipboard, Filter, Plus, Search, SortAsc, SortDesc, Sprout, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Crop {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    price: number;
    harvest_date: string;
    status: 'available' | 'reserved' | 'sold';
    latitude: number;
    longitude: number;
    address: string;
    image_path: string;
    created_at: string;
    farmer: {
        id: number;
        name: string;
        farm_name: string;
    };
}

interface PageProps {
    myCrops: Crop[];
    nearbyCrops: Crop[];
    mapData: Crop[];
    userLocation: {
        latitude: number;
        longitude: number;
    };
    filters: {
        status?: string;
    };
    auth: {
        user: {
            id: number;
        };
    };
    clientOrders?: ClientOrder[];
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, { bg: string; text: string }> = {
        available: { bg: 'bg-green-100', text: 'text-green-800' },
        reserved: { bg: 'bg-amber-100', text: 'text-amber-800' },
        sold: { bg: 'bg-red-100', text: 'text-red-800' },
        default: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };

    const color = colors[status] || colors.default;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${color.bg} ${color.text}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.div>
    );
};

// Animated Crop Card Component
const AnimatedCropCard = ({ crop, index }: { crop: Crop; index: number }) => {
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
                        src={crop.image_path || '/img/placeholder-product.png'}
                        alt={crop.name}
                        className="object-cover w-full h-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    <StatusBadge status={crop.status} />
                </div>
                <div className="flex flex-col flex-1 p-3">
                    <motion.h3
                        className="font-semibold truncate text-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                        {crop.name}
                    </motion.h3>
                    <motion.p
                        className="mb-2 text-xs text-muted-foreground line-clamp-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        {crop.description}
                    </motion.p>

                    <motion.div
                        className="flex justify-between mb-2 text-xs text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            <span className="truncate">{format(new Date(crop.harvest_date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                            {crop.quantity} {crop.unit}
                        </div>
                    </motion.div>

                    <div className="flex items-center justify-between mt-auto">
                        <motion.span
                            className="text-sm font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        >
                            ${parseFloat(crop.price).toFixed(2)}
                        </motion.span>
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                        >
                            <Button asChild size="sm" variant="outline" className="px-2 text-xs group h-7">
                                <Link href={route('farmer.crops.show', crop.id)} className="flex items-center gap-1">
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
const EmptyCropsState = ({ resetFilters }: { resetFilters: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 text-center col-span-full"
        >
            <Sprout className="mx-auto mb-2 text-muted-foreground/60" size={48} strokeWidth={1.5} />
            <h3 className="mb-2 text-lg font-medium">No crops found</h3>
            <p className="max-w-md mb-6 text-muted-foreground">
                We couldn't find any crops matching your search criteria. Try adjusting your filters or search term.
            </p>
            <Button onClick={resetFilters} className="gap-2">
                <X className="w-4 h-4" /> Reset Filters
            </Button>
        </motion.div>
    );
};

export default function Index({ myCrops, nearbyCrops, mapData, userLocation, filters, auth, clientOrders = [] }: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCrops, setFilteredCrops] = useState<Crop[]>([...myCrops, ...nearbyCrops]);

    // Use sample client orders as they will be fetched from another system later
    const displayClientOrders = clientOrders.length > 0 ? clientOrders : sampleClientOrders;

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>(filters?.status || 'all');
    const [sortBy, setSortBy] = useState('newest');

    // Client orders filter states
    const [searchOrderTerm, setSearchOrderTerm] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderSortBy, setOrderSortBy] = useState('newest');
    const [orders, setOrders] = useState(displayClientOrders);
    const [filteredOrders, setFilteredOrders] = useState(displayClientOrders);

    // Handle URL parameters to show orders tab and specific order
    const [activeTab, setActiveTab] = useState<string>('crops');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null);

    useEffect(() => {
        // Parse URL parameters
        const queryParams = new URLSearchParams(window.location.search);
        const tabParam = queryParams.get('tab');
        const orderParam = queryParams.get('order');

        // Set active tab if specified
        if (tabParam === 'orders') {
            setActiveTab('orders');
        }

        // Set selected order if specified
        if (orderParam) {
            const orderId = parseInt(orderParam, 10);
            setSelectedOrderId(orderId);

            // Find the order in our data
            const order = orders.find((o) => o.id === orderId);
            if (order) {
                setSelectedOrder(order);
            }
        }
    }, [orders]);

    // Clear order filters
    const clearOrderFilters = () => {
        setSearchOrderTerm('');
        setOrderStatusFilter('all');
        setOrderSortBy('newest');
    };

    // Apply order filters
    useEffect(() => {
        let result = [...orders];

        // Apply search
        if (searchOrderTerm) {
            const term = searchOrderTerm.toLowerCase();
            result = result.filter(
                (order) =>
                    order.order_number.toLowerCase().includes(term) ||
                    order.client_name.toLowerCase().includes(term) ||
                    order.client_email.toLowerCase().includes(term),
            );
        }

        // Apply status filter
        if (orderStatusFilter !== 'all') {
            result = result.filter((order) => order.status === orderStatusFilter);
        }

        // Apply sorting
        switch (orderSortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'amount_high':
                result.sort((a, b) => b.total_amount - a.total_amount);
                break;
            case 'amount_low':
                result.sort((a, b) => a.total_amount - b.total_amount);
                break;
        }

        setFilteredOrders(result);
    }, [searchOrderTerm, orderStatusFilter, orderSortBy, orders]);

    // Apply filters and search
    useEffect(() => {
        const allCrops = [...myCrops, ...nearbyCrops];
        let results = [...allCrops];

        // Apply search filter
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            results = results.filter(
                (crop) =>
                    crop.name.toLowerCase().includes(lowercasedTerm) ||
                    crop.description.toLowerCase().includes(lowercasedTerm) ||
                    crop.address.toLowerCase().includes(lowercasedTerm),
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            results = results.filter((crop) => crop.status === statusFilter);
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'oldest':
                results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'price_low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'harvest_date':
                results.sort((a, b) => new Date(a.harvest_date).getTime() - new Date(b.harvest_date).getTime());
                break;
        }

        setFilteredCrops(results);
    }, [myCrops, nearbyCrops, searchTerm, statusFilter, sortBy]);

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSortBy('newest');
    };

    return (
        <FarmerLayout>
            <Head title="Crop Marketplace" />

            <div className="container px-4 py-6 mx-auto">
                <motion.div
                    className="flex flex-wrap items-center justify-between mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Crop Management</h1>

                    <Link href={route('farmer.crops.create')}>
                        <Button className="mt-2 sm:mt-0">
                            <Plus className="w-4 h-4 mr-2" />
                            List New Crop
                        </Button>
                    </Link>
                </motion.div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="crops" className="flex items-center gap-2">
                            <Clipboard className="w-4 h-4" />
                            Crop Listings
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Client Orders
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="crops" className="space-y-4">
                        {/* Search and Filter Section */}
                        <div className="mb-8">
                            <div className="flex flex-col gap-4 mb-4 md:flex-row">
                                <div className="relative flex-grow">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
                                    <Input
                                        type="text"
                                        placeholder="Search crops by name, description, or location..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">
                                                <div className="flex items-center">
                                                    <SortDesc className="w-4 h-4 mr-2" />
                                                    Newest First
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                <div className="flex items-center">
                                                    <SortAsc className="w-4 h-4 mr-2" />
                                                    Oldest First
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="price_low">
                                                <div className="flex items-center">
                                                    <SortAsc className="w-4 h-4 mr-2" />
                                                    Price: Low to High
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="price_high">
                                                <div className="flex items-center">
                                                    <SortDesc className="w-4 h-4 mr-2" />
                                                    Price: High to Low
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="harvest_date">
                                                <div className="flex items-center">
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    Harvest Date
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <div className="flex items-center">
                                                <Filter className="w-4 h-4 mr-2" />
                                                <span>{statusFilter === 'all' ? 'All Statuses' : statusFilter}</span>
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="reserved">Reserved</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {(statusFilter !== 'all' || searchTerm) && (
                                        <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
                                            <X className="w-4 h-4" /> Reset
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Applied filters pills */}
                            {(searchTerm || statusFilter !== 'all') && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {searchTerm && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            Search: {searchTerm}
                                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchTerm('')} />
                                        </Badge>
                                    )}

                                    {statusFilter !== 'all' && (
                                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                                            Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setStatusFilter('all')} />
                                        </Badge>
                                    )}

                                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 px-2 text-xs">
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Crop Cards Section - Updated */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredCrops.length > 0 ? (
                                filteredCrops.map((crop, index) => <AnimatedCropCard key={crop.id} crop={crop} index={index} />)
                            ) : (
                                <EmptyCropsState resetFilters={resetFilters} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-6">
                        {/* Order Detail View - shows when an order is selected */}
                        {selectedOrder && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Order #{selectedOrder.order_number}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedOrder(null);
                                                setSelectedOrderId(null);
                                                window.history.pushState({}, '', '/farmer/crops?tab=orders');
                                            }}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                    <CardDescription>Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold">Client Information</h3>
                                            <p className="font-medium">{selectedOrder.client_name}</p>
                                            <p className="text-muted-foreground">{selectedOrder.client_email}</p>
                                            {selectedOrder.client_phone && <p className="text-muted-foreground">{selectedOrder.client_phone}</p>}
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-lg font-semibold">Order Details</h3>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className="font-medium capitalize">{selectedOrder.status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Amount:</span>
                                                <span className="font-medium">
                                                    $
                                                    {typeof selectedOrder.total_amount === 'string'
                                                        ? parseFloat(selectedOrder.total_amount).toFixed(2)
                                                        : selectedOrder.total_amount.toFixed(2)}
                                                </span>
                                            </div>
                                            {selectedOrder.delivery_date && (
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Delivery Date:</span>
                                                    <span>{new Date(selectedOrder.delivery_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="mb-2 text-lg font-semibold">Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-sm border-b text-muted-foreground">
                                                        <th className="px-4 py-3 text-left">Item</th>
                                                        <th className="px-4 py-3 text-center">Quantity</th>
                                                        <th className="px-4 py-3 text-right">Price</th>
                                                        <th className="px-4 py-3 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.items.map((item) => (
                                                        <tr key={item.id} className="border-b">
                                                            <td className="px-4 py-3">
                                                                <div className="font-medium">{item.crop_name}</div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                                                            <td className="px-4 py-3 font-medium text-right">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Search and Filter Section */}
                        <div className="mb-8">
                            <div className="flex flex-col gap-4 mb-4 md:flex-row">
                                <div className="relative flex-grow">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
                                    <Input
                                        type="text"
                                        placeholder="Search orders by ID, client name, or email..."
                                        className="pl-10"
                                        value={searchOrderTerm}
                                        onChange={(e) => setSearchOrderTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Select value={orderSortBy} onValueChange={setOrderSortBy}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">
                                                <div className="flex items-center">
                                                    <SortDesc className="w-4 h-4 mr-2" />
                                                    Newest First
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                <div className="flex items-center">
                                                    <SortAsc className="w-4 h-4 mr-2" />
                                                    Oldest First
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="amount_high">
                                                <div className="flex items-center">
                                                    <SortDesc className="w-4 h-4 mr-2" />
                                                    Highest Amount
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="amount_low">
                                                <div className="flex items-center">
                                                    <SortAsc className="w-4 h-4 mr-2" />
                                                    Lowest Amount
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <div className="flex items-center">
                                                <Filter className="w-4 h-4 mr-2" />
                                                <span>{orderStatusFilter === 'all' ? 'All Statuses' : orderStatusFilter}</span>
                                            </div>
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

                                    {(searchOrderTerm || orderStatusFilter !== 'all') && (
                                        <Button variant="ghost" size="sm" onClick={clearOrderFilters} className="gap-1">
                                            <X className="w-4 h-4" /> Reset
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Applied filters pills */}
                            {(searchOrderTerm || orderStatusFilter !== 'all') && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {searchOrderTerm && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            Search: {searchOrderTerm}
                                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchOrderTerm('')} />
                                        </Badge>
                                    )}

                                    {orderStatusFilter !== 'all' && (
                                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                                            Status: {orderStatusFilter.charAt(0).toUpperCase() + orderStatusFilter.slice(1)}
                                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setOrderStatusFilter('all')} />
                                        </Badge>
                                    )}

                                    <Button variant="ghost" size="sm" onClick={clearOrderFilters} className="h-6 px-2 text-xs">
                                        Clear All
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Orders Table */}
                        <ClientOrdersTable
                            orders={filteredOrders}
                            title={`${filteredOrders.length} ${filteredOrders.length === 1 ? 'Order' : 'Orders'}`}
                            showViewAll={false}
                            emptyStateMessage="No client orders match your filters"
                        />

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-2xl font-bold">{orders.length}</div>
                                    <div className="text-muted-foreground">Total Orders</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-2xl font-bold">{orders.filter((o) => o.status === 'pending').length}</div>
                                    <div className="text-muted-foreground">Pending Orders</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-2xl font-bold">{orders.filter((o) => o.status === 'processing').length}</div>
                                    <div className="text-muted-foreground">Processing Orders</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-2xl font-bold">{orders.filter((o) => o.status === 'delivered').length}</div>
                                    <div className="text-muted-foreground">Completed Orders</div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </FarmerLayout>
    );
}
