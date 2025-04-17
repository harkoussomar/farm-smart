import React from 'react';
import { Head } from '@inertiajs/react';
import FarmerLayout from '@/layouts/FarmerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientOrdersTable from '@/components/ClientOrdersTable';
import OrderStatusChart from '@/components/OrderStatusChart';
import { sampleClientOrders, sampleStats, sampleOrderStatusBreakdown } from '@/utils/mockClientData';

const Samples = () => {
    return (
        <FarmerLayout>
            <Head title="Sample Data" />

            <div className="container mx-auto p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Sample Data</h1>
                    <p className="text-muted-foreground">
                        This page displays sample data for testing the client order management system.
                    </p>
                </div>

                <Tabs defaultValue="orders" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="orders">Client Orders</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="charts">Charts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sample Client Orders</CardTitle>
                                <CardDescription>
                                    These orders represent sample data that can be used throughout the application for testing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ClientOrdersTable
                                    orders={sampleClientOrders}
                                    title=""
                                    showViewAll={false}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                                <CardDescription>
                                    Detailed information about each order including items and calculations.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {sampleClientOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {new Date(order.created_at).toLocaleDateString()} • {order.status}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                                                <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Client Information</h4>
                                            <div className="bg-muted/50 p-3 rounded">
                                                <p className="font-medium">{order.client_name}</p>
                                                <p className="text-sm">{order.client_email}</p>
                                                {order.client_phone && <p className="text-sm">{order.client_phone}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Order Items</h4>
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead className="bg-muted/50 text-muted-foreground text-sm">
                                                        <tr>
                                                            <th className="text-left p-2 border-b">Item</th>
                                                            <th className="text-right p-2 border-b">Quantity</th>
                                                            <th className="text-right p-2 border-b">Price</th>
                                                            <th className="text-right p-2 border-b">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item) => (
                                                            <tr key={item.id} className="border-b">
                                                                <td className="p-2">{item.crop_name}</td>
                                                                <td className="p-2 text-right">{item.quantity}</td>
                                                                <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                                                                <td className="p-2 text-right font-medium">
                                                                    ${(item.quantity * item.price).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        <tr className="font-medium">
                                                            <td colSpan={3} className="p-2 text-right">Total</td>
                                                            <td className="p-2 text-right">${order.total_amount.toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button size="sm" variant="outline">View Full Details</Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sample Statistics</CardTitle>
                                <CardDescription>
                                    These statistics represent sample data for testing dashboard elements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(sampleStats).map(([key, value]) => {
                                        if (key === 'orderStatusBreakdown') return null;

                                        return (
                                            <div key={key} className="border rounded-lg p-4">
                                                <h3 className="text-sm text-muted-foreground mb-1 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                <p className="text-2xl font-bold">
                                                    {typeof value === 'number' && key.toLowerCase().includes('profit') ?
                                                        `$${value.toFixed(2)}` :
                                                        typeof value === 'number' && key.toLowerCase().includes('spent') ?
                                                            `$${value.toFixed(2)}` :
                                                            value}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status Breakdown</CardTitle>
                                <CardDescription>
                                    Detailed breakdown of orders by status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(sampleOrderStatusBreakdown).map(([status, count]) => (
                                        <div key={status} className="border rounded-lg p-4">
                                            <h3 className="text-sm text-muted-foreground mb-1 capitalize">{status}</h3>
                                            <p className="text-2xl font-bold">{count}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="charts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status Chart</CardTitle>
                                <CardDescription>
                                    Visual representation of orders by status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-xl mx-auto">
                                    <OrderStatusChart data={sampleOrderStatusBreakdown} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </FarmerLayout>
    );
};

export default Samples;