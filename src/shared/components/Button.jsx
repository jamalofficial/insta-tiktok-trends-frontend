import React from "react";

export const buttonBaseClasses =
  "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

export const buttonVariants = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",

  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

  outline:
    "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",

  "accent-purple":
    "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500",

  "accent-blue":
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500",

  "accent-green":
    "bg-gradient-to-r from-green-600 to-indigo-600 text-white hover:from-green-700 hover:to-indigo-700 focus:ring-green-500",

  "accent-yellow":
    "bg-gradient-to-r from-yellow-600 to-indigo-600 text-white hover:from-yellow-700 hover:to-indigo-700 focus:ring-yellow-500",

  "accent-red":
    "bg-gradient-to-r from-red-600 to-indigo-600 text-white hover:from-red-700 hover:to-indigo-700 focus:ring-red-500",
};

export const buttonSizes = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-sm",
  large: "px-6 py-3 text-base",
};


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
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonBaseClasses} ${buttonVariants[variant]} ${buttonSizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
