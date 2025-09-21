import { apiService } from "../../../shared/services/api";
import { AUTH_STORAGE_KEYS } from "../../../shared/types/auth";

export class AuthService {
  async login(credentials) {
    return await apiService.login(credentials);
  }

  async register(data) {
    return await apiService.register(data);
  }

  async getCurrentUser() {
    return await apiService.getCurrentUser();
  }

  async logout() {
    return await apiService.logout();
  }

  async updateUser(userData) {
    return await apiService.updateUser(userData);
  }

  // Token management
  setToken(token) {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  // User management
  setUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  }

  // Clear all auth data
  clearAuth() {
    this.removeToken();
    this.removeUser();
  }
}

export const authService = new AuthService();
export default authService;
