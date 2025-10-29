import React, {useState} from "react";
import {
  processLocationData,
  processDemographicData,
  // processKeywordPopularity,
  // processTrendData,
  calculateStats,
} from "../utils/dataProcessing";

import StatisticsSection from "../components/StatisticsSection";
import ChartsSection from "../components/ChartsSection";

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
    console.log("results", result);
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
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={onSort ? () => handleSort("relevant_keyword") : undefined}
                >
                  Keyword
                  {onSort && renderSortIndicator("relevant_keyword")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={onSort ? () => handleSort("search_popularity") : undefined}
                >
                  Popularity
                  {onSort && renderSortIndicator("search_popularity")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={onSort ? () => handleSort("search_increase") : undefined}
                >
                  Trend Increase
                  {onSort && renderSortIndicator("search_increase")}
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Period
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <React.Fragment key={result.id}>
                  <tr className="hover:bg-gray-50">
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
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {result.time_period_today
                          ? formatDate(result.time_period_today)
                          : "N/A"}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(result.updated_at)}
                    </td>
                    <td>
                      <button
                        className="px-3 py-1 text-xs font-medium rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        onClick={() => {
                          ToggleDetails(result);
                        }}
                      >
                        {detailsView?.id == result?.id ? "Hide Details" : "Show Details"}
                      </button>
                    </td>
                  </tr>
                  {detailsView?.id == result?.id && 
                    <tr>
                      <td colSpan={5}>
                        <StatisticsSection
                          results={[result]}
                          calculateStats={calculateStats}
                          formatNumber={formatNumber}
                          formatPercentage={formatPercentage}
                        />
                        {/* Charts Section */}
                        <ChartsSection
                          results={[result]}
                          processLocationData={processLocationData}
                          processDemographicData={processDemographicData}
                          showPopularity={false}
                          showTrends={false}
                        />
                      </td>
                    </tr>
                  }
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>
    </div>
  );
};

export default ResultsTable;
