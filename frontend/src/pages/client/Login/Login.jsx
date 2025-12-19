import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/pages/client/Login/LoginForm";
import LoginSVG from "@/assets/images/LoginPage/Login.png";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full bg-gradient-to-r from-orange-100 to-orange-300 h-screen px-20 py-20">
      <div className="w-full flex items-center">
        
          <LoginForm
            className="w-full max-w-5xl mr-4"
          />

        <div className="w-1/2 hidden lg:block">
          <img src={LoginSVG} alt="Login Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
