import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

const CategoryHeader = ({ category, categoryId }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <ChevronLeftIcon
            onClick={() => navigate("/categories")}
            className="flex items-center rounded-full w-8 h-8 p-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category?.name}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Category ID</div>
          <div className="text-lg font-semibold text-gray-900">{categoryId}</div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
