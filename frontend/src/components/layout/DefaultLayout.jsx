import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // Thêm hook
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SantaIntro from "@/components/effects/SantaIntro"; // Import hiệu ứng

const DefaultLayout = () => {
  const location = useLocation();
  const [showSanta, setShowSanta] = useState(false);
  
  // Dùng useRef để lưu đường dẫn trước đó
  const prevPathRef = useRef(location.pathname);
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    // Logic: Nếu trang trước là '/login' VÀ trang hiện tại là '/' (Home)
    // thì bật hiệu ứng Santa
    if (prevPathRef.current === '/login' && location.pathname === '/') {
      setShowSanta(true);
    }
    
    // Cập nhật lại đường dẫn hiện tại cho lần check sau
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Hiển thị SantaIntro nếu state showSanta = true */}
      {showSanta && <SantaIntro onComplete={() => setShowSanta(false)} />}

      {!isAuthPage && <Header />}
      <main>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default DefaultLayout;