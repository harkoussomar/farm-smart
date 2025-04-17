import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import FarmerLayout from '../../../layouts/FarmerLayout';

interface OrderShowProps {
    order: {
        id: number;
        order_number: string;
        status: string;
        payment_status: string;
        total_amount: number;
        delivery_address: string;
        delivery_notes: string | null;
        created_at: string;
        items: Array<{
            id: number;
            product: {
                id: number;
                name: string;
                image_path: string;
            };
            quantity: number;
            unit_price: number;
            discount_percentage: number;
            total_price: number;
        }>;
        status_history: Array<{
            id: number;
            status: string;
            note: string;
            created_at: string;
        }>;
    };
}

const OrderShow = ({ order }: OrderShowProps) => {
    const { post, processing } = useForm();

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    };

    const reorder = () => {
        post(`/farmer/orders/${order.id}/reorder`);
    };

    return (
        <FarmerLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="container mx-auto px-4 py-6">
                <div className="mb-4">
                    <Link href="/farmer/orders" className="text-sm text-blue-600 hover:underline">
                        ← Back to Orders
                    </Link>
                </div>

                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">Order #{order.order_number}</h1>
                        <p className="text-muted-foreground text-sm">Placed on {formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={reorder} disabled={processing} className="w-full md:w-auto">
                            Reorder
                        </Button>
                    </div>
                </div>

                {/* Order Summary for Mobile - Shows at top on small screens */}
                <div className="mb-6 block lg:hidden">
                    <Card className="p-4">
                        <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)}</span>
                            </div>

                            {order.items.some((item) => item.discount_percentage > 0) && (
                                <div className="flex justify-between border-b pb-3 text-green-600">
                                    <span>Discount</span>
                                    <span>
                                        -$
                                        {order.items
                                            .reduce((sum, item) => sum + item.unit_price * item.quantity * (item.discount_percentage / 100), 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between border-b pb-3">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>$0.00</span>
                            </div>

                            <div className="flex justify-between pt-2 text-base font-bold">
                                <span>Total</span>
                                <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Button className="w-full" onClick={reorder} disabled={processing}>
                                Reorder Items
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="overflow-hidden">
                            <div className="bg-muted flex flex-col justify-between px-4 py-3 md:flex-row md:items-center md:px-6 md:py-4">
                                <h2 className="mb-2 text-base font-medium md:mb-0 md:text-lg">Order Status</h2>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                            order.status,
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(
                                            order.payment_status,
                                        )}`}
                                    >
                                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 md:p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="mb-2 font-medium">Order Timeline</h3>
                                        <div className="space-y-4">
                                            {order.status_history.map((history, index) => (
                                                <div key={history.id} className="flex gap-3 md:gap-4">
                                                    <div className="w-6 flex-shrink-0 md:w-8">
                                                        <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs md:h-8 md:w-8 md:text-sm">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium md:text-base">
                                                            {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                                        </div>
                                                        <p className="text-muted-foreground text-xs md:text-sm">{formatDate(history.created_at)}</p>
                                                        {history.note && <p className="mt-1 text-xs md:text-sm">{history.note}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="mb-2 font-medium">Delivery Information</h3>
                                        <div className="text-xs md:text-sm">
                                            <p className="whitespace-pre-line">{order.delivery_address}</p>
                                            {order.delivery_notes && (
                                                <div className="mt-3 md:mt-4">
                                                    <p className="font-medium">Delivery Notes:</p>
                                                    <p className="text-muted-foreground">{order.delivery_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="bg-muted px-4 py-3 md:px-6 md:py-4">
                                <h2 className="text-base font-medium md:text-lg">Order Items</h2>
                            </div>

                            {/* Mobile view for order items */}
                            <div className="block md:hidden">
                                <div className="divide-y">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="p-4">
                                            <div className="mb-3 flex items-start gap-3">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                                                    <img
                                                        src={item.product.image_path || '/placeholder-product.jpg'}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/farmer/products/${item.product.id}`}
                                                        className="text-sm font-medium hover:underline"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="text-muted-foreground mt-1 text-xs">
                                                        Qty: {item.quantity} x ${item.unit_price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <div>
                                                    {item.discount_percentage > 0 && (
                                                        <span className="block text-green-600">Discount: {item.discount_percentage}%</span>
                                                    )}
                                                </div>
                                                <div className="font-medium">${item.total_price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop view for order items */}
                            <div className="hidden overflow-x-auto md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Discount</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                                                            <img
                                                                src={item.product.image_path || '/placeholder-product.jpg'}
                                                                alt={item.product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <Link href={`/farmer/products/${item.product.id}`} className="font-medium hover:underline">
                                                            {item.product.name}
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                                                <TableCell>{item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-'}</TableCell>
                                                <TableCell>${item.total_price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary for Desktop - Shows on the right side on large screens */}
                    <div className="hidden lg:block">
                        <Card className="sticky top-8 p-6">
                            <h2 className="mb-6 text-lg font-medium">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b pb-4">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0).toFixed(2)}</span>
                                </div>

                                {order.items.some((item) => item.discount_percentage > 0) && (
                                    <div className="flex justify-between border-b pb-4 text-green-600">
                                        <span>Discount</span>
                                        <span>
                                            -$
                                            {order.items
                                                .reduce((sum, item) => sum + item.unit_price * item.quantity * (item.discount_percentage / 100), 0)
                                                .toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between border-b pb-4">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>$0.00</span>
                                </div>

                                <div className="flex justify-between pt-4 text-lg font-bold">
                                    <span>Total</span>
                                    <span>${order.total_amount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button className="w-full" onClick={reorder} disabled={processing}>
                                    Reorder These Items
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
};

export default OrderShow;
