import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/api";
import Fashion from "@/assets/homepage/Categories/fashion.jpg";
import Electronics from "@/assets/homepage/Categories/electronics.jpg";
import HomeAppliances from "@/assets/homepage/Categories/home_appliances.jpg";
import Foods from "@/assets/homepage/Categories/foods.jpg";
import Cosmetics from "@/assets/homepage/Categories/cosmetics.jpg";
import Litterature from "@/assets/homepage/Categories/litterature.jpg";
import Furniture from "@/assets/homepage/Categories/furnitures.jpg";
import { API_URL } from "@/utils/constants";

const categoryImages = {
  "Fashion": Fashion,
  "Clothing": Fashion,
  "Electronics": Electronics,
  "Home Appliances": HomeAppliances,
  "Home & Living": HomeAppliances,
  "Food": Foods,
  "Foods": Foods,
  "Books & Stationery": Litterature,
  "Books": Litterature,
  "Furniture": Furniture,
  "Cosmetics": Cosmetics,
};

// Hàm xử lý URL ảnh từ backend
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://via.placeholder.com/300x200";
  if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads')) {
    const backendUrl = API_URL || 'http://localhost:3000';
    return `${backendUrl}${imageUrl}`;
  }
  return imageUrl;
};

export const useHomeLogic = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [statistics, setStatistics] = useState([
    { value: "0", label: "Products" },
    { value: "0", label: "Categories" },
    { value: "0+", label: "Customers" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, bestSellingRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/products", { params: { pageSize: 100, page: 1 } }),
          axiosInstance.get("/products/best-selling", { params: { limit: 8 } })
        ]);

        const fetchedCategories = categoriesRes.data.categories || [];
        const fetchedProducts = productsRes.data.products || [];
        const fetchedBestSelling = bestSellingRes.data.products || [];

        const parentCategories = fetchedCategories.filter(cat => !cat.parent_category_id);
        
        const formattedCategories = parentCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          image: categoryImages[cat.name] || Electronics,
          description: `Explore our collection of ${cat.name.toLowerCase()} products.`
        }));

        const formattedProducts = fetchedProducts.map(product => ({
          id: product.product_id,
          name: product.product_name,
          image: normalizeImageUrl(product.product_image_urls?.[0]),
          price: parseFloat(product.product_price).toFixed(2),
          description: product.product_description || "No description available.",
          categoryId: product.category_id
        }));

        const formattedBestSelling = fetchedBestSelling.map(product => ({
          id: product.product_id,
          name: product.product_name,
          image: normalizeImageUrl(product.product_image_urls?.[0]),
          price: parseFloat(product.product_price).toFixed(2),
          description: product.product_description || "No description available.",
          categoryId: product.category_id,
          totalSold: product.total_sold
        }));

        const shuffledProducts = [...formattedProducts].sort(() => Math.random() - 0.5);

        setCategories(formattedCategories);
        setProducts(shuffledProducts);
        setBestSellingProducts(formattedBestSelling.length > 0 ? formattedBestSelling : shuffledProducts.slice(0, 4));
        setStatistics([
          { value: `${fetchedProducts.length}+`, label: "Products" },
          { value: `${parentCategories.length}+`, label: "Categories" },
          { value: "1000+", label: "Customers" },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExploreMore = () => {
    navigate("/shop");
  };

  return {
    handleExploreMore,
    statistics,
    categories,
    products,
    bestSellingProducts,
    loading,
  };
};

export {default} from '@/pages/client/Home/Home';
