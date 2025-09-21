import React from "react";

const SkeletonLoader = ({
  variant = "text",
  width = "w-full",
  height = "h-4",
  className = "",
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  if (variant === "card") {
    return (
      <div className={`${baseClasses} ${width} ${height} ${className}`}>
        <div className="p-6 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`${baseClasses} ${width} ${height} ${className}`}>
        <div className="p-6">
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} bg-white shadow rounded-lg p-5`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default text variant
  return (
    <div className={`${baseClasses} ${width} ${height} ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-300 rounded mb-2 ${
            i === lines - 1 ? "w-3/4" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
