import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    "accent-purple": "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200",
    "accent-blue": "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200",
    "accent-green": "bg-gradient-to-r from-green-600 to-indigo-600 text-white rounded-md hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200",
    "accent-yellow": "bg-gradient-to-r from-yellow-600 to-indigo-600 text-white rounded-md hover:from-yellow-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200",
    "accent-red": "bg-gradient-to-r from-red-600 to-indigo-600 text-white rounded-md hover:from-red-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
