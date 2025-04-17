export interface ProductType {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image_path: string;
    sku: string;
    stock_quantity: number;
    product_type: ProductType;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
    unit_price: number;
    discount_percentage: number;
    total_price: number;
}

export interface CartSummaryProps {
    cartTotal: number;
    cartSavings: number;
    processing: boolean;
}