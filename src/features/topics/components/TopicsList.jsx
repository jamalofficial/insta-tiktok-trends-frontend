import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { topicsService } from "../../../shared/services/topicsService";
import SkeletonLoader from "../../../shared/components/SkeletonLoader";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

const TopicsList = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Only fetch topics on initial load and when pagination changes (not when search changes)
  const fetchTopicsInitial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await topicsService.getTopics({
        page: pagination.page,
        size: pagination.size,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        // Don't include search in initial fetch
      });

      setTopics(response.items);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        pages: response.pages,
      });
    } catch (err) {
      setError("Failed to fetch topics");
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, filters.sort_by, filters.sort_order]);

  useEffect(() => {
    fetchTopicsInitial();
  }, [fetchTopicsInitial]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setPagination((prev) => ({ ...prev, page: 1 }));

    try {
      setError(null);
      const response = await topicsService.getTopics({
        page: 1,
        size: pagination.size,
        search: filters.search,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });

      setTopics(response.items);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        pages: response.pages,
      });
    } catch (err) {
      setError("Failed to search topics");
      console.error("Error searching topics:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // If it's a sort filter (not search), reset to page 1 and refetch
    if (key !== "search") {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const handleSearchFocus = () => {
    // Only reload table if there's a search term to clear
    if (filters.search.trim() !== "") {
      // Clear search input and reset to show all topics
      setFilters((prev) => ({ ...prev, search: "" }));
      setSearching(false);
      setError(null);
      // Reset pagination to page 1
      setPagination((prev) => ({ ...prev, page: 1 }));

      // Refetch all topics to show original data
      fetchTopicsInitial();
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    // This will trigger the useEffect to refetch with the new page
  };

  const handleViewResults = (topic) => {
    navigate(`/topics/${topic.id}/results`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <SkeletonLoader variant="table" lines={5} className="min-h-64" />;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Explore Topics
        </h3>

        {/* Search and Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search topics..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onFocus={handleSearchFocus}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? (
                <>
                  <LoadingSpinner size="small" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </form>

          <div className="flex gap-4">
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="created_at">Created Date</option>
              <option value="updated_at">Updated Date</option>
              <option value="topic">Topic Name</option>
            </select>

            <select
              value={filters.sort_order}
              onChange={(e) => handleFilterChange("sort_order", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Topics Table */}
        {searching ? (
          <SkeletonLoader variant="table" lines={5} className="min-h-64" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Scrape
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {topic.topic}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {topic.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {topic.topic_results.length} results
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {topic.last_scrape
                        ? formatDate(topic.last_scrape)
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(topic.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewResults(topic)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-200"
                      >
                        View Results
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!searching && pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.size + 1} to{" "}
              {Math.min(pagination.page * pagination.size, pagination.total)} of{" "}
              {pagination.total} results
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pagination.page === pageNum
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsList;
