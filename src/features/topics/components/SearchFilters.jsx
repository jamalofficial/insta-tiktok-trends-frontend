import React from "react";

const SearchFilters = ({ filters, handleFilterChange, handleSearch }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:p-6">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Search keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="number"
            placeholder="Min popularity"
            value={filters.min_popularity}
            onChange={(e) =>
              handleFilterChange("min_popularity", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="number"
            placeholder="Max popularity"
            value={filters.max_popularity}
            onChange={(e) =>
              handleFilterChange("max_popularity", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4">
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="created_at">Created Date</option>
            <option value="search_popularity">Popularity</option>
            <option value="search_increase">Trend Increase</option>
            <option value="relevant_keyword">Keyword</option>
          </select>
          <select
            value={filters.sort_order}
            onChange={(e) => handleFilterChange("sort_order", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
