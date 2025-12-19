import { Link } from "react-router-dom";
import BannerImg from "@/assets/shoppage/banner.jpg";

const Banner = ({ product }) => {
  if (!product) return null;

  return (
    <div className="relative h-64 flex flex-col justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BannerImg})` }}
      />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-medium mb-2 text-gray-200">
          {product.category}
        </h1>
        <nav className="text-xl font-light text-gray-200">
          <Link to="/" className="hover:text-rose-500 font-medium">
            Home
          </Link>
          <span className="mx-2 font-medium">&gt;</span>
          <Link to="/shop" className="hover:text-rose-500 font-medium">
            Shop
          </Link>
          <span className="mx-2 font-medium">&gt;</span>
          <span className="text-rose-500 font-medium">{product.category}</span>
          <span className="mx-2 font-medium">&gt;</span>
          <span className="font-medium">{product.name}</span>
        </nav>
      </div>
    </div>
  );
};

export default Banner;