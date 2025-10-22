import { apiService } from "./api";

export class TopicsService {

  async getTopic(topicId) {
    return await apiService.get(`/topics/${topicId}`);
  }
  // Get paginated topics
  async getTopics(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);
    console.log("filters", params);
  // Expected filters object example:
  // {
  //   demographic: ["16-17", "18-24", "25-34", "35+", "4-15", "Others"],
  //   region: []
  // }
  // Required format: filters[demographic]=16-17&filters[demographic]=18-24&...
  if (params.filters && typeof params.filters === "object") {
    queryParams.append('filters', JSON.stringify(params.filters));
    // Object.entries(params.filters).forEach(([filterName, values]) => {
    //   if(!['sort_by', 'sort_order', 'search'].includes(filterName)){
    //     if (Array.isArray(values)) {
    //       values.forEach(value => {
    //         queryParams.append(`filters[${filterName}][]`, value);
    //       });
    //     }
    //     else{
    //       queryParams.append(`filters[${filterName}]`, values);
    //     }
    //   }
    // });
  }

    const queryString = queryParams.toString();
    const url = queryString ? `/topics/?${queryString}` : "/topics/";

    return await apiService.get(url);
  }

  // Get topic statistics
  async getTopicStats() {
    return await apiService.get("/topics/stats");
  }

  // Get specific topic with stats
  async getTopicWithStats(topicId) {
    return await apiService.get(`/topics/${topicId}`);
  }

  // Get topic results
  async getTopicResults(topicId, params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.search) queryParams.append("search", params.search);
    if (params.min_popularity)
      queryParams.append("min_popularity", params.min_popularity);
    if (params.max_popularity)
      queryParams.append("max_popularity", params.max_popularity);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/topics/${topicId}/results?${queryString}`
      : `/topics/${topicId}/results`;

    return await apiService.get(url);
  }

  // Create new topic
  async createTopic(topicData) {
    return await apiService.post("/topics/", topicData);
  }

  // Update topic
  async updateTopic(topicId, topicData) {
    return await apiService.put(`/topics/${topicId}`, topicData);
  }

  // Delete topic
  async deleteTopic(topicId) {
    return await apiService.delete(`/topics/${topicId}`);
  }
}

export const topicsService = new TopicsService();
export default topicsService;
