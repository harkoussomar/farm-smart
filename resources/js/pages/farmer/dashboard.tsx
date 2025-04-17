import { Head } from '@inertiajs/react';
import FarmerLayout from '../../layouts/FarmerLayout';
import { sampleClientOrders, sampleStats } from '../../utils/mockClientData';

// Import dashboard components
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import FarmerStatsSection from '../../components/dashboard/FarmerStatsSection';
import ClientStatsSection from '../../components/dashboard/ClientStatsSection';
import RecentOrdersSection from '../../components/dashboard/RecentOrdersSection';
import ClientOrdersSection from '../../components/dashboard/ClientOrdersSection';
import NotificationsSection from '../../components/dashboard/NotificationsSection';
import AnalyticsSection from '../../components/dashboard/AnalyticsSection';

interface DashboardProps {
    farmer: {
        name: string;
    };
    recentOrders: Array<{
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        created_at: string;
    }>;
    stats: {
        totalOrders: number;
        pendingOrders: number;
        totalSpent: number;
        totalSales: number;
        completedOrders: number;
        totalProfit: number;
        orderStatusBreakdown: {
            pending: number;
            processing: number;
            shipped: number;
            delivered: number;
            cancelled: number;
        };
    };
    clientOrders?: Array<{
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
    }>;
}

const Dashboard = ({ farmer, recentOrders, stats, clientOrders = [] }: DashboardProps) => {
    // Create a default stats object that uses zeros for farmer-related stats
    // and sample data for client-related stats (which will be fetched from another app later)
    const defaultStats = {
        // Farmer stats - use real data or zeros
        totalOrders: stats?.totalOrders || 0,
        pendingOrders: stats?.pendingOrders || 0,
        totalSpent: stats?.totalSpent || 0,

        // Client stats - use sample data as these will come from another system later
        totalSales: stats?.totalSales || sampleStats.totalSales,
        completedOrders: stats?.completedOrders || sampleStats.completedOrders,
        totalProfit: stats?.totalProfit || sampleStats.totalProfit,
        orderStatusBreakdown: stats?.orderStatusBreakdown || sampleStats.orderStatusBreakdown
    };

    // Use sample client orders as they will be fetched from another system later
    const displayClientOrders = clientOrders.length > 0 ? clientOrders : sampleClientOrders;

    return (
        <FarmerLayout>
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">
                {/* Dashboard Header with Greeting */}
                <DashboardHeader farmerName={farmer.name} />
                <div className="grid gap-6 md:grid-cols-2 ">
                    {/* Farmer Stats Section */}
                    <FarmerStatsSection
                        totalOrders={defaultStats.totalOrders}
                        pendingOrders={defaultStats.pendingOrders}
                        totalSpent={defaultStats.totalSpent}
                    />

                    {/* Client Stats Section */}
                    <ClientStatsSection
                        totalSales={defaultStats.totalSales}
                        completedOrders={defaultStats.completedOrders}
                        totalProfit={defaultStats.totalProfit}
                    />
                </div>

                {/* Recent Orders and Client Orders Tables */}
                <div className="grid gap-6 md:grid-cols-2">
                    <RecentOrdersSection orders={recentOrders} />
                    <ClientOrdersSection clientOrders={displayClientOrders} />
                </div>

                {/* Notifications and Quick Actions Section */}
                <NotificationsSection />

                {/* Analytics and Weather Section */}
                <AnalyticsSection orderStatusBreakdown={defaultStats.orderStatusBreakdown} />
            </div>
        </FarmerLayout>
    );
};

export default Dashboard;
