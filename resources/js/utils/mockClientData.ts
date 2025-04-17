import { ClientOrder } from '../components/ClientOrdersTable';

/**
 * Mock client data for testing client order management interfaces
 */
export const sampleClientOrders: ClientOrder[] = [
  {
    id: 1001,
    order_number: "CO-2023-1001",
    client_name: "Jane Cooper",
    client_email: "jane.cooper@example.com",
    client_phone: "+1 (555) 123-4567",
    created_at: "2023-11-15T08:30:00Z",
    delivery_date: "2023-11-20T14:00:00Z",
    status: "delivered",
    total_amount: 350.75,
    items: [
      {
        id: 1,
        crop_id: 101,
        crop_name: "Organic Wheat",
        quantity: 25,
        price: 10.50
      },
      {
        id: 2,
        crop_id: 102,
        crop_name: "Red Apples",
        quantity: 50,
        price: 1.25
      }
    ]
  },
  {
    id: 1002,
    order_number: "CO-2023-1002",
    client_name: "Robert Johnson",
    client_email: "robert.johnson@example.com",
    client_phone: "+1 (555) 234-5678",
    created_at: "2023-11-18T10:15:00Z",
    delivery_date: "2023-11-25T11:30:00Z",
    status: "processing",
    total_amount: 675.20,
    items: [
      {
        id: 3,
        crop_id: 103,
        crop_name: "Fresh Corn",
        quantity: 100,
        price: 2.50
      },
      {
        id: 4,
        crop_id: 105,
        crop_name: "Organic Soybeans",
        quantity: 75,
        price: 5.25
      }
    ]
  },
  {
    id: 1003,
    order_number: "CO-2023-1003",
    client_name: "Maria Garcia",
    client_email: "maria.garcia@example.com",
    client_phone: "+1 (555) 345-6789",
    created_at: "2023-11-20T14:45:00Z",
    delivery_date: "2023-11-27T09:00:00Z",
    status: "pending",
    total_amount: 423.50,
    items: [
      {
        id: 5,
        crop_id: 108,
        crop_name: "Premium Rice",
        quantity: 50,
        price: 8.47
      }
    ]
  },
  {
    id: 1004,
    order_number: "CO-2023-1004",
    client_name: "Ahmed Hassan",
    client_email: "ahmed.hassan@example.com",
    client_phone: "+1 (555) 456-7890",
    created_at: "2023-11-22T09:20:00Z",
    delivery_date: "2023-11-28T15:45:00Z",
    status: "shipped",
    total_amount: 892.75,
    items: [
      {
        id: 6,
        crop_id: 110,
        crop_name: "Organic Tomatoes",
        quantity: 150,
        price: 2.25
      },
      {
        id: 7,
        crop_id: 112,
        crop_name: "Sweet Potatoes",
        quantity: 100,
        price: 3.50
      },
      {
        id: 8,
        crop_id: 115,
        crop_name: "Bell Peppers",
        quantity: 75,
        price: 1.25
      }
    ]
  },
  {
    id: 1005,
    order_number: "CO-2023-1005",
    client_name: "Emma Wilson",
    client_email: "emma.wilson@example.com",
    client_phone: "+1 (555) 567-8901",
    created_at: "2023-11-23T11:30:00Z",
    status: "cancelled",
    total_amount: 215.25,
    items: [
      {
        id: 9,
        crop_id: 120,
        crop_name: "Fresh Strawberries",
        quantity: 30,
        price: 4.50
      },
      {
        id: 10,
        crop_id: 122,
        crop_name: "Blueberries",
        quantity: 20,
        price: 3.75
      }
    ]
  },
  {
    id: 1006,
    order_number: "CO-2023-1006",
    client_name: "Carlos Mendez",
    client_email: "carlos.mendez@example.com",
    client_phone: "+1 (555) 678-9012",
    created_at: "2023-11-25T13:15:00Z",
    delivery_date: "2023-12-02T10:30:00Z",
    status: "processing",
    total_amount: 560.80,
    items: [
      {
        id: 11,
        crop_id: 125,
        crop_name: "Green Beans",
        quantity: 40,
        price: 3.20
      },
      {
        id: 12,
        crop_id: 127,
        crop_name: "Spinach",
        quantity: 35,
        price: 2.75
      },
      {
        id: 13,
        crop_id: 130,
        crop_name: "Carrots",
        quantity: 60,
        price: 1.95
      }
    ]
  }
];

/**
 * Sample order status breakdown data
 */
export const sampleOrderStatusBreakdown = {
  pending: 8,
  processing: 12,
  shipped: 6,
  delivered: 24,
  cancelled: 3
};

/**
 * Sample stats data for dashboard
 */
export const sampleStats = {
  totalOrders: 53,
  pendingOrders: 8,
  totalSpent: 6835.45,
  totalSales: 4250, // quantity
  completedOrders: 24,
  totalProfit: 10580.75,
  orderStatusBreakdown: sampleOrderStatusBreakdown
};