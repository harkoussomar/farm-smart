import React from 'react';
import StatCard from './StatCard';
import SectionHeader from './SectionHeader';
import { DollarSign, Percent, CheckSquare } from 'lucide-react';

interface ClientStatsSectionProps {
    totalSales: number;
    completedOrders: number;
    totalProfit: number | string;
}

const ClientStatsSection = ({ totalSales, completedOrders, totalProfit }: ClientStatsSectionProps) => {
    // Format total profit
    const formattedTotalProfit = `$${typeof totalProfit === 'string'
        ? parseFloat(totalProfit).toFixed(2)
        : (totalProfit as number).toFixed(2)}`;

    return (
        <div>
            <SectionHeader title="Client Activity" className="mt-8 md:mt-0" delay={0.55} />
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Sales"
                    value={totalSales}
                    icon={<DollarSign size={24} />}
                    delay={0.5}
                    color="var(--chart-2)"
                />
                <StatCard
                    title="Completed Orders"
                    value={completedOrders}
                    icon={<CheckSquare size={24} />}
                    delay={0.7}
                    color="var(--chart-5)"
                />
                <StatCard
                    title="Total Profit"
                    value={formattedTotalProfit}
                    icon={<Percent size={24} />}
                    delay={0.6}
                    color="var(--chart-3)"
                />
            </div>
        </div>
    );
};

export default ClientStatsSection;