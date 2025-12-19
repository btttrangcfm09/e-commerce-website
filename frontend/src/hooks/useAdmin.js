// hooks/useDashboard.js
import { useState, useEffect } from 'react';
import axiosInstance from '@/services/api';

export const useRecentOrders = (limit = 10) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/dashboard/recent-order', {
                    params: { limit },
                });
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [limit]);

    return { data, loading, error };
};

export const useSalesChart = (days = 7) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/dashboard/stat-chart', {
                    params: { days },
                });
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch sales data');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [days]);

    return { data, loading, error };
};

export const useStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/dashboard/stat-overview');
                setData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, loading, error };
};
