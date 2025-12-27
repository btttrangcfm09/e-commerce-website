import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaHeart, FaMinus, FaPlus, FaTruck, FaUndo } from 'react-icons/fa';
import useProductsById from '@/hooks/useProductsById';
import { useCartQuery } from '@/hooks/useCart';
import { useTrackProductView } from '@/hooks/useRecommendations';
import Banner from '@/components/common/Banner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { API_URL } from '@/utils/constants';
import FavoriteButton from '@/components/features/favorites/FavoriteButton';
import { ProductRecommendations } from '@/components/features/recommendations';

// Hàm xử lý URL ảnh từ backend
const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads')) {
        const backendUrl = API_URL || 'http://localhost:3000';
        return `${backendUrl}${imageUrl}`;
    }
    return imageUrl;
};

const ProductDetail = () => {
    const { id } = useParams();
    const { product, loading: isLoading } = useProductsById(id);
    const { addItem } = useCartQuery();
    const { trackView } = useTrackProductView();

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);

    // Map database fields to frontend format
    const mappedProduct = product ? {
        id: product.product_id,
        name: product.product_name,
        description: product.product_description,
        price: product.product_price,
        stock: product.product_stock,
        images: (product.product_image_urls || []).map(url => normalizeImageUrl(url)).filter(Boolean),
        categoryId: product.category_id,
        categoryName: product.category_name,
        isActive: product.is_active
    } : null;

    useEffect(() => {
        if (mappedProduct?.images?.length > 0) {
            setSelectedImage(mappedProduct.images[0]);
        }
        
        // Track product view when product loads
        if (id) {
            trackView(parseInt(id));
        }
    }, [product, id]);

    const handleQuantityChange = (e) => {
        setQuantity(Math.max(1, Math.floor(e.target.value)));
    };

    const handleBuyNow = async () => {
        const isAuthenticated = !!localStorage.getItem('auth');
        
        if (!isAuthenticated) {
            showToast('Please login to add items to cart', 'warning');
            return;
        }

        try {
            await addItem({ productId: id, quantity });
            showToast(`${quantity} item(s) added to cart!`, 'success');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            showToast('Failed to add to cart. Please try again.', 'error');
        }
    };

    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    };

    if (isLoading) return <LoadingSpinner />;
    if (!mappedProduct) return <div className="text-center text-red-600 py-10">Product not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 pb-10">
            <Banner />

            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white shadow-lg rounded-lg p-6">
                        {/* Thumbnails */}
                        <div className="col-span-2 hidden lg:block overflow-hidden max-h-[600px]">
                            <div className="h-full overflow-y-auto space-y-4 pr-2">
                                {mappedProduct.images?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${mappedProduct.name} - View ${index + 1}`}
                                        className={`cursor-pointer rounded-lg border ${
                                            selectedImage === image ? 'border-rose-500' : 'border-gray-300'
                                        }`}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="col-span-1 lg:col-span-5 flex items-center justify-center max-h-[600px]">
                            <img
                                src={selectedImage || mappedProduct.images?.[0]}
                                alt={mappedProduct.name}
                                className="w-full h-auto max-h-full rounded-lg object-contain"
                            />
                        </div>

                        {/* Details */}
                        <div className="col-span-1 lg:col-span-5 flex flex-col gap-5">
                            <h2 className="text-black text-2xl font-semibold">{mappedProduct.name}</h2>

                            {/* Price & Stock */}
                            <div className="flex flex-wrap items-center justify-between">
                                <span className="text-black text-2xl">${mappedProduct.price}</span>
                                <span className={`text-sm ${mappedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {mappedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-black text-sm">{mappedProduct.description}</p>

                            {/* Quantity Selector */}
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="border px-3 py-3 rounded"
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="border px-2 py-2 text-center w-16"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="border px-3 py-3 rounded"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!mappedProduct.stock}
                                    className="bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600 disabled:bg-gray-400"
                                >
                                    Add to Cart
                                </button>

                                <FavoriteButton productId={mappedProduct.id} size="lg" />
                            </div>

                            {/* Delivery Info */}
                            <div className="border rounded p-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <FaTruck className="text-xl" />
                                    <div>
                                        <p className="font-medium">Free Delivery</p>
                                        <p className="text-sm text-gray-500">
                                            Enter your postal code for delivery availability
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaUndo className="text-xl" />
                                    <div>
                                        <p className="font-medium">Free Returns</p>
                                        <p className="text-sm text-gray-500">Free 30 Days Delivery Returns</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Recommendations - "Customers Also Liked" */}
            {mappedProduct && (
                <ProductRecommendations 
                    type="product-page"
                    params={{ productId: id }}
                    limit={8}
                    columns={4}
                    className="bg-gray-50"
                />
            )}

            {/* Recently Viewed Products (if user is logged in) */}
            <ProductRecommendations 
                type="recently-viewed"
                title="Sản phẩm bạn đã xem"
                description="Các sản phẩm bạn đã xem gần đây"
                limit={6}
                columns={6}
                className="bg-white"
            />
        </div>
    );
};

export default ProductDetail;
