import React from "react";
import Layout from "../../../shared/components/Layout";
import TopicStats from "../components/TopicStats";
import TopicsList from "../components/TopicsList";

const TopicsPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Topics Management
            </h1>
            <p className="text-lg text-gray-600">
              Explore and manage your TikTok trends topics and analytics.
            </p>
          </div>

          {/* Statistics Cards */}
          <TopicStats />

          {/* Topics List */}
          <div className="mb-8">
            <TopicsList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TopicsPage;
