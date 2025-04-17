# FarmSmart Backend Architecture Documentation

## Overview

FarmSmart's backend is built on the Laravel framework, providing a robust server architecture to support the React-based frontend. The backend handles data persistence, authentication, business logic, and API endpoints for the farm management platform. This documentation outlines the key components and architectural decisions that form the foundation of the system.

## Table of Contents

1. [Server Architecture and Technology Stack](#server-architecture-and-technology-stack)
2. [Database Schema and Relationships](#database-schema-and-relationships)
3. [API Endpoints and Documentation](#api-endpoints-and-documentation)
4. [Authentication and Authorization Mechanisms](#authentication-and-authorization-mechanisms)
5. [Business Logic Organization](#business-logic-organization)
6. [Error Handling and Logging Approach](#error-handling-and-logging-approach)
7. [Performance Optimization Strategies](#performance-optimization-strategies)
8. [Security Implementations](#security-implementations)

## Server Architecture and Technology Stack

FarmSmart uses a modern Laravel-based architecture that seamlessly integrates with the React frontend:

### Technology Stack

- **Framework**: Laravel (PHP)
- **Frontend Integration**: Inertia.js
- **Database**: SQLite (with database agnostic features)
- **Authentication**: Laravel's built-in authentication with custom middleware
- **API Format**: JSON responses via Inertia.js and direct API endpoints
- **State Management**: Server-side state with client synchronization
- **Caching**: Laravel's cache system
- **File Storage**: Laravel's filesystem abstraction

### Architecture Pattern

The backend follows the Model-View-Controller (MVC) pattern, with some adaptations for Inertia.js:

```
FarmSmart Backend
├── Models (Database Entities)
├── Controllers (Business Logic)
├── Middleware (Request Processing)
├── Routes (API Endpoints)
├── Migrations (Database Schema)
├── Services (Business Logic Abstractions)
└── Resources (Data Transformations)
```

### Request Lifecycle

1. HTTP request arrives at the server
2. Laravel routing directs request to appropriate controller
3. Middleware processes request (authentication, validation)
4. Controller processes request by utilizing models and services
5. Response is generated (JSON for API or Inertia render for web)
6. Response is returned to client

## Database Schema and Relationships

The database schema is designed to support various aspects of farm management with clear relationships between entities:

### Entity Relationship Diagram

```
+---------------+       +------------------+       +---------------+
| Users         |------>| Farm Profiles    |------>| Farm Sections |
+---------------+       +------------------+       +---------------+
       |                       |                          |
       |                       |                          |
       v                       v                          v
+---------------+       +------------------+      +----------------+
| Orders        |<------| Products         |      | Farm Sensor    |
+---------------+       +------------------+      | Data           |
       |                       |                  +----------------+
       |                       |
       v                       v
+---------------+       +------------------+
| Order Items   |       | Volume Discounts |
+---------------+       +------------------+
       |
       v
+------------------+
| Order Status     |
| History          |
+------------------+
```







### Key Tables and Relationships

#### Users and Profiles

- **users**: Core user accounts with authentication data
    - `id`, `name`, `email`, `password`, `type` (farmer, admin)
- **farm_profiles**: Farm details associated with farmer users
    - `id`, `farmer_id`, `farm_name`, `address`, `latitude`, `longitude`, `size`, `size_unit`
- **farm_photos**: Images associated with farm profiles
    - `id`, `farm_profile_id`, `file_path`, `file_name`, `file_size`, `is_primary`

#### Farm Sections and Monitoring

- **farm_sections**: Divisions of a farm for managing different crops or areas
    - `id`, `farm_profile_id`, `name`, `description`, `size`, `crop_type`, `soil_type`, `section_type`
- **farm_sensor_data**: IoT sensor readings from farm sections
    - `id`, `farm_section_id`, `temperature`, `humidity`, `soil_moisture`, `light_intensity`, `timestamp`

#### Products and Inventory

- **product_types**: Categories of products
    - `id`, `name`, `description`, `slug`
- **products**: Items that can be purchased
    - `id`, `name`, `description`, `price`, `product_type_id`, `image_path`, `sku`, `stock_quantity`
- **volume_discounts**: Quantity-based discounts for products
    - `id`, `product_id`, `minimum_quantity`, `discount_percentage`

#### Order Management

- **cart_items**: Temporary storage for items before order placement
    - `id`, `farmer_id`, `product_id`, `quantity`, `unit_price`, `discount_percentage`, `total_price`
- **orders**: Customer orders
    - `id`, `farmer_id`, `order_number`, `status`, `total_amount`, `delivery_address`, `payment_status`
- **order_items**: Line items within an order
    - `id`, `order_id`, `product_id`, `quantity`, `unit_price`, `discount_percentage`, `total_price`
- **order_status_histories**: Tracking changes in order status
    - `id`, `order_id`, `status`, `note`

#### Crops Marketplace

- **crops**: Crops that farmers can sell
    - `id`, `farmer_id`, `name`, `description`, `quantity`, `unit`, `price`, `harvest_date`, `status`

### Database Migrations

The database schema is defined using Laravel migrations, which provide version control for the database structure:

```php
// Example migration for farm profiles
Schema::create('farm_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('farmer_id')->constrained('users')->onDelete('cascade');
    $table->string('farm_name');
    $table->text('address');
    $table->decimal('latitude', 10, 6)->nullable();
    $table->decimal('longitude', 10, 6)->nullable();
    $table->decimal('size', 10, 2);
    $table->string('size_unit')->default('hectares');
    $table->timestamps();
});
```

## API Endpoints and Documentation

### API Structure

The application provides two types of endpoints:

1. **Web Routes**: For Inertia.js-driven frontend with server-rendered JSON
2. **API Routes**: Direct JSON endpoints for external consumption or AJAX requests

### Key Endpoint Groups

#### Authentication Endpoints

- `GET /farmer/login` - Show farmer login form
- `POST /farmer/login` - Authenticate farmer
- `GET /farmer/register` - Show farmer registration form
- `POST /farmer/register` - Register new farmer
- `POST /farmer/logout` - Logout authenticated farmer

#### Farm Management

- `GET /farmer/farm-profile` - View farm profile
- `POST /farmer/farm-profile` - Create farm profile
- `PUT /farmer/farm-profile/{farmProfile}` - Update farm profile
- `POST /farmer/farm-profile/{farmProfile}/sections` - Add farm section
- `PUT /farmer/farm-profile/{farmProfile}/sections/{section}` - Update farm section
- `DELETE /farmer/farm-profile/{farmProfile}/sections/{section}` - Delete farm section

#### Farm Visualization

- `GET /farmer/farm-visualization` - View farm visualization dashboard
- `GET /api/farm-sections/{section}/data` - Get current section data
- `GET /api/farm-sections/{section}/historical-data` - Get historical section data

#### Products and Orders

- `GET /farmer/products` - View product catalog
- `GET /farmer/products/{product}` - View product details
- `GET /farmer/cart` - View shopping cart
- `POST /farmer/cart/add/{product}` - Add product to cart
- `PATCH /farmer/cart/{cartItem}` - Update cart item quantity
- `DELETE /farmer/cart/{cartItem}` - Remove item from cart
- `GET /farmer/checkout` - View checkout page
- `POST /farmer/orders` - Place order
- `GET /farmer/orders/{order}` - View order details
- `POST /farmer/orders/{order}/reorder` - Recreate previous order

#### Crops Marketplace

- `GET /farmer/crops` - View available crops
- `POST /farmer/crops` - List a new crop
- `GET /farmer/crops/{crop}` - View crop details
- `PATCH /farmer/crops/{crop}` - Update crop details
- `DELETE /farmer/crops/{crop}` - Remove crop listing
- `PATCH /farmer/crops/{crop}/mark-as-sold` - Mark crop as sold

### API Response Format

For direct API responses, the application follows a consistent JSON structure:

```json
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Operation completed successfully",
    "error": null
}
```

For error responses:

```json
{
    "success": false,
    "data": null,
    "message": "Unable to complete operation",
    "error": {
        "code": "VALIDATION_ERROR",
        "details": {
            "field_name": ["Error message"]
        }
    }
}
```

## Authentication and Authorization Mechanisms

### Authentication System

FarmSmart uses Laravel's built-in authentication with custom extensions for farmer-specific authentication:

1. **User Types**: The system distinguishes between different user types (e.g., 'farmer')
2. **Sessions**: Authentication state is maintained using Laravel's session system
3. **Guards**: The web guard is used for all authentication
4. **Custom Controllers**: `FarmerAuthController` handles farmer-specific authentication logic

```php
public function login(Request $request): RedirectResponse
{
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $credentials = $request->only('email', 'password');
    $credentials['type'] = 'farmer';

    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::FARMER_HOME);
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ])->onlyInput('email');
}
```

### Authorization System

Authorization is implemented through:

1. **Middleware**: Route-based authorization checks
2. **Custom Middleware**: `EnsureFarmer` middleware verifies user type
3. **Resource Ownership**: Controllers validate that users can only access their own resources

```php
// EnsureFarmer middleware
public function handle(Request $request, Closure $next): Response
{
    if (!Auth::check() || Auth::user()->type !== 'farmer') {
        return redirect()->route('farmer.login');
    }

    return $next($request);
}

// Resource ownership check
if ($request->user()->id !== $order->farmer_id) {
    abort(403, 'This action is unauthorized.');
}
```

### CSRF Protection

All non-read web routes are protected by Laravel's CSRF protection, requiring a valid CSRF token for form submissions and non-GET requests.

## Business Logic Organization

### Controller Structure

Business logic is primarily organized in controllers, following Laravel's RESTful resource controller pattern:

```
Controllers/
├── Auth/
│   └── FarmerAuthController.php
├── CartController.php
├── CropController.php
├── FarmProfileController.php
├── FarmSectionController.php
├── FarmVisualizationController.php
├── OrderController.php
└── ProductController.php
```

### Controllers and Responsibilities

- **FarmerAuthController**: Handles user registration, login, and logout
- **FarmProfileController**: Manages farm profile CRUD operations
- **FarmSectionController**: Handles farm sections within profiles
- **FarmVisualizationController**: Provides data for visualization dashboards
- **ProductController**: Lists and details products for purchase
- **CartController**: Manages shopping cart operations
- **OrderController**: Handles order creation and management
- **CropController**: Manages crop marketplace listings

### Business Logic Example: Cart Management

The cart system demonstrates the business logic organization:

1. **Controller Action**: Entry point for cart interactions
2. **Validation**: Validate user input
3. **Authorization**: Ensure user can only access their own cart
4. **Business Logic**: Apply discount rules, calculate totals
5. **Database Interaction**: Create or update cart items
6. **Response**: Return appropriate response for web or API

```php
// Example: Add to cart logic
public function add(Request $request, Product $product)
{
    // Validate input
    $request->validate([
        'quantity' => 'required|integer|min:1'
    ]);

    // Check inventory
    if ($product->stock_quantity < $request->quantity) {
        return back()->withErrors([
            'quantity' => 'The requested quantity is not available in stock.'
        ]);
    }

    // Business logic: Calculate pricing with discounts
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

    // Database interaction: Create or update cart item
    $cartItem = CartItem::updateOrCreate(
        [
            'farmer_id' => $request->user()->id,
            'product_id' => $product->id
        ],
        [
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'discount_percentage' => $discountPercentage,
            'total_price' => $totalPrice
        ]
    );

    // Response handling
    if ($request->wantsJson()) {
        return response()->json([
            'success' => true,
            'cartItem' => $cartItem
        ]);
    }

    return redirect()->route('farmer.cart.index');
}
```

## Error Handling and Logging Approach

### Error Handling Layers

The application implements several layers of error handling:

1. **Validation**: Input validation with detailed error messages
2. **Exception Handling**: Custom exception handlers for different error types
3. **Status Codes**: Appropriate HTTP status codes for different error scenarios
4. **User-friendly Messages**: Formatted error messages for end-users

### Validation Example

```php
$request->validate([
    'delivery_address' => 'required|string',
    'delivery_notes' => 'nullable|string',
    'credit_card_number' => 'required|string',
    'credit_card_name' => 'required|string',
    'credit_card_expiry' => 'required|string',
    'credit_card_cvv' => 'required|string',
]);
```

### Authorization Errors

```php
if ($request->user()->id !== $cartItem->farmer_id) {
    abort(403, 'This action is unauthorized.');
}
```

### Logging Strategy

The application uses Laravel's logging system with the following approach:

1. **Channel-based Logging**: Different log channels for different types of events
2. **Log Levels**: Appropriate logging levels based on severity
3. **Context Data**: Including relevant context with log entries
4. **Error Tracking**: Integration with error tracking services for production

## Performance Optimization Strategies

The backend implements several strategies to ensure optimal performance:

### Database Optimization

1. **Eager Loading**: Prevent N+1 query issues by eager loading relationships

    ```php
    $order->load(['items.product', 'statusHistory']);
    ```

2. **Indexing**: Key fields are indexed for faster queries

    ```php
    $table->index(['farmer_id', 'product_id']);
    ```

3. **Query Optimization**: Efficient queries with where clauses before joins
    ```php
    $query = Order::where('farmer_id', $request->user()->id);
    // Apply filters after the main where clause
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }
    ```

### Caching Strategies

1. **Query Caching**: Frequently-accessed data is cached
2. **Cache Tags**: Organized cache invalidation with tags
3. **Cache Drivers**: Configurable cache drivers (file, redis, memcached)

### Resource Management

1. **Pagination**: Results are paginated to limit resource usage

    ```php
    $orders = $query->paginate(10);
    ```

2. **Chunking**: Large data sets are processed in chunks

    ```php
    Order::chunk(100, function ($orders) {
        foreach ($orders as $order) {
            // Process each order
        }
    });
    ```

3. **Lazy Collections**: Memory-efficient processing of large datasets
    ```php
    Order::cursor()->each(function ($order) {
        // Process order
    });
    ```

### Geographic Optimization

The system includes optimized geographic queries for location-based features:

```php
public static function nearby($latitude, $longitude, $distance = 50)
{
    // Check if we're using SQLite (for development)
    $connection = config('database.default');
    $driver = config("database.connections.{$connection}.driver");

    if ($driver === 'sqlite') {
        // Simplified bounding box approach for SQLite
        $lat_distance = $distance / 111.0;
        $lng_distance = $distance / (111.0 * cos(deg2rad($latitude)));

        return self::select('*')
            ->whereBetween('latitude', [$latitude - $lat_distance, $latitude + $lat_distance])
            ->whereBetween('longitude', [$longitude - $lng_distance, $longitude + $lng_distance])
            ->where('status', 'available')
            ->orderByRaw("((latitude - $latitude) * (latitude - $latitude) + (longitude - $longitude) * (longitude - $longitude))");
    } else {
        // Haversine formula for production databases
        $haversine = "(
            6371 * acos(
                cos(radians($latitude))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians($longitude))
                + sin(radians($latitude))
                * sin(radians(latitude))
            )
        )";

        return self::selectRaw("*, $haversine AS distance")
            ->whereRaw("$haversine < ?", [$distance])
            ->where('status', 'available')
            ->orderBy('distance');
    }
}
```

## Security Implementations

FarmSmart implements several security measures to protect user data and system integrity:

### Authentication Security

1. **Password Hashing**: All passwords are hashed using Laravel's bcrypt implementation

    ```php
    'password' => Hash::make($request->password)
    ```

2. **CSRF Protection**: All forms and non-GET requests require CSRF tokens

    ```php
    @csrf // In blade templates
    ```

3. **Session Security**:
    - HTTP-only cookies
    - Session regeneration on login
    - Secure, SameSite cookies in production
    ```php
    $request->session()->regenerate();
    ```

### Data Protection

1. **Input Validation**: All user input is validated before processing

    ```php
    $request->validate([
        'email' => 'required|string|lowercase|email|max:255|unique:users',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);
    ```

2. **Mass Assignment Protection**: Models use `$fillable` to prevent mass assignment vulnerabilities

    ```php
    protected $fillable = [
        'farmer_id',
        'product_id',
        'quantity',
        'unit_price',
        'discount_percentage',
        'total_price'
    ];
    ```

3. **SQL Injection Prevention**: Query builders and Eloquent prevent SQL injection

### Authorization Controls

1. **Policy-based Authorization**: Policies define who can perform what actions

    ```php
    return $user->id === $order->farmer_id;
    ```

2. **Resource Ownership Verification**: Controllers check ownership before allowing actions

    ```php
    if ($request->user()->id !== $cartItem->farmer_id) {
        abort(403, 'This action is unauthorized.');
    }
    ```

3. **Middleware Protection**: Routes are protected by middleware
    ```php
    Route::middleware(['auth', \App\Http\Middleware\EnsureFarmer::class])
        ->prefix('farmer')
        ->group(function () {
            // Protected routes
        });
    ```

### Sensitive Data Handling

1. **Sensitive Data Masking**: Sensitive data like payment information is not stored directly
2. **Environment Configuration**: Sensitive configuration is stored in environment variables
3. **Secure Headers**: Security headers prevent common attacks (XSS, clickjacking)

### Audit Trails

The system maintains audit trails for critical operations:

1. **Order Status History**: Complete history of order status changes

    ```php
    $statusHistory = new OrderStatusHistory();
    $statusHistory->order_id = $order->id;
    $statusHistory->status = 'pending';
    $statusHistory->note = 'Order placed successfully';
    $statusHistory->save();
    ```

2. **Login Attempts**: Failed login attempts are tracked
3. **System Changes**: Significant system changes are logged

---

This documentation provides a comprehensive overview of the FarmSmart backend architecture. It serves as a guide for developers working on the system and a reference for technical partners to understand the implementation details.
