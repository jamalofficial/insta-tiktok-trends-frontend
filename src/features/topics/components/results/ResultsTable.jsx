import React, {useState, useEffect} from "react";
import {
  processLocationData,
  processDemographicData,
  // processKeywordPopularity,
  // processTrendData,
  calculateStats,
} from "../../utils/dataProcessing";

import StatisticsSection from "../StatisticsSection";
import ChartsSection from "../ChartsSection";


import { columns } from "./TopicResultsColumns";
import { DataTable } from "@/shared/components/dataTable";

import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";

const ResultsTable = ({
  results,
  pagination,
  handlePageChange,
  formatNumber,
  formatPercentage,
  formatDate,
  onSort=null
}) => {
  const [detailsView, setDetailsView] = useState(null);
  const ToggleDetails = (result) => {
    if(result?.id == detailsView?.id) setDetailsView(null);
    else setDetailsView(result);
  }

  // Sorting: Support for keyword, popularity, trend increase columns
  // Sorting state (field and order)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc", // or "desc"
  });

  // Handle column header click
  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
    if (onSort) onSort(columnKey, direction);
  };

  // Apply sorting locally if onSort isn't provided
  const sortedResults = React.useMemo(() => {
    if (!sortConfig.key) return results;
    const sortField = sortConfig.key;
    const sorted = [...results].sort((a, b) => {
      if (sortField === "relevant_keyword") {
        // String comparison (case insensitive)
        return sortConfig.direction === "asc"
          ? a.relevant_keyword.localeCompare(b.relevant_keyword, undefined, { sensitivity: "base" })
          : b.relevant_keyword.localeCompare(a.relevant_keyword, undefined, { sensitivity: "base" });
      } else if (sortField === "search_popularity" || sortField === "search_increase") {
        // Numeric comparison
        const aVal = +a[sortField] || 0;
        const bVal = +b[sortField] || 0;
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [results, sortConfig]);

  // Helpers for rendering sort indicators
  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return <span className="ml-1 opacity-40">⇅</span>;
    return (
      <span className="ml-1">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const [filters, setFilters] = useState({
    search: "",
    sort_by: null,
    sort_order: null,
    demographic: [], 
    region: [],
  });
  useEffect(() => {
    console.log("Filters update", filters);
  }, [filters]);
  const handleSorting = (sort_by, sort_order) => {
    setFilters((prev) => ({...prev, "sort_by": sort_by}));
    setFilters((prev) => ({...prev, "sort_order": sort_order ? sort_order : 'desc'}));
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        
        <DataTable 
          columns={columns} 
          data={results} 
          defaultSorting={{
            sort_by: filters.sort_by,
            sort_order: filters.sort_order || 'desc'
          }} 
          actions={{handleSorting, ToggleDetails}} 
        />

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
