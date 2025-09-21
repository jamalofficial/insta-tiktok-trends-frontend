import React from "react";

const Card = ({
  children,
  className = "",
  padding = "default",
  shadow = true,
  ...props
}) => {
  const baseClasses = "bg-white rounded-lg";
  const shadowClasses = shadow ? "shadow" : "";

  const paddingClasses = {
    none: "",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`${baseClasses} ${shadowClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
