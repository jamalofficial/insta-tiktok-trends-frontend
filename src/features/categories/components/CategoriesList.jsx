import React, { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/shared/services/categoryService";
import SkeletonLoader from "@/shared/components/SkeletonLoader";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import Modal from "@/shared/components/Modal";
import CategoryAddForm from "../pages/CategoryAddForm";
import { Button } from "@/components/ui/button";
import Swal from "@/shared/components/Swal";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getCategories({
        page: pagination.page,
        size: pagination.size,
        search: filters.search,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      });
      setCategories(response.items ?? []);
      setPagination({
        page: response.page,
        size: response.size,
        total: response.total,
        pages: response.pages,
      });
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, filters]);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [pagination.page, filters]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteCategory = async (category) => {
    Swal.confirm(
      `Are you sure you want to delete the category "${category.name}"?`,
      "This action cannot be undone."
    ).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);
        try {
          await categoryService.deleteCategory(category.id);
          setCategories((prev) => prev.filter((c) => c.id !== category.id));
          fetchCategories();
        } catch (err) {
          setError("Failed to delete category.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Modal for Add
  const [showAddForm, setShowAddForm] = useState(false);
  const handleAddCategory = () => setShowAddForm(true);
  const handleAddCategorySubmit = async (category) => {
    await categoryService.createCategory(category);
    setShowAddForm(false);
    fetchCategories();
  };

  if (loading) {
    return <SkeletonLoader variant="table" lines={5} className="min-h-64" />;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Categories</h3>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={filters.search}
            onChange={handleSearchChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug / UUID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th className="px-6 py-3"/>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.slug_or_uuid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.updated_at ? new Date(c.updated_at).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" onClick={() => handleDeleteCategory(c)} className="text-red-500">Delete</Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-center" colSpan={6}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.page - 1) * pagination.size + 1} to {Math.min(pagination.page * pagination.size, pagination.total)} of {pagination.total} categories
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 1}>Previous</Button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button key={pageNum} onClick={() => setPagination((prev) => ({ ...prev, page: pageNum }))} variant={pagination.page === pageNum ? "default" : "outline"}>
                    {pageNum}
                  </Button>
                );
              })}
              <Button onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))} disabled={pagination.page === pagination.pages}>Next</Button>
            </div>
          </div>
        )}
        {/* Add Modal */}
        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <CategoryAddForm onSubmit={handleAddCategorySubmit} isLoading={loading} />
        </Modal>
      </div>
    </div>
  );
};

export default CategoriesList;
