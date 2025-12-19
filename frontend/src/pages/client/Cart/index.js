import { useNavigate } from "react-router-dom";
export { default } from "@/pages/client/Cart/Cart"

export const useCartLogic = () => {

  const navigate = useNavigate();

  const handleNavigateToCheckout = () => {
    navigate("/checkout");
  };
  
  return handleNavigateToCheckout;
};


