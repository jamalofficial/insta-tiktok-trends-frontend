import React from "react";
import PieChart from "@/shared/components/charts/PieChart";
import BarChart from "@/shared/components/charts/BarChart";
import LineChart from "@/shared/components/charts/LineChart";

const ChartsSection = ({
  results,
  processLocationData,
  processDemographicData,
  processKeywordPopularity,
  processTrendData,
  showDemographics = true,
  showLocations = true,
  showPopularity = true,
  showTrends = true,
}) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Location Distribution */}
      {showLocations && <PieChart
        data={processLocationData(results)}
        dataKey="value"
        nameKey="name"
        title="Location Distribution"
        height={350}
      />
      }

      {/* Demographic Distribution */}
      {showDemographics && <PieChart
        data={processDemographicData(results)}
        dataKey="value"
        nameKey="name"
        title="Demographic Distribution"
        height={350}
      />
      }

      {/* Keyword Popularity */}
      {showPopularity && <BarChart
        data={processKeywordPopularity(results)}
        dataKey="popularity"
        nameKey="name"
        title="Top Keywords by Popularity"
        height={350}
        color="#8b5cf6"
      />
      }

      {/* Trend Analysis */}
      {showTrends && <LineChart
        data={processTrendData(results)}
        dataKey="increase"
        nameKey="keyword"
        title="Top Trending Keywords"
        height={350}
        color="#06b6d4"
      />
      }
    </div>
  );
};

export default ChartsSection;
