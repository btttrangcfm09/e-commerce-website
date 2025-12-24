import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';
import OrderTable from '@/components/admin/orders/OrderTable/OrderTable';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import styles from './OrderList.module.css';

const MAX_PAGES = 50;
const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = [
    { value: 'ALL', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELED', label: 'Canceled' },
];

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('ALL');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const endpoint = `/admin/orders/list?offset=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}&status=${status !== 'ALL' ? status : ''}`;
            const { data } = await axiosInstance.post(endpoint);
            console.log(data);
            // Apply sorting
            const sortedOrders = [...data].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (sortConfig.key === 'created_at') {
                    return sortConfig.direction === 'asc' 
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }
                
                // For total_price
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            });

            setOrders(sortedOrders);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, status]);

    const handleSort = (key) => {
        if (!['total_price', 'created_at'].includes(key)) return;
        
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });

        const newSortedOrders = [...orders].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (key === 'created_at') {
                return sortConfig.key === key && sortConfig.direction === 'asc'
                    ? new Date(bValue) - new Date(aValue)
                    : new Date(aValue) - new Date(bValue);
            }

            return sortConfig.key === key && sortConfig.direction === 'asc'
                ? bValue - aValue
                : aValue - bValue;
        });

        setOrders(newSortedOrders);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Orders</h1>
            </div>

            <div className={styles.filters}>
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={styles.statusFilter}>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <OrderTable
                orders={orders}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}
                onViewOrder={(id) => navigate(`/admin/orders/${id}`)}
                onOrderDeleted={() => fetchOrders()}
            />

            {MAX_PAGES > 1 && (
                <div className={styles.pagination}>
                    <div className={styles.pageInfo}>
                        Page {page} of {MAX_PAGES}
                    </div>
                    <div className={styles.pageControls}>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(MAX_PAGES, p + 1))}
                            disabled={page === 50 || loading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;