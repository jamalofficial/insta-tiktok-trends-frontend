import { api } from "./api.js";

export const keywordsService = {
  // Get all keywords with pagination and sorting
  getKeywords: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip) queryParams.append("skip", params.skip);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);

    const query = queryParams.toString();
    return api.get(`/keywords/${query ? `?${query}` : ""}`);
  },

  // Search keywords
  searchKeywords: (query, params = {}) => {
    const queryParams = new URLSearchParams({ q: query });
    if (params.skip) queryParams.append("skip", params.skip);
    if (params.limit) queryParams.append("limit", params.limit);

    return api.get(`/keywords/search?${queryParams.toString()}`);
  },

  // Get trending keywords
  getTrendingKeywords: (limit = 10) => {
    return api.get(`/keywords/trending?limit=${limit}`);
  },

  // Get keyword statistics
  getKeywordStats: () => {
    return api.get("/keywords/stats");
  },

  // Get keyword by ID with related search topics
  getKeyword: (id) => {
    return api.get(`/keywords/${id}`);
  },

  // Create new keyword
  createKeyword: (keywordData) => {
    return api.post("/keywords", keywordData);
  },

  // Update keyword
  updateKeyword: (id, keywordData) => {
    return api.put(`/keywords/${id}`, keywordData);
  },

  // Delete keyword
  deleteKeyword: (id) => {
    return api.delete(`/keywords/${id}`);
  },

  // Get search topics for a keyword
  getKeywordSearchTopics: (keywordId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.skip) queryParams.append("skip", params.skip);
    if (params.limit) queryParams.append("limit", params.limit);

    const query = queryParams.toString();
    return api.get(
      `/keywords/${keywordId}/search-topics${query ? `?${query}` : ""}`
    );
  },

  // Associate keyword with search topic
  associateKeywordWithSearchTopic: (keywordId, searchTopicId) => {
    return api.post(`/keywords/${keywordId}/search-topics/${searchTopicId}`);
  },

  // Remove association between keyword and search topic
  removeKeywordSearchTopicAssociation: (keywordId, searchTopicId) => {
    return api.delete(`/keywords/${keywordId}/search-topics/${searchTopicId}`);
  },
};
