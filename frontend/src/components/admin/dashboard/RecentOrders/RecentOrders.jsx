import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const RecentOrders = ({ data = [] }) => {
    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatCustomerName = (customerInfo) => {
        if (!customerInfo) return 'N/A';
        const { first_name, last_name } = customerInfo;
        return `${first_name} ${last_name}`.trim() || customerInfo.username || 'N/A';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                <div className="flex gap-2">
                    <Badge variant="outline">{data.length} orders</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((order) => (
                                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{formatCustomerName(order.customer_info)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.customer_info?.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatPrice(order.total_price)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(order.order_status)}>
                                            {order.order_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(order.payment_status)}>
                                            {order.payment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentOrders;