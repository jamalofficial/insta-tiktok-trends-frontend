import React from "react";
import Layout from "@/shared/components/Layout";
import TopKeywordsTable from "../components/TopKeywordsTable";

const TopKeywordsPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Top Keywrods
            </h1>
            <p className="text-lg text-gray-600">
              Explore top keywords.
            </p>
          </div>

          {/* Topics List */}
          <div className="mb-8">
            {/* <TopicsList /> */}
            <TopKeywordsTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopKeywordsPage;
