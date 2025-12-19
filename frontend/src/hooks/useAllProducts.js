import { useState, useEffect } from "react";
import axiosInstance from "@/services/api";

const useAllProducts = (currentPage = 1, itemsPerPage = 10, searchQuery = "", categoryName = null, minPrice = null, maxPrice = null, sortBy = 'id', sortOrder = 'asc') => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/products`, {
          params: {
            search: searchQuery,
            categoryId: categoryName || null,
            minPrice,
            maxPrice,
            page: currentPage,
            pageSize: itemsPerPage,
            sortBy,
            sortOrder,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const { products: fetchedProducts, pagination: fetchedPagination } = response.data; // Destructure response data
        setProducts(fetchedProducts); // Set products from response
        setPagination(fetchedPagination); // Set pagination info from response
      } catch (err) {
        if (axiosInstance.isAxiosError(err)) {
          console.error("Axios error:", err.response ? err.response.data : err.message);
          setError(err.response?.data?.message || "Failed to fetch products. Please try again.");
        } else {
          console.error("Unexpected error:", err);
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, itemsPerPage, searchQuery, categoryName, minPrice, maxPrice, sortBy, sortOrder]); // Add all relevant dependencies

  return { products, pagination, loading, error }; // Return pagination info along with products
};

export default useAllProducts;
