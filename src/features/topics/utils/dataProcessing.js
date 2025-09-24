// Data processing functions for charts
export const processLocationData = (results) => {
  const locationMap = {};

  results.forEach((result) => {
    if (result.location_data && Array.isArray(result.location_data)) {
      result.location_data.forEach((location) => {
        const name = location.name;
        const value = parseFloat(location.value.replace("%", ""));

        if (locationMap[name]) {
          locationMap[name] += value;
        } else {
          locationMap[name] = value;
        }
      });
    }
  });

  return Object.entries(locationMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 locations
};

export const processDemographicData = (results) => {
  const demographicMap = {};

  results.forEach((result) => {
    if (result.demographic_data && Array.isArray(result.demographic_data)) {
      result.demographic_data.forEach((demo) => {
        const name = demo.name;
        const value = parseFloat(demo.value.replace("%", ""));

        if (demographicMap[name]) {
          demographicMap[name] += value;
        } else {
          demographicMap[name] = value;
        }
      });
    }
  });

  return Object.entries(demographicMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const processKeywordPopularity = (results) => {
  return results
    .map((result) => ({
      name: result.relevant_keyword,
      popularity: result.search_popularity || 0,
      increase: result.search_increase || 0,
    }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10); // Top 10 keywords
};

export const processTrendData = (results) => {
  return results
    .filter(
      (result) =>
        result.search_increase !== null && result.search_increase !== undefined
    )
    .map((result) => ({
      keyword: result.relevant_keyword,
      increase: result.search_increase,
    }))
    .sort((a, b) => b.increase - a.increase)
    .slice(0, 8); // Top 8 trending keywords
};

export const calculateStats = (results) => {
  const totalResults = results.length;
  const totalPopularity = results.reduce(
    (sum, result) => sum + (result.search_popularity || 0),
    0
  );
  const avgPopularity = totalResults > 0 ? totalPopularity / totalResults : 0;
  const trendingKeywords = results.filter(
    (result) => result.search_increase && result.search_increase > 0
  ).length;
  const avgIncrease =
    results
      .filter(
        (result) =>
          result.search_increase !== null &&
          result.search_increase !== undefined
      )
      .reduce((sum, result) => sum + result.search_increase, 0) /
      results.filter(
        (result) =>
          result.search_increase !== null &&
          result.search_increase !== undefined
      ).length || 0;

  return {
    totalResults,
    totalPopularity,
    avgPopularity,
    trendingKeywords,
    avgIncrease,
  };
};

// Formatting utilities
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return "N/A";
  return num.toLocaleString();
};

export const formatPercentage = (num) => {
  if (num === null || num === undefined) return "N/A";
  return `${num.toFixed(1)}%`;
};
