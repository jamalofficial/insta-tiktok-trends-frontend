import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProfileSection from "./ProfileSection";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z",
      description: "Overview and insights",
    },
    {
      name: "Topics",
      href: "/topics",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      description: "Trending topics",
    },
  ];
  if (user && user.is_superuser) {
    navigation.push({
      name: "Categories",
      href: "/categories",
      icon: "M4 4h16v16H4V4zm1 1v14h14V5H5zm3 3h8v2H8V8zm0 4h8v2H8v-2z", // Box/folder. Feel free to change!
      description: "Categories management",
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 dark-scrollbar h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col animate-slide-in min-h-0">
          {/* Logo Section */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TikTok Trends</h1>
                <p className="text-xs text-gray-400">Analytics Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href);
                        onClose();
                      }}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 mr-3 p-1.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gray-700 group-hover:bg-gray-600"
                        }`}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.name}</div>
                        <div
                          className={`text-xs ${
                            isActive
                              ? "text-white/80"
                              : "text-gray-400 group-hover:text-gray-300"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group">
                  <div className="flex-shrink-0 mr-3 p-1.5 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-all duration-200">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span>Add New Topic</span>
                </button>
                <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group">
                  <div className="flex-shrink-0 mr-3 p-1.5 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-all duration-200">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span>Export Data</span>
                </button>
              </div>
            </div> */}
          </nav>

          {/* Profile Section */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/50 flex-shrink-0">
            <ProfileSection onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
