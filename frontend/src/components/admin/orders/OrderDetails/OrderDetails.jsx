import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package2, CircleDollarSign } from 'lucide-react';
import { format } from 'date-fns';
import styles from './OrderDetails.module.css';

const getStatusBadgeStyle = (status) => {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'PAID':
            return 'bg-green-100 text-green-800';
        case 'FAILED':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const OrderDetails = ({ order }) => {
    if (!order) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Order #{order.id}</h1>
                    <p className={styles.date}>
                        Placed on {format(new Date(order.created_at), 'MMM d, yyyy, h:mm a')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge className={getStatusBadgeStyle(order.order_status)}>
                        {order.order_status}
                    </Badge>
                    <Badge className={getStatusBadgeStyle(order.payment_status)}>
                        {order.payment_status}
                    </Badge>
                </div>
            </div>

            <div className={styles.gridContainer}>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CircleDollarSign className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Order Information</h2>
                        </div>
                        <div className={styles.infoGrid}>
                            <div>
                                <p className={styles.label}>Customer ID</p>
                                <p className={styles.value}>{order.customer_id}</p>
                            </div>
                            <div>
                                <p className={styles.label}>Shipping Address</p>
                                <p className={styles.value}>{order.shipping_address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={styles.fullWidth}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package2 className="h-5 w-5" />
                            <h2 className="text-lg font-semibold">Order Items</h2>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.product_name}</TableCell>
                                        <TableCell>{item.product_id}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        <div className={styles.orderSummary}>
                            <div className={styles.summaryTotal}>
                                <span>Total Amount</span>
                                <span>${parseFloat(order.total_price).toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetails;