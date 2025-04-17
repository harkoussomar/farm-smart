export interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    stock_quantity: number;
    images?: Array<{
        id: number;
        url: string;
    }>;
    volume_discounts?: Array<{
        id: number;
        minimum_quantity: number;
        discount_percentage: number;
    }>;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_path: string;
        sku: string;
        stock_quantity: number;
        product_type: {
            id: number;
            name: string;
        };
    };
    unit_price: number;
    discount_percentage: number;
    total_price: number;
}
