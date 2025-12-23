import React from "react";
import RegisterForm from "./RegisterForm"; 
import AuthBackground from "@/components/layout/AuthBackground";

export default function Register() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      
      {/* CỘT TRÁI: Ảnh & Tiêu đề */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-60">
           <AuthBackground /> 
        </div>
        <div className="relative z-10 p-12 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 tracking-wide">Join Us</h1>
          <p className="text-lg text-gray-200 max-w-md mx-auto leading-relaxed">
            Sign up today to get started on your shopping journey.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: Form Đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
           <RegisterForm />
        </div>
      </div>

    </div>
  );
}