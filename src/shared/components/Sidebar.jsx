import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import {
  LayoutDashboard,
  Users,
  Search,
  Compass,
  X,
  LogOut,
  User,
  HelpCircle,
  Hash,
} from "lucide-react";
import { cn, getRoleColor } from "../utils/index.js";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "editor", "viewer"],
  },
  // {
  //   name: "Keywords",
  //   href: "/keywords",
  //   icon: Hash,
  //   roles: ["super_admin", "admin", "editor", "viewer"],
  // },
  // {
  //   name: "Search Topics",
  //   href: "/search-topics",
  //   icon: Search,
  //   roles: ["super_admin", "admin", "editor", "viewer"],
  // },
  {
    name: "Explore Topics",
    href: "/explore-topics",
    icon: Compass,
    roles: ["super_admin", "admin", "editor", "viewer"],
  },
  {
    name: "User Management",
    href: "/users",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  // {
  //   name: "Help & Support",
  //   href: "/help",
  //   icon: HelpCircle,
  //   roles: ["super_admin", "admin", "editor", "viewer"],
  // },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role?.name || "viewer")
  );

  const renderNavigationItem = (item) => {
    return (
      <Link
        key={item.name}
        to={item.href}
        className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="h-5 w-5 mr-3" />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-white">
                Admin Dashboard abdul
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {filteredNavigation.map(renderNavigationItem)}
          </nav>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    getRoleColor(user?.role?.name)
                  )}
                >
                  {user?.role?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {filteredNavigation.map(renderNavigationItem)}
          </nav>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    getRoleColor(user?.role?.name)
                  )}
                >
                  {user?.role?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
