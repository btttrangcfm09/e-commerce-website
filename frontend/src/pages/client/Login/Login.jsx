import React from "react";
import LoginForm from "@/pages/client/Login/LoginForm"; 
import AuthBackground from "@/components/layout/AuthBackground"; 

export default function Login() {
  return (
    <div className="flex min-h-screen w-full font-sans">
      
      {/* CỘT TRÁI: Chứa ảnh nền Coffee & Text giới thiệu */}
      {/* w-1/2: Chiếm 50% chiều rộng */}
      {/* hidden lg:flex: Ẩn trên mobile, hiện trên màn hình lớn */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden bg-black text-white">
        
        {/* Gọi AuthBackground: Vì đã sửa thành absolute, nó sẽ nằm gọn trong div này */}
        <AuthBackground /> 

        {/* Nội dung chữ nổi lên trên (z-10) */}
        <div className="relative z-10 p-12 max-w-lg text-center">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed font-light">
               Shop the latest trends in fashion, electronics, and more. Elevate your shopping experience with exclusive deals.
            </p>
        </div>
      </div>

      {/* CỘT PHẢI: Chứa Form - NỀN TRẮNG TINH */}
      {/* bg-white: Quan trọng để che đi lớp mờ */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        {/* max-w-md: Giới hạn chiều rộng form, không cho nó chiếm hết cột phải */}
        <div className="w-full max-w-[420px]">
           <LoginForm />
        </div>
      </div>

    </div>
  );
}