import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { topicService } from "@/shared/services/topicService";
import { logService } from "@/shared/services/logService";
import SkeletonLoader from "@/shared/components/SkeletonLoader";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { Plus, Trash2Icon, CompassIcon, TelescopeIcon, EyeIcon, Search, ArrowDown, ArrowUp } from "lucide-react";
import Modal from "@/shared/components/Modal";
import TopicAddForm from "../pages/TopicAddForm";
import { MultiSelect } from "@/shared/components/MultiSelect";
import { Button } from "@/components/ui/button";
import SwAlert from "@/shared/components/Swal";
import TopicFilter from "./TopicFilter";

const DEFAULT_SORT_BY = "created_at";
const DEFAULT_SORT_ORDER = "desc";

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

  // Only fetch topics on initial load and when pagination or sort changes (not when search changes)
  const fetchTopicsInitial = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await topicService.getTopics({
        page: pagination.page,
        size: pagination.size,
        // Always prefer current sortBy/sortOrder unless override requested
        sort_by: filters?.sort_by,
        sort_order: filters?.sort_order,
        // Pass only demographic and region filters
        filters: {
          demographic: filters?.demographic,
          region: filters?.region,
        },
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
  };

  // Effect for initial + sort + pagination changes
  useEffect(() => {
    fetchTopicsInitial();
    // eslint-disable-next-line
  }, [pagination.page, pagination.size]);

  const handleFiltersSubmit = async (e, filters) => {
    e.preventDefault();
    setSearching(true);
    setPagination((prev) => ({ ...prev, page: 1 }));

    try {
      setError(null);
      const response = await topicService.getTopics({
        page: 1,
        size: pagination.size,
        search: filters.search,
        sort_by: sortBy,
        sort_order: sortOrder,
        filters: {
          demographic: filters.demographic,
          region: filters.region,
        },
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

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewResults = (topic) => {
    navigate(`/topics/${topic.id}/results`);
  };

  const handleExploreTopic = (topic) => {
    const tab = window.open(`https://www.tiktok.com/csi/search?keyword=${topic.topic}#explore=1`, '_blank');
    if (tab) {
      tab.focus();
      const focusBack = () => {
        window.focus();
        tab.removeEventListener('beforeunload', focusBack);
      };
      tab.addEventListener('beforeunload', focusBack);
    }
  };

  const handleDeleteTopic = (topic) => {
    SwAlert.confirm(
      `Are you sure you want to delete the topic "${topic.topic}"?`,
      "This action cannot be undone."
    ).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);
        topicService
          .deleteTopic(topic.id)
          .then(() => {
            setTopics((prevTopics) => prevTopics.filter((t) => t.id !== topic.id));
            fetchTopicsInitial();
          })
          .catch((err) => {
            setError("Failed to delete topic.");
            console.error("Delete topic error", err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleScrapTopic = (topic) => {
    logService.getLogsScreenshot({ topic_id: topic.id })
      .then(() => {
        SwAlert.success("Scraping triggered!", "A screenshot is being created for this topic.");
      })
      .catch((err) => {
        setError("Failed to trigger scrape for topic.");
        console.error("Scrap topic error", err);
        SwAlert.error("Failed to trigger scrape for topic.");
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const [showAddTopicForm, setShowAddTopicForm] = useState(false);
  const handleAddTopic = () => {
    setShowAddTopicForm(true);
  };

  const handleAddTopicSubmit = async (topic) => {
    await topicService.createTopic(topic);
    setShowAddTopicForm(false);
    fetchTopicsInitial();
  };

  if (loading) {
    return <SkeletonLoader variant="table" lines={5} className="min-h-64" />;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Explore Topics
          </h3>
          <button
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            onClick={() => handleAddTopic(true)}
          >
            <Plus className="inline-flex" />
            Add Topic
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <TopicFilter
            handleFiltersSubmit={handleFiltersSubmit}
            isLoading={loading}
            error={error}
          />
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
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Scrape
                  </th> */}
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  >
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
                      <div
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleViewResults(topic)}
                      >
                        {topic.topic}
                      </div>
                      {/* <div className="text-sm text-gray-500">
                        ID: {topic.id}
                      </div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {topic.topic_results.length} results
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {topic.last_scrape
                        ? formatDate(topic.last_scrape)
                        : "Never"}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(topic.created_at)}
                    </td>
                    <td className="flex gap-2 items-center px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* <button
                        className=" text-green-600 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                        title="Explore Topic"
                        onClick={() => handleScrapTopic(topic)}
                      >
                        <CompassIcon />
                      </button> */}
                      <button
                        className=" text-green-600 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                        title="Explore Topic"
                        onClick={() => handleExploreTopic(topic)}
                      >
                        <TelescopeIcon />
                      </button>
                      <button
                        onClick={() => handleViewResults(topic)}
                        className=" text-indigo-600 hover:text-indigo-900 transition-colors duration-200 cursor-pointer"
                        title="View Results"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic)}
                        className=" text-red-600 hover:text-red-900 transition-colors duration-200 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2Icon />
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
      {showAddTopicForm && (
        <Modal
          isOpen={showAddTopicForm}
          onClose={() => setShowAddTopicForm(false)}
          title="Add Topic"
          className="bg-opacity-100"
        >
          <TopicAddForm onSubmit={handleAddTopicSubmit} />
        </Modal>
      )}
    </div>
  );
};

export default TopicsList;
