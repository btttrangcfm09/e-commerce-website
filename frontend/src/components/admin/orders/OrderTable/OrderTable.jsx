import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, ArrowUpDown, Eye, Download, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import styles from './OrderTable.module.css';

const OrderTable = ({ orders = [], onSort, sortConfig, loading, onViewOrder }) => {
    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30',
            SHIPPED: 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30',
            DELIVERED: 'bg-green-500/20 text-green-700 hover:bg-green-500/30',
            CANCELED: 'bg-red-500/20 text-red-700 hover:bg-red-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className={styles.header}>
                            <TableHead onClick={() => onSort('id')} className={styles.headerCell}>
                                <div className={styles.headerContent}>
                                    ID <ArrowUpDown className={styles.sortIcon} />
                                </div>
                            </TableHead>
                            <TableHead onClick={() => onSort('customer_info.username')} className={styles.headerCell}>
                                <div className={styles.headerContent}>
                                    Customer <ArrowUpDown className={styles.sortIcon} />
                                </div>
                            </TableHead>
                            <TableHead onClick={() => onSort('created_at')} className={styles.headerCell}>
                                <div className={styles.headerContent}>
                                    Date <ArrowUpDown className={styles.sortIcon} />
                                </div>
                            </TableHead>
                            <TableHead>Shipping Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead onClick={() => onSort('total_price')} className={styles.headerCell}>
                                <div className={styles.headerContentRight}>
                                    Total <ArrowUpDown className={styles.sortIcon} />
                                </div>
                            </TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className={styles.emptyState}>
                                    No orders found
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className={styles.row}>
                                    <TableCell className={styles.idCell}>#{order.id}</TableCell>
                                    <TableCell>
                                        <div className={styles.customerInfo}>
                                            <span className={styles.customerName}>
                                                {order.customer_info.first_name} {order.customer_info.last_name}
                                            </span>
                                            <span className={styles.customerEmail}>
                                                {order.customer_info.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(order.created_at)}</TableCell>
                                    <TableCell className={styles.address}>
                                        {order.shipping_address}
                                    </TableCell>
                                    <TableCell>
                                        <div className={styles.statusContainer}>
                                            <Badge variant="secondary" className={getStatusColor(order.order_status)}>
                                                {order.order_status}
                                            </Badge>
                                            <Badge variant="secondary" className={getStatusColor(order.payment_status)}>
                                                {order.payment_status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className={styles.total}>
                                        ${Number(order.total_price).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className={styles.actionButton}>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className={styles.actionMenu}>
                                                <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                                                    <Eye className={styles.icon} />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className={styles.icon} />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className={styles.deleteAction}>
                                                    <Trash2 className={styles.icon} />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default OrderTable;