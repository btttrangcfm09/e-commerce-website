import React, { useMemo } from 'react';

const AuthBackground = () => {
  const sourceImages = [
    "https://songchannelvn.com/wp-content/uploads/2022/10/chup-anh-san-pham-dep.jpg?q=80&w=600&auto=format&fit=crop",
    "https://tse1.mm.bing.net/th/id/OIP.r6FAZewL_GvlVnrFIwG-rAHaED?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://tse3.mm.bing.net/th/id/OIP.u5dUQr0SjD1DKQTYpEw8IQHaEo?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://ictv.1cdn.vn/2022/12/22/ictvietnam.mediacdn.vn-162041676108402688-2022-12-22-_expert-series-1671672460205444361245.jpeg?q=80&w=600&auto=format&fit=crop",
    "https://tse1.mm.bing.net/th/id/OIP.P5v7uq66QzfIcLMDgNcxdAHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://i5.walmartimages.com/asr/a10a38af-6069-4428-9416-7e3b6a142918.ad752df843b2c1600697cacceed3f42d.jpeg?q=80&w=600&auto=format&fit=crop",
    "https://i5.walmartimages.com/asr/a10a38af-6069-4428-9416-7e3b6a142918.ad752df843b2c1600697cacceed3f42d.jpeg?q=80&w=600&auto=format&fit=crop",
    "https://tse1.mm.bing.net/th/id/OIP.P5v7uq66QzfIcLMDgNcxdAHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",
    "https://ictv.1cdn.vn/2022/12/22/ictvietnam.mediacdn.vn-162041676108402688-2022-12-22-_expert-series-1671672460205444361245.jpeg?q=80&w=600&auto=format&fit=crop",
    "https://songchannelvn.com/wp-content/uploads/2022/10/chup-anh-san-pham-dep.jpg?q=80&w=600&auto=format&fit=crop",
    "https://tse1.mm.bing.net/th/id/OIP.r6FAZewL_GvlVnrFIwG-rAHaED?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3?q=80&w=600&auto=format&fit=crop",

  ];

  const images = useMemo(() => [...sourceImages, ...sourceImages, ...sourceImages, ...sourceImages], [sourceImages]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gray-900">
      <div className="absolute top-[60%] left-[60%] w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg]">
        <div className="columns-3 md:columns-4 lg:columns-5 gap-3 w-full h-full">
          {images.map((src, index) => (
            <div key={index} className="mb-3 break-inside-avoid inline-block w-full">
              <img 
                src={src} 
                alt="E-commerce background" 
                loading="lazy"
                className="w-full h-auto rounded-sm object-cover transition-all duration-700 opacity-60 hover:opacity-100" 
              />
            </div>
          ))}
        </div>
      </div>
      {/* Lớp phủ tối để làm nổi bật chữ bên cột trái */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
    </div>
  );
};

export default AuthBackground;