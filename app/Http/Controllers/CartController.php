<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\VolumeDiscount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the cart contents.
     */
    public function index(Request $request): Response
    {
        $cartItems = CartItem::where('farmer_id', $request->user()->id)
            ->with('product.productType')
            ->get();

        $cartTotal = 0;
        $cartSavings = 0;

        foreach ($cartItems as $item) {
            // Cast to float to ensure we're working with numeric values
            $item->total_price = (float) $item->total_price;
            $item->unit_price = (float) $item->unit_price;

            $cartTotal += $item->total_price;
            $cartSavings += ($item->unit_price * $item->quantity) - $item->total_price;
        }

        return Inertia::render('farmer/cart', [
            'cartItems' => $cartItems,
            'cartTotal' => (float) $cartTotal,
            'cartSavings' => (float) $cartSavings
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function add(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        // Check if product is in stock
        if ($product->stock_quantity < $request->quantity) {
            return back()->withErrors([
                'quantity' => 'The requested quantity is not available in stock.'
            ]);
        }

        // Check if item already exists in cart
        $cartItem = CartItem::where('farmer_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        // Calculate unit price and discount
        $unitPrice = (float) $product->price;
        $discountPercentage = 0;
        $quantity = (int) $request->quantity;

        // Find applicable volume discount
        $volumeDiscount = VolumeDiscount::where('product_id', $product->id)
            ->where('minimum_quantity', '<=', $quantity)
            ->orderBy('minimum_quantity', 'desc')
            ->first();

        if ($volumeDiscount) {
            $discountPercentage = (float) $volumeDiscount->discount_percentage;
        }

        $totalPrice = $unitPrice * $quantity;
        if ($discountPercentage > 0) {
            $totalPrice = $totalPrice - ($totalPrice * ($discountPercentage / 100));
        }

        if ($cartItem) {
            // Update existing cart item
            $cartItem->quantity = $quantity;
            $cartItem->unit_price = $unitPrice;
            $cartItem->discount_percentage = $discountPercentage;
            $cartItem->total_price = $totalPrice;
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'farmer_id' => $request->user()->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'discount_percentage' => $discountPercentage,
                'total_price' => $totalPrice
            ]);
        }

        // For AJAX/JSON requests, return the cart item with the product data
        if ($request->wantsJson() || $request->ajax()) {
            $cartItem->load('product.productType');

            // Explicitly cast numeric values to ensure they're handled properly in JavaScript
            $cartItem->quantity = (int) $cartItem->quantity;
            $cartItem->unit_price = (float) $cartItem->unit_price;
            $cartItem->discount_percentage = (float) $cartItem->discount_percentage;
            $cartItem->total_price = (float) $cartItem->total_price;

            return response()->json([
                'success' => true,
                'cartItem' => $cartItem
            ]);
        }

        return redirect()->route('farmer.cart.index');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Check if the authenticated user is the owner of the cart item
        if ($request->user()->id !== $cartItem->farmer_id) {
            abort(403, 'This action is unauthorized.');
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        // Check if product is in stock
        if ($cartItem->product->stock_quantity < $request->quantity) {
            return back()->withErrors([
                'quantity' => 'The requested quantity is not available in stock.'
            ]);
        }

        // Calculate unit price and discount
        $unitPrice = (float) $cartItem->product->price;
        $discountPercentage = 0;

        // Find applicable volume discount
        $volumeDiscount = VolumeDiscount::where('product_id', $cartItem->product_id)
            ->where('minimum_quantity', '<=', $request->quantity)
            ->orderBy('minimum_quantity', 'desc')
            ->first();

        if ($volumeDiscount) {
            $discountPercentage = (float) $volumeDiscount->discount_percentage;
        }

        $totalPrice = $unitPrice * $request->quantity;
        if ($discountPercentage > 0) {
            $totalPrice = $totalPrice - ($totalPrice * ($discountPercentage / 100));
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->discount_percentage = $discountPercentage;
        $cartItem->total_price = $totalPrice;
        $cartItem->unit_price = $unitPrice;
        $cartItem->save();

        // Return a simple success response instead of redirect for AJAX requests
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'cartItem' => $cartItem
            ]);
        }

        return redirect()->route('farmer.cart.index');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(CartItem $cartItem, Request $request)
    {
        // Check if the authenticated user is the owner of the cart item
        if ($request->user()->id !== $cartItem->farmer_id) {
            abort(403, 'This action is unauthorized.');
        }

        $cartItem->delete();

        // Return a simple success response instead of redirect for AJAX requests
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true
            ]);
        }

        return redirect()->route('farmer.cart.index');
    }
}
