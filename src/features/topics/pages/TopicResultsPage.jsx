import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { topicService } from "@/shared/services/topicService";
import Layout from "@/shared/components/Layout";
import SkeletonLoader from "@/shared/components/SkeletonLoader";
import ResultsHeader from "../components/results/ResultsHeader";
import ChartsSection from "../components/ChartsSection";
import ResultsTable from "../components/results/ResultsTable";
import {
  processLocationData,
  processDemographicData,
  processKeywordPopularity,
  processTrendData,
} from "../utils/dataProcessing";

const TopicResultsPage = () => {
  const { topicId } = useParams();
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
      const topicData = await topicService.getTopic(topicId);
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
  }, [topicId, pagination.page, pagination.size, filters]);

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchResults();
    }
  }, [topicId, fetchTopic, fetchResults]);


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
          <ResultsHeader topic={topic} topicId={topicId} />

          {/* Charts Section */}
          <ChartsSection
            results={results}
            processLocationData={processLocationData}
            processDemographicData={processDemographicData}
            processKeywordPopularity={processKeywordPopularity}
            processTrendData={processTrendData}
          />

          {/* Results Table */}
          <ResultsTable
            topicId={topicId}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TopicResultsPage;
