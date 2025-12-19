import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { SalesChart } from '@/components/admin/dashboard/SalesChart';
import { RecentOrders } from '@/components/admin/dashboard/RecentOrders';
import styles from './Dashboard.module.css';
import { useRecentOrders, useSalesChart, useStats } from '@/hooks/useAdmin';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const Dashboard = () => {
    const [timeRange, setTimeRange] = React.useState('7');
    let days;
    switch (timeRange) {
        case '7':
            days = 7;
            break;
        case '30':
            days = 30;
            break;
        case '90':
            days = 90;
            break;
        default:
            days = 7;
    }
    const { 
        data: orders = [], 
        loading: ordersLoading, 
        error: ordersError 
    } = useRecentOrders(10);

    const { 
        data: salesData, 
        loading: salesLoading, 
        error: salesError 
    } = useSalesChart(days);

    const { 
        data: stats, 
        loading: statsLoading, 
        error: statsError 
    } = useStats();

    if (ordersLoading || salesLoading || statsLoading) {
        return <LoadingSpinner />;
    }

    const hasError = ordersError || salesError || statsError;
    if (hasError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {ordersError || salesError || statsError}
                </AlertDescription>
            </Alert>
        );
    }
    return (
        <div className={styles.container}>
            {/* Stats Overview */}
            <section className={styles.statsSection}>
                <StatsCards data={stats} />
            </section>

            {/* Sales Chart */}
            <section className={styles.chartSection}>
                <SalesChart data={salesData} timeRange={timeRange} onTimeRangeChange={setTimeRange}/>
            </section>

            {/* Recent Orders */}
            <section className={styles.ordersSection}>
                <RecentOrders data={orders}/>
            </section>
        </div>
    );
};

export default Dashboard;