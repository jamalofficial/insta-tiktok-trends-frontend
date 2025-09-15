import api from "./api.js";

export const usersService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get("/users/", { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post("/users/", userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get all roles
  getRoles: async () => {
    const response = await api.get("/users/roles/");
    return response.data;
  },

  // Create role
  createRole: async (roleData) => {
    const response = await api.post("/users/roles/", roleData);
    return response.data;
  },
};
