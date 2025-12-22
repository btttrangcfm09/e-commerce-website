import { Link } from 'react-router-dom';
import { useCartQuery } from '@/hooks/useCart';
import placeholderImage from '@/assets/aboutpage/banner/ecommerce.jpg';

const ProductCard = ({ product }) => {
    const { addItem } = useCartQuery();
    const productImage = product.product_image_urls?.[0] || placeholderImage;

    const handleAddToCart = () => {
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

            <div className="mb-2">
                <span className="text-rose-600 text-xl font-semibold">${product.product_price}</span>
            </div>

            <p className="text-gray-600 text-sm leading-normal font-light line-clamp-3 mb-3 flex-grow">{product.product_description}</p>

            <button
                onClick={() => addItem({ productId: product.product_id, quantity: 1 })}
                className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors mt-auto"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
