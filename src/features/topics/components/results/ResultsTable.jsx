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
import {SearchFilters, VISIBILITY_OPTIONS} from "@/shared/components/SearchFilters";
import Pagination from "@/shared/components/Pagination";


import { columns } from "./TopicResultsColumns";
import { columnsInsta } from "./TopicResultsColumnsInsta";
import { DataTable } from "@/shared/components/DataTable";

import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { use } from "react";

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
  const [platform, setPlatform] = useState("TikTok");
  // const [filtersToHide, setFiltersToHide] = useState([VISIBILITY_OPTIONS.PLATFORM]);

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

      if(response?.items && response?.items?.length){
        console.log("response", response);
        setResults(response.items);
        setPlatform(response.items ? response.items[0].platform : 'TikTok');
        setPagination({
          page: response.page,
          size: response.size,
          total: response.total,
          pages: response.pages,
        });
      }
      else{
        console.log("no response", response);
        setResults([]);
        // setPlatform(response.items ? response.items[0].platform : 'TikTok');
        setPagination({
          page: response?.page ?? 1,
          size: response?.size ?? 20,
          total: response?.total ?? 0,
          pages: response?.pages ?? 0,
        });
      }
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

  const getColumns = () => {
    if(platform == "TikTok") {
      return columns;
    }
    else {
      // setFiltersToHide(prev => ([...prev, ...[VISIBILITY_OPTIONS.REGION, VISIBILITY_OPTIONS.DEMOGRAPHIC]]))
      return columnsInsta;
    }
  }

  return (

    <div className="bg-white shadow rounded-lg">
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <SearchFilters
              visibleOptions={Object.values(VISIBILITY_OPTIONS).filter(item => ![VISIBILITY_OPTIONS.PLATFORM]?.includes(item))}
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
              columns={getColumns()} 
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
        {pagination.pages > 1 && <Pagination pagination={pagination} handlePageChange={handlePageChange} />}

        {/* Details */}
        {!!detailsView?.id &&
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
        }
      </div>
    </div>
  );
};

export default ResultsTable;
