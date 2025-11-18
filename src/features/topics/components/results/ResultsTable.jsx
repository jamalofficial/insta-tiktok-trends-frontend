import React, {useState, useEffect} from "react";
import {
  processLocationData,
  processDemographicData,
  calculateStats,
  formatNumber,
  formatPercentage,
} from "../../utils/dataProcessing";
import SkeletonLoader from "@/shared/components/SkeletonLoader";
import topicService from "@/shared/services/topicService";
import { useDebounce } from "@/lib/helpers";

import StatisticsSection from "../StatisticsSection";
import ChartsSection from "../ChartsSection";
import SearchFilters from "./SearchFilters";


import { columns } from "./TopicResultsColumns";
import { DataTable } from "@/shared/components/dataTable";

import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";

const ResultsTable = ({
  topicId
}) => {
  const [detailsView, setDetailsView] = useState(null);
  const ToggleDetails = (result) => {
    if(result?.id == detailsView?.id) setDetailsView(null);
    else setDetailsView(result);
  }
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
    sort_by: null,
    sort_order: null,
    demographic: [], 
    region: [],
    platform: null,
  });

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        sort_by: filters?.sort_by,
        sort_order: filters?.sort_order,
        filters: {
          demographic: filters.demographic,
          region: filters.region,
          platform: filters.platform,
        },
      };
      console.log("filters", filters, params);

      // Remove empty string values
      Object.keys(params).forEach((key) => {
        if (params[key] === "") {
          delete params[key];
        }
      });

      const response = await topicService.getTopicResults(topicId, params);

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
  };

  const fetchDebounceHandler = useDebounce(fetchResults, 300)

  useEffect(() => {
    fetchDebounceHandler();
    // eslint-disable-next-line
  }, [topicId, pagination.page, pagination.size, filters]);

  
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

  return (

    <div className="bg-white shadow rounded-lg">
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <SearchFilters
              handleFiltersSubmit={fetchResults}
              filters={filters}
              setFilterValues={setFilterValues}
              isLoading={loading}
              error={error}
          />
        </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

        {/* Topics Table */}
        {(loading) ? (
          <SkeletonLoader variant="datatable" lines={10} className="min-h-64" height={"h-auto"} />
        ) : (
          <div className="overflow-x-auto">
            <DataTable 
              columns={columns} 
              data={results} 
              defaultSorting={{
                sort_by: filters.sort_by,
                sort_order: filters.sort_order || 'desc'
              }} 
              actions={{handleSorting, ToggleDetails}} 
            />
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
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
                        ? "bg-purple-600 text-white"
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

        {/* Details */}
        <Dialog open={!!detailsView?.id} onOpenChange={open => { if (!open) setDetailsView({}); }}>
          <DialogContent className="max-w-4xl min-w-[60%] w-full">
            <DialogTitle>{detailsView?.relevant_keyword}</DialogTitle>
            <StatisticsSection
              results={[detailsView]}
              calculateStats={calculateStats}
              formatNumber={formatNumber}
              formatPercentage={formatPercentage}
            />
            {/* Charts Section */}
            <ChartsSection
              results={[detailsView]}
              processLocationData={processLocationData}
              processDemographicData={processDemographicData}
              showPopularity={false}
              showTrends={false}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResultsTable;
