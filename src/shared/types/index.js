// API Response Types
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// User Types
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
};

// API Response Types
export const API_STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
};

// Common Types
export const SORT_OPTIONS = {
  POPULARITY: "popularity",
  TITLE: "title",
  CREATED_AT: "created_at",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
