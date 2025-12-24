import React, { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';

// Nhớ dùng ảnh PNG đã tách nền
import santaImg from '../../assets/images/santa.png';
import mountainImg from '../../assets/images/nui.png'; 

const SantaIntro = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const mountains = Array(5).fill(0); 

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 8500);
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 10500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      
      {/* LAYER 1: OVERLAY */}
      <div className={`absolute inset-0 bg-black/60 z-0 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0 delay-[800ms]' : 'opacity-100'}`} />

      {/* LAYER 2: TUYẾT */}
      <div className={`fixed inset-0 z-10 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0 delay-[800ms]' : 'opacity-100'}`}>
        <Snowfall snowflakeCount={200} radius={[1.0, 4.0]} style={{ width: '100vw', height: '100vh' }} />
      </div>

      {/* LAYER 3: NÚI */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 z-20 flex items-end">
        {mountains.map((_, index) => (
          <img
            key={index}
            src={mountainImg}
            alt="Mountain"
            className={`w-[33vw] h-full object-cover ${isExiting ? 'animate-pop-down' : 'animate-mountains-bounce'}`}
            style={{
              animationDelay: isExiting ? `${(4 - index) * 0.1}s` : `${index * 0.1}s`,
              opacity: isExiting ? 1 : 0, 
              transform: 'scale(1.02)' 
            }}
          />
        ))}
      </div>

      {/* LAYER 4: SANTA + MAGIC TRAIL */}
      <div className={`absolute w-80 md:w-[500px] z-30 animate-santa-container transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* [SỬA] 1. Lật trực tiếp ảnh ông già Noel ở đây */}
        <img
          src={santaImg}
          alt="Santa Flying"
          className="w-full h-auto object-contain relative z-20"
          style={{ 
            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))',
            transform: 'scaleX(-1)' // <-- THÊM DÒNG NÀY
          }}
        />
        
        {/* [SỬA] 2. Định vị lại cái đuôi */}
        {/* - right-0: Dính vào mép phải (phía sau xe).
            - translate-x-[10%]: Đẩy nhẹ nó ra sau một chút cho đẹp.
        */}
        {/* <div className="sparkle-tail absolute top-[35%] right-0 translate-x-[-60%] z-10"></div> */}
      </div>

      <style>{`
        /* --- NÚI (Giữ nguyên) --- */
        @keyframes bounceUp {
          0% { opacity: 0; transform: translateY(100%); }
          70% { opacity: 1; transform: translateY(-15%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-mountains-bounce { animation: bounceUp 0.6s ease-out forwards; }

        @keyframes popDown {
          0% { opacity: 1; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-20%); }
          100% { opacity: 0; transform: translateY(100%); }
        }
        .animate-pop-down { animation: popDown 0.5s ease-in forwards; }

        /* --- [SỬA] SANTA MOVE (Bỏ scaleX(-1) đi) --- */
        @keyframes santaMove {
          /* Chỉ di chuyển vị trí (left) và xoay (rotate), không lật ảnh ở đây nữa */
          0% { left: -120%; transform: translateY(0) rotate(-5deg); }
          25% { left: 20%; transform: translateY(-50px) rotate(0deg); }
          50% { left: 60vw; transform: translateY(20px) rotate(5deg); }
          100% { left: 120vw; transform: translateY(-100px) rotate(-10deg); }
        }
        .animate-santa-container {
          position: absolute;
          top: 25%;
          animation: santaMove 6s linear 1.2s both; 
        }

        /* --- [SỬA] DẢI LẤP LÁNH (Đảo ngược chiều hiệu ứng) --- */
        .sparkle-tail {
          width: 400px; height: 150px; pointer-events: none;
          
          /* MẶT NẠ: Mờ dần về bên TRÁI (to left) */
          -webkit-mask-image: linear-gradient(to left, transparent 0%, black 50%, black 100%);
          mask-image: linear-gradient(to left, transparent 0%, black 50%, black 100%);

          /* HÌNH DẠNG: Nhỏ ở bên PHẢI, to loe ra ở bên TRÁI */
          clip-path: polygon(100% 45%, 0% 0%, 0% 100%, 100% 55%);

          /* PARTICLE PATTERN (Giữ nguyên) */
          background-image: 
            radial-gradient(circle, rgb(255, 255, 200) 4px, transparent 8px),
            radial-gradient(circle, rgb(255, 250, 220) 2px, transparent 5px),
            radial-gradient(circle, white 1.5px, transparent 4px),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 3px);
          background-size: 80px 80px, 50px 50px, 40px 40px, 20px 20px;
          animation: sparkling 1.5s linear infinite;
        }

        /* ANIMATION LẤP LÁNH (Giữ nguyên) */
        @keyframes sparkling {
          0% { background-position: 0 0, 0 0, 0 0, 0 0; opacity: 0.9; }
          50% { opacity: 0.7; }
          100% { background-position: -200px 20px, -150px -10px, -180px 10px, -100px -20px; opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default SantaIntro;