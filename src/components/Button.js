import React from "react";

const Button = ({ onClick, children, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-purple-600 text-white py-2 px-4 rounded transition-colors hover:bg-purple-700 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
