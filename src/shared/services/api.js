import axios from "axios";
import { AUTH_STORAGE_KEYS, API_ENDPOINTS } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await this.api.post(API_ENDPOINTS.LOGIN, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("API Login response:", response.data);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get(API_ENDPOINTS.ME);
    console.log("API getCurrentUser response:", response.data);
    return response.data;
  }

  async logout() {
    const response = await this.api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  }

  async updateUser(userData) {
    const response = await this.api.put(API_ENDPOINTS.UPDATE_USER, userData);
    return response.data;
  }

  // Generic methods
  async get(url) {
    const response = await this.api.get(url);
    return response.data;
  }

  async post(url, data) {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put(url, data) {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
