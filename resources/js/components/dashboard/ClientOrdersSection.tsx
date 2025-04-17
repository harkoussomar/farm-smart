import React from 'react';
import { motion } from 'framer-motion';
import ClientOrdersTable from '../../components/ClientOrdersTable';

interface ClientOrderItem {
    id: number;
    order_number: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    created_at: string;
    delivery_date?: string;
    status: string;
    total_amount: number;
    items: {
        id: number;
        crop_id: number;
        crop_name: string;
        quantity: number;
        price: number;
    }[];
}

interface ClientOrdersSectionProps {
    clientOrders: ClientOrderItem[];
}

const ClientOrdersSection = ({ clientOrders }: ClientOrdersSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <ClientOrdersTable
                orders={clientOrders}
                title="Recent Client Orders"
                viewAllLink="/farmer/crops?tab=orders"
                emptyStateMessage="You have no client orders yet"
            />
        </motion.div>
    );
};

export default ClientOrdersSection;