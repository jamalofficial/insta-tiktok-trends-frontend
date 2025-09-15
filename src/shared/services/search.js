import api from "./api.js";

export const searchService = {
  // Search Topics
  getSearchTopics: async (params = {}) => {
    const response = await api.get("/search/topics", { params });
    return response.data;
  },

  searchTopics: async (query, params = {}) => {
    const response = await api.get("/search/topics/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  getSearchTopic: async (topicId) => {
    const response = await api.get(`/search/topics/${topicId}`);
    return response.data;
  },

  createSearchTopic: async (topicData) => {
    const response = await api.post("/search/topics", topicData);
    return response.data;
  },

  updateSearchTopic: async (topicId, topicData) => {
    const response = await api.put(`/search/topics/${topicId}`, topicData);
    return response.data;
  },

  deleteSearchTopic: async (topicId) => {
    const response = await api.delete(`/search/topics/${topicId}`);
    return response.data;
  },

  // Search Details
  getSearchDetails: async (topicId) => {
    const response = await api.get(`/search/details/${topicId}`);
    return response.data;
  },

  createSearchDetails: async (topicId, detailsData) => {
    const response = await api.post(`/search/details/${topicId}`, detailsData);
    return response.data;
  },

  updateSearchDetails: async (detailsId, detailsData) => {
    const response = await api.put(`/search/details/${detailsId}`, detailsData);
    return response.data;
  },

  // Script Scenes
  getScriptScenes: async (topicId) => {
    const response = await api.get(`/search/details/${topicId}/scenes`);
    return response.data;
  },

  createScriptScene: async (topicId, sceneData) => {
    const response = await api.post(
      `/search/details/${topicId}/scenes`,
      sceneData
    );
    return response.data;
  },

  updateScriptScene: async (sceneId, sceneData) => {
    const response = await api.put(`/search/scenes/${sceneId}`, sceneData);
    return response.data;
  },

  deleteScriptScene: async (sceneId) => {
    const response = await api.delete(`/search/scenes/${sceneId}`);
    return response.data;
  },

  // Related Videos
  getRelatedVideos: async (topicId) => {
    const response = await api.get(`/search/details/${topicId}/videos`);
    return response.data;
  },

  createRelatedVideo: async (topicId, videoData) => {
    const response = await api.post(
      `/search/details/${topicId}/videos`,
      videoData
    );
    return response.data;
  },

  updateRelatedVideo: async (videoId, videoData) => {
    const response = await api.put(`/search/videos/${videoId}`, videoData);
    return response.data;
  },

  deleteRelatedVideo: async (videoId) => {
    const response = await api.delete(`/search/videos/${videoId}`);
    return response.data;
  },
};
