import api from "./api.js";

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};
