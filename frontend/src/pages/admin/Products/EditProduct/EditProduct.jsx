import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { ProductForm } from '@/components/admin/products/ProductForm';
import { ChevronLeft, Clock, Eye, MoreVertical, Archive, Trash2, History, Save } from 'lucide-react';

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    axios.get(`/admin/products?id=${id}`),
                    axios.get('/categories'),
                ]);
                setProduct(productRes.data[0]);
                setCategories(categoriesRes.data.categories);
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBack = () => navigate('/admin/products');

    const handleSuccess = async (formData) => {
        try {
            await axios.put(`/admin/products/edit/${id}`, formData);
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating product');
        }
    };

    if (isLoading) return <div className="p-6">Loading...</div>;
    if (error)
        return (
            <Alert variant="destructive" className="m-6">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    if (!product)
        return (
            <Alert className="m-6">
                <AlertDescription>Product not found</AlertDescription>
            </Alert>
        );

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-background min-h-screen">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>

                <Card className="bg-card/50 border-muted">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{product.product_name}</CardTitle>
                                <CardDescription className="mt-1">Product ID: {product.product_id}</CardDescription>
                            </div>
                            <Badge variant={product.is_active ? 'success' : 'secondary'}>
                                {product.is_active ? 'Active' : 'Draft'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between py-2">
                            <div className="flex flex-col items-center px-4 text-center">
                                <span className="text-sm text-muted-foreground">Price</span>
                                <span className="font-medium mt-1">${product.product_price}</span>
                            </div>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col items-center px-4 text-center">
                                <span className="text-sm text-muted-foreground">Stock</span>
                                <span className="font-medium mt-1">{product.product_stock}</span>
                            </div>
                            <Separator orientation="vertical" />
                            <div className="flex flex-col items-center px-4 text-center">
                                <span className="text-sm text-muted-foreground">Category</span>
                                <span className="font-medium mt-1">{product.category_name}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <ProductForm initialData={product} categories={categories} onSuccess={handleSuccess} />
            </div>
        </div>
    );
}
