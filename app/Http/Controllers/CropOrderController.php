<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CropOrderController extends Controller
{
    /**
     * Display a listing of crop orders.
     */
    public function index(Request $request): Response
    {
        // Render the index page component
        return Inertia::render('farmer/crops/orders/index');
    }

    /**
     * Display the specified crop order.
     */
    public function show($id): Response
    {
        // Render the show page component and pass the orderId
        return Inertia::render('farmer/crops/orders/show', [
            'orderId' => $id
        ]);
    }
}