import React from "react";
import LoginSVG from "@/assets/images/LoginPage/Login.png";
import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
    <div className="flex w-full bg-gradient-to-r from-orange-100 to-orange-300 h-screen px-20 py-20">
      <div className="w-full flex items-center">
        
          <RegisterForm
            // switchToRegister={switchToRegister}
            // switchToForgotPassword={switchToForgotPassword}
            className="w-full max-w-5xl mr-4"
          />

        {/* {currentForm === "forgotPassword" && (
          <ForgotPassword onSwitchToSignIn={switchToLogin} />
        )} */}

        <div className="w-1/2 hidden lg:block">
          <img src={LoginSVG} alt="Login Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
