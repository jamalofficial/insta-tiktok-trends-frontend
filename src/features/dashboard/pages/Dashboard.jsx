import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../shared/components/Layout";
import Card from "../../../shared/components/Card";
import Button from "../../../shared/components/Button";
import { useAuth } from "../../../shared/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Manage Topics",
      description: "View and manage your TikTok trends topics",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      color: "indigo",
      onClick: () => navigate("/topics"),
    },
    // {
    //   title: "View Analytics",
    //   description: "Analyze trends and performance metrics",
    //   icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    //   color: "green",
    //   onClick: () => navigate("/analytics"),
    // },
    // {
    //   title: "Settings",
    //   description: "Configure your account and preferences",
    //   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    //   color: "yellow",
    //   onClick: () => navigate("/settings"),
    // },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-lg text-gray-600">
              Manage your TikTok trends data and analytics from your dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start">
                  <div
                    className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mr-4`}
                  >
                    <svg
                      className={`w-6 h-6 text-${action.color}-600`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={action.icon}
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={action.onClick}
                    >
                      Go to {action.title}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* User Profile Card */}
          <Card className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Username:</span>
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`font-medium ${
                    user?.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member since:</span>
                <span className="font-medium">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
