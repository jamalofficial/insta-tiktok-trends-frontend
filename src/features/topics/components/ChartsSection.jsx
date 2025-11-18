import React from "react";
import PieChart from "@/shared/components/GoogleCharts/PieChart";
import BarChart from "@/shared/components/GoogleCharts/BarChart";
import LineChart from "@/shared/components/GoogleCharts/LineChart";

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

  const processedLocationData = processLocationData ? processLocationData(results) : [];
  const processedDemographicData = processDemographicData ? processDemographicData(results) : [];
  const processedKeywordPopularityData = processKeywordPopularity ? processKeywordPopularity(results) : [];
  const processedTrendData = processTrendData ? processTrendData(results) : [];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Location Distribution */}
      {(showLocations && processedLocationData?.length > 0) && 
        <PieChart
          options={{ header: ["Loaction", "Value"], height: "350px"}}
          title="Location Distribution"
          data={ processedLocationData }
        />
      }

      {/* Demographic Distribution */}
      {(showDemographics && processedDemographicData?.length > 0) && 
        <PieChart
          options={{ header: ["Age Group", "Value"], height: "350px"}}
          title="Demographic Distribution"
          data={ processedDemographicData }
        />
      }

      {/* Keyword Popularity */}
      {(showPopularity && processedKeywordPopularityData?.length > 0) && 
        <BarChart
          data={processedKeywordPopularityData}
          title="Top Keywords by Popularity"
          options={{ 
            header: ["Keyword", "Popularity"], 
            labelKey: "name", 
            matrixKey: "popularity", 
            valueKey: null, 
            colors:["#8b5cf6", "#8b5c00"]
          }}
        />
      }

      {/* Trend Analysis */}
      {(showTrends && processedTrendData.length > 0) && 
        <LineChart
          data={processedTrendData}
          options={{
            header: ["keyword", 'increase'], 
            labelKey:'keyword', valueKey: 'increase', 
            colors: ["#8b5cf6"]
          }}
          title="Top Trending Keywords"
        />
      }
    </div>
  );
};

export default ChartsSection;
