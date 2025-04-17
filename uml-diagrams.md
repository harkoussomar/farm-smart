# FarmSmart UML Diagrams

This document contains UML diagrams showing the architecture and relationships in the FarmSmart application.

## Class Diagram

```mermaid
classDiagram
    %% User and Authentication
    class User {
        +id: int
        +name: string
        +email: string
        +password: string
        +type: string
        +registerFarmer()
        +loginFarmer()
        +logoutFarmer()
    }

    %% Farm Management
    class FarmProfile {
        +id: int
        +farmer_id: int
        +farm_name: string
        +address: string
        +latitude: decimal
        +longitude: decimal
        +size: decimal
        +size_unit: string
        +createProfile()
        +updateProfile()
        +getProfileDetails()
    }

    class FarmPhoto {
        +id: int
        +farm_profile_id: int
        +file_path: string
        +file_name: string
        +file_size: int
        +is_primary: boolean
        +uploadPhoto()
        +deletePhoto()
        +setPrimaryPhoto()
    }

    class FarmSection {
        +id: int
        +farm_profile_id: int
        +name: string
        +description: string
        +size: decimal
        +crop_type: string
        +soil_type: string
        +section_type: string
        +addSection()
        +updateSection()
        +deleteSection()
    }

    class FarmSensorData {
        +id: int
        +farm_section_id: int
        +temperature: decimal
        +humidity: decimal
        +soil_moisture: decimal
        +light_intensity: decimal
        +timestamp: datetime
        +recordSensorData()
        +getHistoricalData()
    }

    %% Product Management
    class ProductType {
        +id: int
        +name: string
        +description: string
        +slug: string
        +getProductTypes()
    }

    class Product {
        +id: int
        +name: string
        +description: string
        +price: decimal
        +product_type_id: int
        +image_path: string
        +sku: string
        +stock_quantity: int
        +getProducts()
        +getProductDetails()
    }

    class VolumeDiscount {
        +id: int
        +product_id: int
        +minimum_quantity: int
        +discount_percentage: decimal
        +getApplicableDiscount()
    }

    %% Order Management
    class CartItem {
        +id: int
        +farmer_id: int
        +product_id: int
        +quantity: int
        +unit_price: decimal
        +discount_percentage: decimal
        +total_price: decimal
        +addToCart()
        +updateCartItem()
        +removeFromCart()
    }

    class Order {
        +id: int
        +farmer_id: int
        +order_number: string
        +status: string
        +total_amount: decimal
        +delivery_address: string
        +payment_status: string
        +placeOrder()
        +getOrderDetails()
        +updateOrderStatus()
    }

    class OrderItem {
        +id: int
        +order_id: int
        +product_id: int
        +quantity: int
        +unit_price: decimal
        +discount_percentage: decimal
        +total_price: decimal
    }

    class OrderStatusHistory {
        +id: int
        +order_id: int
        +status: string
        +note: string
        +timestamp: datetime
        +recordStatusChange()
    }

    %% Crops Marketplace
    class Crop {
        +id: int
        +farmer_id: int
        +name: string
        +description: string
        +quantity: decimal
        +unit: string
        +price: decimal
        +harvest_date: date
        +status: string
        +listCrop()
        +updateCropDetails()
        +markAsSold()
        +deleteCropListing()
    }

    %% Relationships
    User "1" -- "1" FarmProfile : has
    FarmProfile "1" -- "*" FarmPhoto : contains
    FarmProfile "1" -- "*" FarmSection : has
    FarmSection "1" -- "*" FarmSensorData : produces
    User "1" -- "*" CartItem : has in cart
    User "1" -- "*" Order : places
    Order "1" -- "*" OrderItem : contains
    Order "1" -- "*" OrderStatusHistory : tracks
    ProductType "1" -- "*" Product : categorizes
    Product "1" -- "*" VolumeDiscount : offers
    Product "1" -- "*" CartItem : added to
    Product "1" -- "*" OrderItem : purchased as
    User "1" -- "*" Crop : lists
```

## Component Diagram

```mermaid
graph TD
    subgraph "Frontend (React)"
        subgraph "Authentication"
            Login
            Registration
        end
        subgraph "Farm Management"
            FarmProfile
            FarmSections
        end
        subgraph "Farm Visualization"
            DataDashboard
            MapVisualization
        end
        subgraph "Products"
            ProductCatalog
            ProductDetails
        end
        subgraph "Cart & Checkout"
            ShoppingCart
            Checkout
        end
        subgraph "Orders"
            OrderHistory
            OrderDetails
        end
        subgraph "Crops Marketplace"
            CropListing
            CropDetails
        end
        subgraph "UI Components"
            Header
            Footer
            Forms
            Charts
        end
    end

    subgraph "Backend (Laravel)"
        subgraph "Auth Controllers"
            FarmerAuthController
        end
        subgraph "API Controllers"
            FarmProfileController
            FarmSectionController
            FarmVisualizationController
            ProductController
            CartController
            OrderController
            CropController
        end
        subgraph "Models"
            User
            FarmProfile
            FarmSection
            Product
            Order
            Crop
        end
        subgraph "Middleware"
            AuthMiddleware[Authentication]
            EnsureFarmer
        end
        subgraph "Services"
            BusinessLogic
        end
    end

    subgraph "Database"
        SQLite
    end

    Frontend["Frontend (React)"] --> Backend["Backend (Laravel)"]
    Backend --> Database
```

## Sequence Diagram - Order Placement

```mermaid
sequenceDiagram
    participant Farmer
    participant Frontend
    participant Cart
    participant OrderController
    participant OrderModel
    participant Database

    Farmer->>Frontend: Browse products
    Frontend->>Farmer: Display product catalog
    Farmer->>Frontend: Add product to cart
    Frontend->>Cart: addToCart(product, quantity)
    Cart->>Frontend: Update cart UI

    Farmer->>Frontend: Proceed to checkout
    Frontend->>Farmer: Display checkout form
    Farmer->>Frontend: Enter shipping and payment details
    Frontend->>OrderController: POST /farmer/orders

    OrderController->>OrderController: Validate input
    OrderController->>OrderModel: createOrder(data)
    OrderModel->>Database: Begin transaction
    OrderModel->>Database: Insert order record
    OrderModel->>Database: Insert order items
    OrderModel->>Database: Insert order status history
    OrderModel->>Database: Update product inventory
    OrderModel->>Database: Commit transaction

    Database->>OrderModel: Confirm success
    OrderModel->>OrderController: Return order details
    OrderController->>Frontend: Return success response
    Frontend->>Cart: clearCart()
    Frontend->>Farmer: Display order confirmation
```


## Use Case Diagram

```mermaid
graph TD
    Farmer[Farmer]

    subgraph FarmSmart
        A[Manage Farm Profile]
        B[Manage Farm Sections]
        C[View Farm Visualization]
        D[Browse Products]
        E[Manage Shopping Cart]
        F[Place Orders]
        G[Track Order Status]
        H[List Crops for Sale]
        I[Manage Crop Listings]
    end

    Farmer --> A
    Farmer --> B
    Farmer --> C
    Farmer --> D
    Farmer --> E
    Farmer --> F
    Farmer --> G
    Farmer --> H
    Farmer --> I

    Admin[Administrator]

    subgraph AdminFunctions
        J[Manage Products]
        K[Process Orders]
        L[View Sales Reports]
        M[Manage Farmers]
    end

    Admin --> J
    Admin --> K
    Admin --> L
    Admin --> M
```

## Activity Diagram - Registration and Farm Profile Setup

```mermaid
graph TD
    A[Start] --> B[Register Farmer Account]
    B --> C{Registration Successful?}
    C -->|Yes| D[Login]
    C -->|No| B
    D --> E[Create Farm Profile]
    E --> F[Add Farm Details]
    F --> G[Add Farm Location]
    G --> H[Upload Farm Photos]
    H --> I[Add Farm Sections]
    I --> J[Setup Complete]
```

## Deployment Diagram

```mermaid
graph TD
    subgraph "Client Side"
        A[Web Browser]
    end

    subgraph "Application Server"
        B[Laravel + React Application]
        C[Inertia.js]
        D[Node.js/Vite for Asset Building]
    end

    subgraph "Database Server"
        E[SQLite Database]
    end

    subgraph "File Storage"
        F[Farm Photos]
        G[Product Images]
    end

    A <--> B
    B <--> C
    B <--> D
    B <--> E
    B <--> F
    B <--> G
```
```