import React from "react";
import GoogleStore from '@/assets/images/HomePage/GooglePlay.svg';
import AppStore from '@/assets/images/HomePage/AppStore.svg';
import QRCode from '@/assets/images/HomePage/qrcode.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black to-neutral-700 text-neutral-50 py-8">
      <div className="container mx-auto px-4 flex flex-wrap gap-8 justify-between text-sm">
        {/* Subscription Section */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Exclusive</h2>
          <p className="font-medium">Subscribe</p>
          <p>Get 10% off your first order</p>
          <div className="flex border border-neutral-50 rounded px-3 py-1.5">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent text-neutral-50 outline-none flex-grow text-xs"
            />
            <button className="text-neutral-50 font-medium text-xs">Send</button>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Support</h2>
          <p>1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội</p>
          <a href="mailto:someone@example.com" className="underline">
            ecommerce@gmail.com
          </a>
          <a href="tel:+1800229933" className="underline">098 765 4321</a>
        </div>

        {/* Account Section */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Account</h2>
          <ul className="space-y-1">
            <li>My Account</li>
            <li><a href="/login">Login / Register</a></li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        {/* Quick Link Section */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Quick Link</h2>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Download App Section */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Download App</h2>
          <p className="opacity-70 text-xs">Save $3 with App New User Only</p>
          <div className="flex items-center gap-3">
            <img
              src={QRCode}
              alt="QR Code"
              className="w-20 h-20 border rounded border-white"
            />
            <div className="flex flex-col gap-2">
              <a href="https://www.apple.com/vn/app-store/">
                <img
                  src={AppStore}
                  alt="App Store"
                  className="w-28 h-auto"
                />
              </a>
              <a href="https://play.google.com/store/games?hl=vi-VN">
                <img
                  src={GoogleStore}
                  alt="Google Play"
                  className="w-28 h-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-neutral-50 mt-6 pt-4 text-center text-xs opacity-70">
        <p>© Copyright group21.WEB2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
