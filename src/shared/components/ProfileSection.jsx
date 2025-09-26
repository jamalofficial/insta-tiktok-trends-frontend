import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProfileSection = ({ onLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileOpen(false);
  };

  // const handleSettingsClick = () => {
  //   navigate("/settings");
  //   setIsProfileOpen(false);
  // };

  return (
    <div className="relative flex-shrink-0">
      {/* Profile Button */}
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="w-full flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 group"
      >
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center ring-2 ring-gray-600 group-hover:ring-purple-400 transition-all duration-200">
            <span className="text-white font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1 text-left">
          <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-200">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200 truncate">
            {user?.email || "user@example.com"}
          </p>
        </div>
        <svg
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isProfileOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-200">Account</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Settings
            </button>

            {/* <button
              onClick={handleSettingsClick}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button> */}
          </div>

          <div className="border-t border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
