import React from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
    month: string;
    profit: number;
    expenses: number;
}

interface ProfitExpensesChartProps {
    data?: ChartData[];
}

const defaultData = [
    { month: 'Jan', profit: 4500, expenses: 3200 },
    { month: 'Feb', profit: 5200, expenses: 3400 },
    { month: 'Mar', profit: 4800, expenses: 3100 },
    { month: 'Apr', profit: 6100, expenses: 3600 },
    { month: 'May', profit: 5900, expenses: 3300 },
    { month: 'Jun', profit: 7200, expenses: 3800 },
];

const ProfitExpensesChart: React.FC<ProfitExpensesChartProps> = ({ data = defaultData }) => {
    return (
        <div className="relative h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                        }}
                        animationDuration={300}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="var(--chart-1)"
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        name="Profit"
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="var(--chart-4)"
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        name="Expenses"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfitExpensesChart;
