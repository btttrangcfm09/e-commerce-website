import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
    TrendingUp, 
    TrendingDown,
    Users,
    ShoppingCart,
    DollarSign,
    Package
} from "lucide-react";
import styles from './StatsCards.module.css';

const statsConfig = [
    {
        title: 'Total Revenue',
        icon: DollarSign,
        value: '$0',
        background: 'bg-green-100',
        color: 'text-green-600',
        trend: 'up',
        change: '12%',
        description: 'Revenue this month'
    },
    {
        title: 'Total Orders',
        icon: ShoppingCart,
        value: '0',
        background: 'bg-blue-100',
        color: 'text-blue-600',
        trend: 'up',
        change: '8%',
        description: 'Orders this month'
    },
    {
        title: 'Active Customers',
        icon: Users,
        value: '0',
        background: 'bg-purple-100',
        color: 'text-purple-600',
        trend: 'up',
        change: '5%',
        description: 'Customers this month'
    },
    {
        title: 'Low Stock Products',
        icon: Package,
        value: '0',
        background: 'bg-orange-100',
        color: 'text-orange-600',
        trend: 'down',
        change: '3%',
        description: 'Products below threshold'
    }
];

const StatsCards = ({ data }) => {
    const mappedStats = statsConfig.map(stat => {
        let value = '0';
        switch (stat.title) {
            case 'Total Revenue':
                value = `$${Number(data.total_revenue).toLocaleString()}`;
                break;
            case 'Total Orders':
                value = data.total_orders;
                break;
            case 'Active Customers':
                value = data.active_customers;
                break;
            case 'Low Stock Products':
                value = data.low_stock_products;
                break;
        }
        return { ...stat, value };
    });

    const TrendIcon = ({ trend }) => (
        trend === "up" 
            ? <TrendingUp className="h-4 w-4 text-green-600" />
            : <TrendingDown className="h-4 w-4 text-red-600" />
    );

    return (
        <div className={styles.statsGrid}>
            {mappedStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className={styles.statsCard}>
                        <CardContent className="pt-6">
                            <div className={styles.cardHeader}>
                                <div className={`${styles.iconWrapper} ${stat.background}`}>
                                    <Icon className={`${styles.icon} ${stat.color}`} />
                                </div>
                                <div className={styles.trendWrapper}>
                                    <TrendIcon trend={stat.trend} />
                                    <span className={stat.trend === "up" ? styles.trendUp : styles.trendDown}>
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.valueWrapper}>
                                    <h3 className={styles.value}>{stat.value}</h3>
                                    <p className={styles.title}>{stat.title}</p>
                                </div>
                                <p className={styles.description}>{stat.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsCards;