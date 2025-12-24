import React from 'react';
import Snowfall from 'react-snowfall';

// Component tạo hiệu ứng tuyết rơi trong Header
const HeaderSnow = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-b-lg">
      <Snowfall
        color="#ffffff"
        snowflakeCount={40} // Số lượng tuyết vừa phải
        radius={[0.5, 2.0]} // Kích thước hạt tuyết nhỏ
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default HeaderSnow;