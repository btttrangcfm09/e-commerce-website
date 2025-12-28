import { Link } from 'react-router-dom';
import { useCartQuery } from '@/hooks/useCart';
import placeholderImage from '@/assets/aboutpage/banner/ecommerce.jpg';
import { API_URL } from '@/utils/constants';

const ProductCard = ({ product }) => {
    // 1. Lấy thêm biến 'cart' từ hook để biết trong giỏ đang có gì
    const { addItem, cart } = useCartQuery();
    const backendUrl = API_URL || 'http://localhost:3000';
    
    let productImage = product.product_image_urls?.[0] || placeholderImage;
    if (productImage && typeof productImage === 'string' && productImage.startsWith('/uploads')) {
        productImage = `${backendUrl}${productImage}`;
    }

    const stock = product.stock ?? product.product_stock ?? 0;
    const isOutOfStock = stock <= 0;

    // Hàm hiển thị Toast thông báo lỗi (Tự tạo nhanh không cần thư viện)
    const showErrorToast = (message) => {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white bg-red-500 transform transition-all duration-300`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Tự biến mất sau 3 giây
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        // 2. Tìm xem sản phẩm này đã có bao nhiêu cái trong giỏ hàng rồi
        const cartItem = cart?.cart_items?.find(item => item.product_id === product.product_id);
        const currentQtyInCart = cartItem ? Number(cartItem.quantity) : 0;

        // 3. Kiểm tra logic: Nếu thêm 1 cái nữa mà vượt quá stock -> Chặn luôn & Báo lỗi
        if (currentQtyInCart + 1 > stock) {
            showErrorToast('Quantity exceeds available stock');
            return;
        }

        // Nếu thỏa mãn thì mới thêm
        addItem({ productId: parseInt(product.product_id), quantity: 1 });
    };

    return (
        <div className="bg-white shadow-sm border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col h-[420px]">
            <Link to={`/products/${product.product_id}`} className="block">
                <img
                    src={productImage}
                    alt={product.product_name}
                    className="h-48 w-full object-cover mb-4 rounded hover:scale-105 transition-transform duration-300"
                />
            </Link>

            <Link to={`/products/${product.product_id}`} className="block mb-2">
                <h3 className="text-gray-800 text-lg font-semibold leading-tight hover:text-rose-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                    {product.product_name}
                </h3>
            </Link>

            <div className="mb-2 flex items-center justify-between">
                <span className="text-rose-600 text-xl font-semibold">${product.product_price}</span>
                <span className="text-sm text-gray-500">
                    Stock: <span className="font-medium text-gray-700">{stock}</span>
                </span>
            </div>

            <p className="text-gray-600 text-sm leading-normal font-light line-clamp-3 mb-3 flex-grow">{product.product_description}</p>

            <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-2 rounded-lg transition-colors mt-auto ${
                    isOutOfStock 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default ProductCard;