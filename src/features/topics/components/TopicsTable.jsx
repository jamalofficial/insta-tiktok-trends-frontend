import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { topicService } from "@/shared/services/topicService";
import SkeletonLoader from "@/shared/components/SkeletonLoader";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { Plus } from "lucide-react";
import Modal from "@/shared/components/Modal";
import TopicAddForm from "../pages/TopicAddForm";
import SwAlert from "@/shared/components/Swal";
import TopicFilters from "./TopicFilters";
import { useDebounce } from "@/lib/helpers";

import { columns } from './TopicsTableColumns';
import { DataTable } from "@/shared/components/dataTable";

const DEFAULT_SORT_BY = "created_at";
const DEFAULT_SORT_ORDER = "desc";

const TopicsTable = () => {
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
    sort_by: null,
    sort_order: null,
    demographic: [], 
    region: [],
    platform: null,
  });

  // Only fetch topics on initial load and when pagination or sort changes (not when search changes)
  const fetchTopicsInitial = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await topicService.getTopics({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        // Always prefer current sortBy/sortOrder unless override requested
        sort_by: filters?.sort_by,
        sort_order: filters?.sort_order,
        // Pass only demographic and region filters
        filters: {
          demographic: filters?.demographic,
          region: filters?.region,
          platform: filters?.platform,
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

  const fetchDebounceHandler = useDebounce(fetchTopicsInitial, 300)

  // Effect for initial + sort + pagination changes
  useEffect(() => {
    fetchDebounceHandler();
    // eslint-disable-next-line
  }, [pagination.page, pagination.size, filters]);

  const handleFiltersSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    setPagination((prev) => ({ ...prev, page: 1 }));

    try {
      setError(null);
      const response = await topicService.getTopics({
        page: 1,
        size: pagination.size,
        search: filters.search,
        sort_by: filters?.sort_by,
        sort_order: filters?.sort_order,
        filters: {
          demographic: filters.demographic,
          region: filters.region,
          platform: filters.platform
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

  const [showAddTopicForm, setShowAddTopicForm] = useState(false);
  const handleAddTopic = () => {
    setShowAddTopicForm(true);
  };

  const handleAddTopicSubmit = async (topic) => {
    await topicService.createTopic(topic);
    setShowAddTopicForm(false);
    fetchTopicsInitial();
  };
  

  const setFilterValues = (value, type) => {
    setFilters((prev) => ({
        ...prev,
        [type]: value,
    }));
  }
  const handleSorting = (sort_by, sort_order) => {
    setFilters((prev) => ({...prev, "sort_by": sort_by}));
    setFilters((prev) => ({...prev, "sort_order": sort_order ? sort_order : 'desc'}));
  }

  // if (loading) {
  //   return <SkeletonLoader variant="table" lines={5} className="min-h-64" />;
  // }

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
          <TopicFilters
            handleFiltersSubmit={fetchTopicsInitial}
            filters={filters}
            setFilterValues={setFilterValues}
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
        {loading ? (
          <SkeletonLoader variant="table" lines={5} className="min-h-64" />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={topics}
              defaultSorting={{
                sort_by: filters.sort_by,
                sort_order: filters.sort_order || 'desc'
              }}
              actions={{
                handleViewResults,
                handleExploreTopic,
                handleDeleteTopic,
                handleSorting
              }}
            />
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

export default TopicsTable;
