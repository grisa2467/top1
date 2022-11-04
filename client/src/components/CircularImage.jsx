import React from "react";

const CircularImage = ({ image, alt, size }) => {
  const _size = size || 90;
  return (
    <div
      className="d-flex justify-content-center align-items-center overflow-hidden"
      style={{
        height: _size,
        width: _size,
        borderRadius: _size / 2,
        border: "2px solid blue",
      }}
    >
      <img className="img-fluid" src={image} alt={alt || "img"} />
    </div>
  );
};

export default CircularImage;
