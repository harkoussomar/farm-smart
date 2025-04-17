import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Textarea } from '../../components/ui/textarea';
import FarmerLayout from '../../layouts/FarmerLayout';

interface CheckoutProps {
    cartItems: Array<{
        id: number;
        product_id: number;
        quantity: number;
        product: {
            id: number;
            name: string;
            price: number;
            image_path: string;
        };
        unit_price: number;
        discount_percentage: number;
        total_price: number;
    }>;
    cartTotal: number;
    cartSavings: number;
    farmProfile?: {
        address: string;
    };
}

const Checkout = ({ cartItems, cartTotal, cartSavings, farmProfile }: CheckoutProps) => {
    const { data, setData, post, processing, errors } = useForm({
        delivery_address: farmProfile?.address || '',
        delivery_notes: '',
        payment_method: 'credit_card',
        credit_card_number: '',
        credit_card_name: '',
        credit_card_expiry: '',
        credit_card_cvv: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/farmer/orders');
    };

    if (cartItems.length === 0) {
        return (
            <FarmerLayout>
                <Head title="Checkout" />
                <div className="container mx-auto px-4 py-8">
                    <Card className="p-8 text-center">
                        <h2 className="mb-4 text-xl font-medium">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">You cannot proceed to checkout with an empty cart.</p>
                        <Button asChild>
                            <Link href="/farmer/products">Browse Products</Link>
                        </Button>
                    </Card>
                </div>
            </FarmerLayout>
        );
    }

    return (
        <FarmerLayout>
            <Head title="Checkout" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Checkout</h1>
                    <p className="text-muted-foreground">Complete your order by filling in your information</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="space-y-8 lg:col-span-2">
                            <Card className="p-6">
                                <h2 className="mb-6 text-xl font-semibold">Delivery Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="delivery_address" className="mb-2 block">
                                            Delivery Address
                                        </Label>
                                        <Textarea
                                            id="delivery_address"
                                            value={data.delivery_address}
                                            onChange={(e) => setData('delivery_address', e.target.value)}
                                            className="h-24"
                                            required
                                        />
                                        {errors.delivery_address && <InputError message={errors.delivery_address} />}
                                    </div>

                                    <div>
                                        <Label htmlFor="delivery_notes" className="mb-2 block">
                                            Delivery Notes (Optional)
                                        </Label>
                                        <Textarea
                                            id="delivery_notes"
                                            value={data.delivery_notes}
                                            onChange={(e) => setData('delivery_notes', e.target.value)}
                                            placeholder="Special instructions for delivery"
                                            className="h-24"
                                        />
                                        {errors.delivery_notes && <InputError message={errors.delivery_notes} />}
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="mb-6 text-xl font-semibold">Payment Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="credit_card_number" className="mb-2 block">
                                            Card Number
                                        </Label>
                                        <Input
                                            id="credit_card_number"
                                            placeholder="1234 5678 9012 3456"
                                            value={data.credit_card_number}
                                            onChange={(e) => setData('credit_card_number', e.target.value)}
                                            required
                                        />
                                        {errors.credit_card_number && <InputError message={errors.credit_card_number} />}
                                    </div>

                                    <div>
                                        <Label htmlFor="credit_card_name" className="mb-2 block">
                                            Name on Card
                                        </Label>
                                        <Input
                                            id="credit_card_name"
                                            placeholder="John Doe"
                                            value={data.credit_card_name}
                                            onChange={(e) => setData('credit_card_name', e.target.value)}
                                            required
                                        />
                                        {errors.credit_card_name && <InputError message={errors.credit_card_name} />}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="credit_card_expiry" className="mb-2 block">
                                                Expiry Date
                                            </Label>
                                            <Input
                                                id="credit_card_expiry"
                                                placeholder="MM/YY"
                                                value={data.credit_card_expiry}
                                                onChange={(e) => setData('credit_card_expiry', e.target.value)}
                                                required
                                            />
                                            {errors.credit_card_expiry && <InputError message={errors.credit_card_expiry} />}
                                        </div>

                                        <div>
                                            <Label htmlFor="credit_card_cvv" className="mb-2 block">
                                                CVV
                                            </Label>
                                            <Input
                                                id="credit_card_cvv"
                                                placeholder="123"
                                                value={data.credit_card_cvv}
                                                onChange={(e) => setData('credit_card_cvv', e.target.value)}
                                                required
                                            />
                                            {errors.credit_card_cvv && <InputError message={errors.credit_card_cvv} />}
                                        </div>
                                    </div>

                                    <div className="text-muted-foreground mt-4 text-sm">
                                        <p>This is a demo checkout. No actual payment will be processed.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div>
                            <Card className="sticky top-8 p-6">
                                <h2 className="text-lg font-medium">Order Summary</h2>

                                <div className="mt-6 max-h-72 space-y-3 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex border-b pb-3 text-sm">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                <img
                                                    src={item.product.image_path || '/placeholder-product.jpg'}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-3 flex flex-1 flex-col">
                                                <div className="flex justify-between text-base font-medium">
                                                    <h3 className="text-sm">{item.product.name}</h3>
                                                    <p className="ml-4">
                                                        $
                                                        {typeof item.total_price === 'string'
                                                            ? parseFloat(item.total_price).toFixed(2)
                                                            : item.total_price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-xs">Qty: {item.quantity}</p>
                                                {item.discount_percentage > 0 && (
                                                    <p className="mt-1 text-xs text-green-600">{item.discount_percentage}% discount applied</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground text-base">Subtotal</p>
                                        <p className="text-base font-medium">
                                            $
                                            {typeof (cartTotal + cartSavings) === 'string'
                                                ? parseFloat(cartTotal + cartSavings).toFixed(2)
                                                : (cartTotal + cartSavings).toFixed(2)}
                                        </p>
                                    </div>

                                    {cartSavings > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <p className="text-base">Discount Savings</p>
                                            <p className="text-base font-medium">
                                                -${typeof cartSavings === 'string' ? parseFloat(cartSavings).toFixed(2) : cartSavings.toFixed(2)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground text-base">Shipping</p>
                                        <p className="text-base font-medium">$0.00</p>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between">
                                        <p className="text-base font-medium">Order Total</p>
                                        <p className="text-lg font-bold">
                                            ${typeof cartTotal === 'string' ? parseFloat(cartTotal).toFixed(2) : cartTotal.toFixed(2)}
                                        </p>
                                    </div>

                                    <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                        Complete Order
                                    </Button>

                                    <div className="mt-4 text-center">
                                        <Link href="/farmer/cart" className="text-sm text-blue-600 hover:underline">
                                            Return to Cart
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </FarmerLayout>
    );
};

export default Checkout;
