<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FarmerDashboardController extends Controller
{
    /**
     * Display the farmer dashboard.
     */
    public function index(Request $request): Response
    {
        $farmer = $request->user();

        // Get recent orders
        $recentOrders = Order::where('farmer_id', $farmer->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Cast total_amount to float for each order
        foreach ($recentOrders as $order) {
            $order->total_amount = (float) $order->total_amount;
        }

        // Get order stats
        $totalOrders = Order::where('farmer_id', $farmer->id)->count();
        $pendingOrders = Order::where('farmer_id', $farmer->id)
            ->whereIn('status', ['pending', 'processing'])
            ->count();
        $totalSpent = (float) Order::where('farmer_id', $farmer->id)
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        return Inertia::render('farmer/dashboard', [
            'farmer' => [
                'name' => $farmer->name
            ],
            'recentOrders' => $recentOrders,
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'totalSpent' => $totalSpent
            ]
        ]);
    }
}
