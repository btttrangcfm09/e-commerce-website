// AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/api';
import { ProductForm } from '@/components/admin/products/ProductForm';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import styles from './AddProduct.module.css';

const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
};

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data.categories);
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            const response = await axiosInstance.post('/admin/products/add', formData);
            
            if (response.data) {
                navigate('/admin/products');
            }
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to add product');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.breadcrumbSection}>
                    <Button
                        variant="ghost"
                        className={styles.backButton}
                        onClick={() => navigate('/admin/products')}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive" className={styles.errorAlert}>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className={styles.formSection}>
                <ProductForm
                    categories={categories}
                    onSuccess={handleSubmit}
                />
            </div>
        </div>
    );
};

export default AddProduct;