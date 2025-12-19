import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import OrderDetails from '@/components/admin/orders/OrderDetails/OrderDetails';
import axiosInstance from '@/services/api';

const OrderDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axiosInstance.post(`/admin/orders/${id}`);
                setOrder(response.data.message);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                            <h2 className="text-lg font-semibold">Error Loading Order</h2>
                            <p className="text-sm text-muted-foreground">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/orders')}
                className="mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
            </Button>

            <OrderDetails order={order} />
        </div>
    );
};

export default OrderDetailsPage;