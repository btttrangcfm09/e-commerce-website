import { useNavigate } from "react-router-dom";
import Fashion from "@/assets/homepage/Categories/fashion.jpg";
import Electronics from "@/assets/homepage/Categories/electronics.jpg";
import HomeAppliances from "@/assets/homepage/Categories/home_appliances.jpg";
import Foods from "@/assets/homepage/Categories/foods.jpg";
import Cosmetics from "@/assets/homepage/Categories/cosmetics.jpg";
import Litterature from "@/assets/homepage/Categories/litterature.jpg";
import Furniture from "@/assets/homepage/Categories/furnitures.jpg";

import WirelessEarbuds from "@/assets/homepage/Products/wireless_earbuds.jpg";
import TV from "@/assets/homepage/Products/TV_4K.jpg";
import SnackBar from "@/assets/homepage/Products/snack_bar.jpg";
import SportsShoes from "@/assets/homepage/Products/shoes.jpg";
import HairDryer from "@/assets/homepage/Products/hair_dryer.jpg";
import GamingLaptop from "@/assets/homepage/Products/gaming_laptop.jpg";
import Drawer from "@/assets/homepage/Products/drawer.jpg";
import Candle from "@/assets/homepage/Products/candle.jpg";
import Book from "@/assets/homepage/Products/book.jpg";

export const useHomeLogic = () => {
  const navigate = useNavigate();

  const handleExploreMore = () => {
    navigate("/shop");
  };

  const statistics = [
    { value: "1000+", label: "Products" },
    { value: "500+", label: "Brands" },
    { value: "1000+", label: "Customers" },
  ];

  const categories = [
    {
      name: "Fashion",
      image: Fashion,
      description: "Stylish clothing and accessories for every season.",
    },
    {
      name: "Electronics",
      image: Electronics,
      description: "Latest gadgets and devices to keep you connected.",
    },
    {
      name: "Home Appliances",
      image: HomeAppliances,
      description: "Upgrade your home with our premium appliances.",
    },
    {
      name: "Foods",
      image: Foods,
      description: "Delicious and healthy foods for every meal.",
    },
    {
      name: "Books & Stationery",
      image: Litterature,
      description: "Books and stationery for your reading and writing needs.",
    },
    {
      name: "Furniture",
      image: Furniture,
      description: "Stylish and functional furniture for your home.",
    },
    {
      name: "Cosmetics",
      image: Cosmetics,
      description: "High-quality cosmetics for your beauty needs.",
    },
  ];

  const products = [
    {
      id: 1,
      name: "AirPods Pro",
      image: WirelessEarbuds,
      price: 49.99,
    },
    {
      id: 2,
      name: "4K Ultra HD TV",
      image: TV,
      price: 899.99,
    },
    {
      id: 3,
      name: "MSI Gaming Laptop",
      image: GamingLaptop,
      price: 1299.99,
    },
    {
      id: 4,
      name: "Nike Jordan 5",
      image: SportsShoes,
      price: 79.99,
    },
    {
      id: 5,
      name: "The loss ticket book",
      image: Book,
      price: 49.99,
    },
    {
      id: 6,
      name: "IKEA Drawer",
      image: Drawer,
      price: 899.99,
    },
    {
      id: 7,
      name: "Feastables Snack Bar",
      image: SnackBar,
      price: 1299.99,
    },
    {
      id: 8,
      name: "Negative Ion Dryer",
      image: HairDryer,
      price: 79.99,
    },
    {
      id: 9,
      name: "Candle",
      image: Candle,
      price: 49.99,
    }
  ];

  return {
    handleExploreMore,
    statistics,
    categories,
    products,
  };
};

export {default} from '@/pages/client/Home/Home';
