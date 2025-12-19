import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ProductImageUpload from '../ProductImageUpload/ProductImageUpload';
import { Save, X, Loader2 } from 'lucide-react';
import * as z from 'zod';
import styles from './ProductForm.module.css';

const productSchema = z.object({
    name: z
        .string()
        .min(2, 'Product name must be at least 2 characters')
        .max(255, 'Product name must be less than 255 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
        .transform((val) => parseFloat(val))
        .refine((val) => val >= 0, 'Price cannot be negative'),
    stock: z
        .string()
        .regex(/^\d+$/, 'Stock must be a whole number')
        .transform((val) => parseInt(val)),
    categoryId: z
        .string()
        .min(1, 'Category is required')
        .transform((val) => parseInt(val)),
});

export default function ProductForm({ initialData = null, categories = [], onSuccess }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.product_name || '',
            description: initialData?.product_description || '',
            price: initialData?.product_price?.toString() || '',
            stock: initialData?.product_stock?.toString() || '0',
            categoryId: initialData?.category_id?.toString() || '',
        },
    });

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            const data = {
                ...values,
                images: images // Array of base64 strings
            };
            
            await onSuccess(data);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };    

    const handleImageChange = (base64Images) => {
        setImages(base64Images);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{initialData ? 'Edit Product' : 'Add New Product'}</h1>
                    <p className={styles.subtitle}>
                        {initialData ? 'Update product details' : 'Create a new product listing'}
                    </p>
                </div>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => navigate('/admin/products')} disabled={isSubmitting}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Product
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter product name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Enter product description"
                                                className="min-h-[100px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" min="0" step="1" placeholder="0" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProductImageUpload
                                onChange={handleImageChange}
                                initialImages={initialData?.product_image_urls}
                            />
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
