import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { topicsService } from "../../../shared/services/topicsService";
import Layout from "../../../shared/components/Layout";
import SkeletonLoader from "../../../shared/components/SkeletonLoader";

const TopicResultsPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    min_popularity: "",
    max_popularity: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchTopic = useCallback(async () => {
    try {
      const topicData = await topicsService.getTopic(topicId);
      setTopic(topicData);
    } catch (err) {
      console.error("Error fetching topic:", err);
      setError("Failed to fetch topic details");
    }
  }, [topicId]);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        size: pagination.size,
        ...filters,
      };

      // Remove empty string values
      Object.keys(params).forEach((key) => {
        if (params[key] === "") {
          delete params[key];
        }
      });

      const response = await topicsService.getTopicResults(topicId, params);

      setResults(response.items);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        pages: response.pages,
      });
    } catch (err) {
      setError("Failed to fetch results");
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  }, [topicId, pagination.page, pagination.size, filters]);

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchResults();
    }
  }, [topicId, fetchTopic, fetchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchResults();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return num.toLocaleString();
  };

  const formatPercentage = (num) => {
    if (num === null || num === undefined) return "N/A";
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <SkeletonLoader variant="table" lines={5} className="min-h-64" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigate("/topics")}
                  className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Topics
                </button>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Topic Results
                </h1>
                <p className="text-lg text-gray-600">
                  {topic
                    ? `Results for "${topic.topic}"`
                    : "Loading topic details..."}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Topic ID</div>
                <div className="text-lg font-semibold text-gray-900">
                  {topicId}
                </div>
              </div>
            </div>
          </div>

          {/* Topic Info Card */}
          {topic && (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{topic.topic}</h2>
                  <div className="flex items-center space-x-6 text-purple-100">
                    <div>
                      <span className="text-sm">Total Results:</span>
                      <span className="ml-2 font-semibold">
                        {topic.topic_results.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm">Last Scrape:</span>
                      <span className="ml-2 font-semibold">
                        {topic.last_scrape
                          ? formatDate(topic.last_scrape)
                          : "Never"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm">Created:</span>
                      <span className="ml-2 font-semibold">
                        {formatDate(topic.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-purple-200">
                    {topic.topic_results.length}
                  </div>
                  <div className="text-purple-100">Results Found</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Search and Filters */}
              <div className="mb-6">
                <form
                  onSubmit={handleSearch}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Search keywords..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Min popularity"
                      value={filters.min_popularity}
                      onChange={(e) =>
                        handleFilterChange("min_popularity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Max popularity"
                      value={filters.max_popularity}
                      onChange={(e) =>
                        handleFilterChange("max_popularity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

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
                    onChange={(e) =>
                      handleFilterChange("sort_by", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="search_popularity">Popularity</option>
                    <option value="search_increase">Trend Increase</option>
                    <option value="relevant_keyword">Keyword</option>
                  </select>

                  <select
                    value={filters.sort_order}
                    onChange={(e) =>
                      handleFilterChange("sort_order", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keyword
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Popularity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend Increase
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.relevant_keyword}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatNumber(result.search_popularity)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatPercentage(result.search_increase)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {result.time_period_today
                              ? formatDate(result.time_period_today)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(result.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {(pagination.page - 1) * pagination.size + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.size,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              pagination.page === pageNum
                                ? "bg-purple-600 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

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
        </div>
      </div>
    </Layout>
  );
};

export default TopicResultsPage;
