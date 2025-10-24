import React from "react";
import Layout from "@/shared/components/Layout";
import CategoryStats from "../components/CategoryStats";
import CategoriesList from "../components/CategoriesList";

const CategoriesPage = () => {
  console.log("here we are...")
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Categories Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage your categories.
            </p>
          </div>
          {/* Statistics Cards */}
          <CategoryStats />
          {/* Categories List */}
          <div className="mb-8">
            <CategoriesList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
