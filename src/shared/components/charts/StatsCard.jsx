import React from "react";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend = null,
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
    red: "bg-red-500 text-white",
    indigo: "bg-indigo-500 text-white",
    yellow: "bg-yellow-400 text-white",      // warning
    gray: "bg-gray-400 text-white",          // neutral
  };

  // Helper to check if value is numeric and format it compactly with k, M, B
  const formatValue = (val) => {
    // console.log("val", val, !isNaN(Number(val?.replace(',', ''))), Number(val));
    // Fix: Ensure value is parsed as a number, handle strings with commas, and check for valid numbers
    if (val !== null && val !== "" && !isNaN(Number(String(val).replace(/,/g, "")))) {
      const num = Number(String(val).replace(/,/g, ""));
      if (num >= 1_000_000_000) {
        // Billions
        return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 2).replace(/\.00$/, "") + "B";
      } else if (num >= 1_000_000) {
        // Millions
        return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 2).replace(/\.00$/, "") + "M";
      } else if (num >= 10_000) {
        // Thousands, show with comma
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
      } else {
        // Show as is for < 10,000, with up to 2 decimals and commas
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
      }
    }
    // If not a number, return as is
    return val;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{formatValue(value)}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend > 0
                  ? "text-green-600"
                  : trend < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              <svg
                className={`w-4 h-4 mr-1 ${
                  trend > 0 ? "rotate-0" : "rotate-180"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
