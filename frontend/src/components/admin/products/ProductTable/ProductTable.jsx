import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import styles from './ProductTable.module.css';

const ProductTable = ({
    products,
    pagination,
    onPageChange,
    onSort,
    currentSort,
    onProductDeleted
}) => {
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
        if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-500' };
        return { label: 'In Stock', color: 'bg-green-500' };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        
        setIsDeleting(true);
        try {
            await axios.delete(`/admin/products/${productToDelete.product_id}`);
            setShowDeleteDialog(false);
            setProductToDelete(null);
            // Notify parent to refresh list
            if (onProductDeleted) {
                onProductDeleted();
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            alert(err.response?.data?.message || 'Error deleting product');
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className={styles.tableContainer}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => {
                        const stockStatus = getStockStatus(product.product_stock);
                        return (
                            <TableRow key={product.product_id}>
                                <TableCell>
                                    <div className={styles.productInfo}>

                                        <div className="flex flex-col">
                                            <span className={styles.productName}>{product.product_name}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{product.category_name}</TableCell>
                                <TableCell>{formatCurrency(product.product_price)}</TableCell>
                                <TableCell>{product.product_stock}</TableCell>
                                <TableCell>
                                    <Badge className={stockStatus.color}>
                                        {stockStatus.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => navigate(`/admin/products/edit/${product.product_id}`)}
                                            >
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteClick(product)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {pagination && (
                <div className="flex items-center justify-between p-4 border-t">
                    <span className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => onPageChange(pagination.page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => onPageChange(pagination.page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{productToDelete?.product_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Product'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProductTable;