import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Package2, MapPin, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import OrdersService from '@/services/orders';
import { format } from 'date-fns';
import styles from './OrderDetail.module.css';

const getStatusBadgeStyle = (status) => {
  const normalizedStatus = String(status || '').toUpperCase();
  switch (normalizedStatus) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'PAID':
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'CANCELLED':
    case 'CANCELED':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'FAILED':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const formatStatus = (status) => {
  const s = String(status || '').trim();
  if (!s) return 'Unknown';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
  } catch {
    return dateString;
  }
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const data = await OrdersService.getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load order details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/account?section=my-orders')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
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
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/account?section=my-orders')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  const orderId_display = order?.order_id ?? order?.id ?? orderId;
  const createdAt = order?.created_at ?? order?.createdAt ?? order?.order_date;
  const orderStatus = order?.order_status ?? order?.status;
  const paymentStatus = order?.payment_status;
  const totalPrice = order?.total_price ?? order?.totalPrice ?? order?.total;
  const shippingAddress = order?.shipping_address ?? order?.shippingAddress;
  const items = order?.items ?? order?.orderItems ?? [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/account?section=my-orders')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Orders
      </Button>

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Order #{orderId_display}</h1>
            <p className={styles.date}>
              Placed on {formatDate(createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderStatus && (
              <Badge className={getStatusBadgeStyle(orderStatus)}>
                {formatStatus(orderStatus)}
              </Badge>
            )}
            {paymentStatus && (
              <Badge className={getStatusBadgeStyle(paymentStatus)}>
                Payment: {formatStatus(paymentStatus)}
              </Badge>
            )}
          </div>
        </div>

        <div className={styles.gridContainer}>
          {/* Shipping Address */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {shippingAddress || 'Not provided'}
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">{orderId_display}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total:</span>
                  <span>${Number(totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className={styles.fullWidth}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
              
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No items in this order</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => {
                          const itemId = item?.id ?? item?.order_item_id ?? idx;
                          const productName = item?.product_name ?? item?.name ?? 'Unknown Product';
                          const price = Number(item?.price ?? 0);
                          const quantity = Number(item?.quantity ?? 0);
                          const subtotal = price * quantity;

                          return (
                            <TableRow key={itemId}>
                              <TableCell className="font-medium">{productName}</TableCell>
                              <TableCell className="text-right">${price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">{quantity}</TableCell>
                              <TableCell className="text-right font-semibold">
                                ${subtotal.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.summaryTotal}>
                      <span className="text-lg">Total Amount</span>
                      <span className="text-xl font-bold">${Number(totalPrice || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
