import React from "react";
import { LoaderCircleIcon } from "lucide-react";

// const LoadingSpinner = ({ size = "medium", className = "" }) => {
//   const sizeClasses = {
//     small: "h-4 w-4",
//     medium: "h-8 w-8",
//     large: "h-12 w-12",
//     xl: "h-16 w-16",
//   };

//   return (
//     <div className={`flex items-center justify-center ${className}`}>
//       <div
//         className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}
//       ></div>
//     </div>
//   );
// };

const LoadingSpinner = ({ size = "24px", variant= "accent", className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
    xl: "h-16 w-16",
    auto: "w-full h-auto"
  };

  const variantClasses = {
    default: "text-white",
    accent: "text-indigo-600",
    success: "text-green-500",
    error: "text-rose-500",
    warning: "text-yellow-400",
    info: "text-blue-500",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderCircleIcon className={`animate-spin ${variantClasses[variant]}`} size={size} />
    </div>
  );
};

export default LoadingSpinner;
