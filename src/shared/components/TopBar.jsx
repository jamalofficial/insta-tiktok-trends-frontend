import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { Menu, User } from "lucide-react";

export default function TopBar({ setSidebarOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/keywords":
        return "Keywords Management";
      case "/search-topics":
        return "Search Topics";
      case "/explore-topics":
        return "Explore Topics";
      case "/users":
        return "User Management";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
          <div className="flex items-center gap-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.role?.name}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
