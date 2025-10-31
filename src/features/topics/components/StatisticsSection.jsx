import React from "react";
import StatsCard from "@/shared/components/charts/StatsCard";
import {GaugeCircleIcon, ChartLineIcon, TrendingUpIcon, TrendingDownIcon, TrendingUpDownIcon, ChartNoAxesCombinedIcon } from "lucide-react";

const StatisticsSection = ({
  results,
  calculateStats,
  formatNumber,
  formatPercentage,
}) => {
  if (!results || results.length === 0) return null;

  const stats = calculateStats(results);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Results"
        value={stats.totalResults}
        icon={
          <GaugeCircleIcon className="w-6 h-6"/>
        }
        color="blue"
      />
      <StatsCard
        title="Avg Popularity"
        value={formatNumber(stats.avgPopularity)}
        icon={
          <ChartLineIcon className="w-6 h-6"/>
        }
        color="green"
      />
      <StatsCard
        title="Trending Keywords"
        value={stats.trendingKeywords}
        icon={
          (stats.trendingKeywords > 0) ? <TrendingUpIcon className="w-6 h-6"/>
          : (stats.trendingKeywords < 0) ? <TrendingDownIcon className="w-6 h-6"/>
          : <TrendingUpDownIcon className="w-6 h-6"/>
        }
        color={(stats.trendingKeywords > 0) ? "purple"
          : (stats.trendingKeywords < 0) ? "red"
          : "gray"}
      />
      <StatsCard
        title="Avg Increase"
        value={formatPercentage(stats.avgIncrease)}
        icon={
          <ChartNoAxesCombinedIcon className="w-6 h-6"/>
        }
        color="orange"
      />
    </div>
  );
};

export default StatisticsSection;
