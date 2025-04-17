import { motion } from 'framer-motion';
import OrderStatusChart from '../../components/OrderStatusChart';
import { Card, CardContent } from '../ui/card';
import ProfitExpensesChart from './ProfitExpensesChart';
import SectionHeader from './SectionHeader';

interface OrderStatusBreakdown {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

interface AnalyticsSectionProps {
    orderStatusBreakdown: OrderStatusBreakdown;
}

const AnalyticsSection = ({ orderStatusBreakdown }: AnalyticsSectionProps) => {
    return (
        <>
            <SectionHeader title="Analytics & Weather" className="mt-8" delay={0.65} />
            <div className="grid gap-6 md:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <OrderStatusChart data={orderStatusBreakdown} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="md:col-span-"
                >
                    <Card className="h-full">
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">Profit & Expenses Overview</h2>
                            <ProfitExpensesChart />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};

export default AnalyticsSection;
