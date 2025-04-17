<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductType;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()->with('productType');

        // Apply type filter
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('product_type_id', $request->type);
        }

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Apply sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }
        } else {
            $query->orderBy('name', 'asc');
        }

        $products = $query->with('productType')->get();
        $productTypes = ProductType::all();

        // Get orders for the farmer - apply filters if needed
        $ordersQuery = Order::where('farmer_id', auth()->id())
            ->orderBy('created_at', 'desc');

        // Apply order search filter
        if ($request->has('orderSearch') && $request->orderSearch) {
            $ordersQuery->where('order_number', 'like', "%{$request->orderSearch}%");
        }

        // Apply order status filter
        if ($request->has('orderStatus') && $request->orderStatus && $request->orderStatus !== 'all') {
            $ordersQuery->where('status', $request->orderStatus);
        }

        // Apply payment status filter
        if ($request->has('paymentStatus') && $request->paymentStatus && $request->paymentStatus !== 'all') {
            $ordersQuery->where('payment_status', $request->paymentStatus);
        }

        // Determine how many orders to fetch
        $recentOrders = $request->has('showAll') && $request->showAll === 'true'
            ? $ordersQuery->take(20)->get()
            : $ordersQuery->take(5)->get();

        return Inertia::render('farmer/products/index', [
            'products' => $products,
            'productTypes' => $productTypes,
            'filters' => $request->only(['search', 'type', 'sort']),
            'recentOrders' => $recentOrders,
            'orderFilters' => $request->only(['orderSearch', 'orderStatus', 'paymentStatus'])
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load(['productType', 'volumeDiscounts']);

        // Get related products (same product type)
        $relatedProducts = Product::where('product_type_id', $product->product_type_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('farmer/products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }
}
