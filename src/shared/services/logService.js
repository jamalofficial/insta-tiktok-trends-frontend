import { apiService } from "./api";

const endpoint = "/logs";

export class LogService {
  // Fetch logs with optional params (filter, pagination, etc.)
  async getLogs(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return await apiService.get(url);
  }

  // Get screenshot for logs (POST)
  async getLogsScreenshot(data) {
    return await apiService.get(`${endpoint}/screenshot`, data);
  }
}

export const logService = new LogService();
export default logService;
