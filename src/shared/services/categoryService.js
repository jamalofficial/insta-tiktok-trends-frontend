import { apiService } from "./api";

const endpoint = "/categories";

export class CategoryService {
  // Fetch a single category by its ID
  async getCategory(categoryId) {
    return await apiService.get(`${endpoint}/${categoryId}`);
  }

  // Get paginated list of categories with optional filters and sorting
  async getCategories(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.size) queryParams.append("size", params.size);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);

    // Support filters on: name, slug_or_uuid, status, created_at, updated_at
    if (params.filters && typeof params.filters === "object") {
      // Backend expects all filters as a single JSON string under 'filters'
      queryParams.append("filters", JSON.stringify(params.filters));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}/?${queryString}` : `${endpoint}/`;

    return await apiService.get(url);
  }

  // Create a new category
  // categoryData: { name, slug_or_uuid, status }
  async createCategory(categoryData) {
    return await apiService.post("/categories/", categoryData);
  }

  // Update an existing category
  // categoryData: { name?, slug_or_uuid?, status? }
  async updateCategory(categoryId, categoryData) {
    return await apiService.put(`/categories/${categoryId}`, categoryData);
  }

  // Delete a category by ID
  async deleteCategory(categoryId) {
    return await apiService.delete(`/categories/${categoryId}`);
  }
}

// Export an instance for direct import/use
export const categoryService = new CategoryService();
export default categoryService;
