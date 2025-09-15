import api from "./api.js";

export const exploreService = {
  // Get all explore topics
  getExploreTopics: async (params = {}) => {
    const response = await api.get("/explore/topics", { params });
    return response.data;
  },

  // Get trending topics
  getTrendingTopics: async (limit = 10) => {
    const response = await api.get("/explore/topics/trending", {
      params: { limit },
    });
    return response.data;
  },

  // Search explore topics
  searchExploreTopics: async (query, params = {}) => {
    const response = await api.get("/explore/topics/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Get explore topic by ID
  getExploreTopic: async (topicId) => {
    const response = await api.get(`/explore/topics/${topicId}`);
    return response.data;
  },

  // Create explore topic
  createExploreTopic: async (topicData) => {
    const response = await api.post("/explore/topics", topicData);
    return response.data;
  },

  // Update explore topic
  updateExploreTopic: async (topicId, topicData) => {
    const response = await api.put(`/explore/topics/${topicId}`, topicData);
    return response.data;
  },

  // Delete explore topic
  deleteExploreTopic: async (topicId) => {
    const response = await api.delete(`/explore/topics/${topicId}`);
    return response.data;
  },
};
