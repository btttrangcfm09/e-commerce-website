import { useState, useEffect } from "react";
import axiosInstance from "@/services/api";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/categories`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Set categories from response
        setCategories(response.data.categories); // Adjust according to your API response structure
      } catch (err) {
        if (axiosInstance.isAxiosError(err)) {
          console.error("Axios error:", err.response ? err.response.data : err.message);
        } else {
          console.error("Unexpected error:", err);
        }
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this effect runs once on mount

  return { categories, loading, error }; // Return categories along with loading and error states
};

export default useCategories;
