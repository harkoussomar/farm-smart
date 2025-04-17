import React from 'react';
import StatCard from './StatCard';
import SectionHeader from './SectionHeader';
import { ShoppingBag, Clock, BarChart2 } from 'lucide-react';

interface FarmerStatsSectionProps {
    totalOrders: number;
    pendingOrders: number;
    totalSpent: number | string;
}

const FarmerStatsSection = ({ totalOrders, pendingOrders, totalSpent }: FarmerStatsSectionProps) => {
    // Format total spent
    const formattedTotalSpent = `$${typeof totalSpent === 'string'
        ? parseFloat(totalSpent).toFixed(2)
        : (totalSpent as number).toFixed(2)}`;

    return (
        <div>
            <SectionHeader title="Your Farm Activity" />
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<ShoppingBag size={24} />}
                    delay={0.2}
                />
                <StatCard
                    title="Pending Orders"
                    value={pendingOrders}
                    icon={<Clock size={24} />}
                    delay={0.3}
                    color="var(--chart-4)"
                />
                <StatCard
                    title="Total Spent"
                    value={formattedTotalSpent}
                    icon={<BarChart2 size={24} />}
                    delay={0.4}
                    color="var(--chart-1)"
                />
            </div>
        </div>
    );
};

export default FarmerStatsSection;