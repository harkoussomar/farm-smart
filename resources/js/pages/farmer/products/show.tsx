import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import FarmerLayout from '@/layouts/FarmerLayout';
import { CartItem, Product } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const cart = useCart();
    const { toast } = useToast();

    const handleAddToCart = async () => {
        try {
            setLoading(true);

            // Send to backend using axios with the correct route format
            const response = await axios.post(`/farmer/cart/add/${product.id}`, {
                quantity: quantity,
            });

            if (response.data.success && response.data.cartItem) {
                // Convert backend cartItem to our CartItem type
                const cartItem: CartItem = {
                    id: response.data.cartItem.id,
                    product_id: response.data.cartItem.product_id,
                    quantity: response.data.cartItem.quantity,
                    product: response.data.cartItem.product,
                    unit_price: response.data.cartItem.unit_price,
                    discount_percentage: response.data.cartItem.discount_percentage,
                    total_price: response.data.cartItem.total_price,
                };

                // Update cart state
                cart.addItem(cartItem);

                // Show success toast
                toast({
                    title: 'Added to cart',
                    description: `${quantity} x ${product.name} added to your cart.`,
                    variant: 'success',
                });
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);

            // If the API call fails, update the cart state anyway with local data
            // This ensures the cart icon updates even if the API fails
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

            // Create a temporary cart item with a negative ID (will be replaced when cart syncs)
            const tempCartItem: CartItem = {
                id: -Math.floor(Math.random() * 1000000), // Temporary negative ID
                product_id: product.id,
                quantity: quantity,
                product: product,
                unit_price: price,
                discount_percentage: 0, // We don't have discount info
                total_price: price * quantity,
            };

            // Update the cart with this temporary item
            cart.addItem(tempCartItem);

            toast({
                title: 'Added to cart locally',
                description: `${quantity} x ${product.name} added to your cart, but we couldn't sync with the server.`,
                variant: 'warning',
            });
        } finally {
            setLoading(false);
        }
    };

    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    return (
        <FarmerLayout>
            <Head title={`Product #${product.id}`} />
            <div className="container mx-auto min-h-199 px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="bg-card relative aspect-square overflow-hidden rounded-lg">
                        <img src={product.image_path || '/img/placeholder-product.jpg'} alt={product.name} className="h-full w-full object-cover" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <p className="text-muted-foreground mt-2 text-lg">{product.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">${price.toFixed(2)}</p>
                                <p className="text-muted-foreground text-sm">per unit</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">In Stock</p>
                                <p className="text-muted-foreground text-sm">{product.stock_quantity} units available</p>
                            </div>
                        </div>

                        <div className="border-border border-t pt-6">
                            <Tabs defaultValue="description" className="w-full">
                                <TabsList className="bg-card grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="description"
                                        className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                                    >
                                        Description
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="discounts"
                                        className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
                                    >
                                        Volume Discounts
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="description" className="mt-4">
                                    <p className="text-muted-foreground">{product.description}</p>
                                </TabsContent>
                                <TabsContent value="discounts" className="mt-4">
                                    {product.volume_discounts?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {product.volume_discounts.map((discount) => (
                                                <li key={discount.id} className="text-muted-foreground">
                                                    Buy {discount.minimum_quantity} or more units and get {discount.discount_percentage}% off
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground">No volume discounts available for this product.</p>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="border-border border-t pt-6">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <Label htmlFor="quantity" className="text-foreground">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={product.stock_quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="bg-card text-foreground border-border mt-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 flex-1 cursor-pointer"
                                >
                                    {loading ? 'Adding...' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
}
