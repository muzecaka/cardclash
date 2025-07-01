import React from "react";

const Input = ({ value, onChange, placeholder, type = "text", className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white text-black py-2 px-4 rounded-md mb-4 ${className}`}
    />
  );
};

export default Input;
