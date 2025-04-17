<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\FarmProfile;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\VolumeDiscount;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $query = Order::where('farmer_id', $request->user()->id);

        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply payment status filter
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', "%{$request->search}%");
        }

        // Sort by newest first
        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $orders = $query->paginate(10);

        // Cast numeric values to float before passing to frontend
        $ordersData = $orders->items();
        foreach ($ordersData as $order) {
            $order->total_amount = (float) $order->total_amount;
        }

        return Inertia::render('farmer/orders/index', [
            'orders' => [
                'data' => $ordersData,
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total()
                ]
            ],
            'filters' => $request->only(['status', 'payment_status', 'search'])
        ]);
    }

    /**
     * Show the checkout form.
     */
    public function create(Request $request): Response
    {
        $cartItems = CartItem::where('farmer_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('farmer.products.index');
        }

        $cartTotal = 0;
        $cartSavings = 0;

        foreach ($cartItems as $item) {
            // Cast to float to ensure we're working with numeric values
            $item->total_price = (float) $item->total_price;
            $item->unit_price = (float) $item->unit_price;

            $cartTotal += $item->total_price;
            $cartSavings += ($item->unit_price * $item->quantity) - $item->total_price;
        }

        $farmProfile = FarmProfile::where('farmer_id', $request->user()->id)->first();

        return Inertia::render('farmer/checkout', [
            'cartItems' => $cartItems,
            'cartTotal' => (float) $cartTotal,
            'cartSavings' => (float) $cartSavings,
            'farmProfile' => $farmProfile
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'delivery_address' => 'required|string',
            'delivery_notes' => 'nullable|string',
            'credit_card_number' => 'required|string',
            'credit_card_name' => 'required|string',
            'credit_card_expiry' => 'required|string',
            'credit_card_cvv' => 'required|string',
        ]);

        $cartItems = CartItem::where('farmer_id', $request->user()->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('farmer.products.index');
        }

        $totalAmount = 0;
        foreach ($cartItems as $item) {
            // Cast to float to ensure we're working with numeric values
            $item->total_price = (float) $item->total_price;
            $totalAmount += $item->total_price;
        }

        // Create the order
        $order = new Order();
        $order->farmer_id = $request->user()->id;
        $order->order_number = 'ORD-' . strtoupper(Str::random(8));
        $order->status = 'pending';
        $order->total_amount = (float) $totalAmount;
        $order->delivery_address = $request->delivery_address;
        $order->delivery_notes = $request->delivery_notes;
        $order->payment_status = 'paid'; // This is a demo, so we assume payment succeeds
        $order->save();

        // Add order status history
        $statusHistory = new OrderStatusHistory();
        $statusHistory->order_id = $order->id;
        $statusHistory->status = 'pending';
        $statusHistory->note = 'Order placed successfully';
        $statusHistory->save();

        // Create order items
        foreach ($cartItems as $item) {
            $orderItem = new OrderItem();
            $orderItem->order_id = $order->id;
            $orderItem->product_id = $item->product_id;
            $orderItem->quantity = $item->quantity;
            $orderItem->unit_price = (float) $item->unit_price;
            $orderItem->discount_percentage = (float) $item->discount_percentage;
            $orderItem->total_price = (float) $item->total_price;
            $orderItem->save();
        }

        // Clear the cart
        CartItem::where('farmer_id', $request->user()->id)->delete();

        return redirect()->route('farmer.orders.show', $order);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order, Request $request): Response
    {
        // Check if the authenticated user is the owner of the order
        if ($request->user()->id !== $order->farmer_id) {
            abort(403, 'This action is unauthorized.');
        }

        try {
            $order->load(['items.product', 'statusHistory' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }]);

            // Cast numeric values to float
            $order->total_amount = (float) $order->total_amount;

            foreach ($order->items as $item) {
                $item->unit_price = (float) $item->unit_price;
                $item->discount_percentage = (float) $item->discount_percentage;
                $item->total_price = (float) $item->total_price;
            }

            // If there's no status history, add a default one
            if ($order->statusHistory->isEmpty()) {
                // Create a default status history
                $statusHistory = new OrderStatusHistory();
                $statusHistory->order_id = $order->id;
                $statusHistory->status = $order->status;
                $statusHistory->note = 'Order status updated';
                $statusHistory->save();

                // Reload the status history
                $order->load(['statusHistory' => function ($query) {
                    $query->orderBy('created_at', 'asc');
                }]);
            }
        } catch (\Exception $e) {
            // Just load items without status history if there's an error
            $order->load('items.product');

            // Cast numeric values to float
            $order->total_amount = (float) $order->total_amount;

            foreach ($order->items as $item) {
                $item->unit_price = (float) $item->unit_price;
                $item->discount_percentage = (float) $item->discount_percentage;
                $item->total_price = (float) $item->total_price;
            }

            // Add a statusHistory property to avoid errors in the frontend
            $order->statusHistory = collect([]);
        }

        return Inertia::render('farmer/orders/show', [
            'order' => $order
        ]);
    }

    /**
     * Reorder items from a previous order.
     */
    public function reorder(Request $request, Order $order)
    {
        // Check if the authenticated user is the owner of the order
        if ($request->user()->id !== $order->farmer_id) {
            abort(403, 'This action is unauthorized.');
        }

        // Clear existing cart
        CartItem::where('farmer_id', $request->user()->id)->delete();

        // Add items from the order to the cart
        foreach ($order->items as $item) {
            // Skip if product is no longer available
            if (!$item->product || $item->product->stock_quantity < $item->quantity) {
                continue;
            }

            // Calculate discount
            $unitPrice = $item->product->price;
            $discountPercentage = 0;

            // Find applicable volume discount
            $volumeDiscount = VolumeDiscount::where('product_id', $item->product_id)
                ->where('minimum_quantity', '<=', $item->quantity)
                ->orderBy('minimum_quantity', 'desc')
                ->first();

            if ($volumeDiscount) {
                $discountPercentage = $volumeDiscount->discount_percentage;
            }

            $totalPrice = $unitPrice * $item->quantity;
            if ($discountPercentage > 0) {
                $totalPrice = $totalPrice - ($totalPrice * ($discountPercentage / 100));
            }

            // Create cart item
            CartItem::create([
                'farmer_id' => $request->user()->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'unit_price' => $unitPrice,
                'discount_percentage' => $discountPercentage,
                'total_price' => $totalPrice
            ]);
        }

        return redirect()->route('farmer.cart.index');
    }
}
