import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../shared/services/dashboard.js";
import { useApiState } from "../../shared/hooks/useApi.js";
import Loading from "../../shared/components/Loading.jsx";
import {
  Users,
  Search,
  Compass,
  Video,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  Calendar,
  Clock,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  onClick,
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <div
      className={`group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl ${
        onClick ? "cursor-pointer hover:scale-105 hover:-translate-y-2" : ""
      }`}
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Icon background with animation */}
              <div
                className={`p-4 rounded-2xl ${colorClasses[color]} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
              >
                <Icon className="h-7 w-7 text-white" />
              </div>
              {/* Animated ring */}
              <div
                className={`absolute inset-0 rounded-2xl ${colorClasses[color]} opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <dl className="space-y-1">
                <dt className="text-sm font-semibold text-gray-600 truncate uppercase tracking-wide">
                  {title}
                </dt>
                <dd className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                  {value}
                </dd>
                {trend && (
                  <dd
                    className={`text-sm font-medium flex items-center space-x-1 ${
                      trendColors[trend.type]
                    }`}
                  >
                    <span className="text-xs">
                      {trend.type === "up"
                        ? "↗"
                        : trend.type === "down"
                        ? "↘"
                        : "→"}
                    </span>
                    <span>
                      {trend.value} {trend.label}
                    </span>
                  </dd>
                )}
              </dl>
            </div>
          </div>

          {onClick && (
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                <ArrowRight className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          )}
        </div>

        {/* Animated progress bar */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
            style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Simple Chart Component (since we don't have recharts installed)
const SimpleChart = ({ data, type = "bar" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  if (type === "bar") {
    return (
      <div className="flex items-end space-x-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-blue-500 rounded-t w-full transition-all duration-500 hover:bg-blue-600"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-gray-600 mt-2 truncate">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pie") {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            cumulativePercentage += percentage;

            const colors = [
              "#3B82F6",
              "#10B981",
              "#8B5CF6",
              "#F59E0B",
              "#EF4444",
            ];

            return (
              <path
                key={index}
                d={`M 16 16 L ${
                  16 + 14 * Math.cos((startAngle * Math.PI) / 180)
                } ${
                  16 + 14 * Math.sin((startAngle * Math.PI) / 180)
                } A 14 14 0 ${percentage > 50 ? 1 : 0} 1 ${
                  16 + 14 * Math.cos((endAngle * Math.PI) / 180)
                } ${16 + 14 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity"
                title={`${item.label}: ${item.value}`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{total}</span>
        </div>
      </div>
    );
  }

  return null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const { loading, error, execute } = useApiState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await execute(dashboardService.getStats);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        Error loading dashboard: {error}
      </div>
    );
  }

  // Mock data for charts and recent activity
  const chartData = [
    { label: "Users", value: stats?.total_users || 0 },
    { label: "Search", value: stats?.total_search_topics || 0 },
    { label: "Explore", value: stats?.total_explore_topics || 0 },
    { label: "Videos", value: stats?.total_videos || 0 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New search topic created",
      user: "Admin User",
      time: "2 minutes ago",
      icon: Search,
      color: "blue",
    },
    {
      id: 2,
      action: "Explore topic updated",
      user: "Editor User",
      time: "15 minutes ago",
      icon: Compass,
      color: "purple",
    },
    {
      id: 3,
      action: "User account created",
      user: "System",
      time: "1 hour ago",
      icon: Users,
      color: "green",
    },
    {
      id: 4,
      action: "Video added to topic",
      user: "Editor User",
      time: "2 hours ago",
      icon: Video,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-0 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-lg text-blue-100 font-medium">
              Welcome to your TikTok database management system
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-100">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm text-yellow-100">
                  Real-time Updates
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right space-y-2">
              <p className="text-sm text-blue-100 font-medium">Last updated</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {new Date().toLocaleTimeString()}
              </p>
              <div className="flex items-center justify-end space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-xs text-blue-200">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          color="blue"
          trend={{ type: "up", value: "+12%", label: "from last month" }}
          onClick={() => navigate("/users")}
        />
        <StatCard
          title="Search Topics"
          value={stats?.total_search_topics || 0}
          icon={Search}
          color="green"
          trend={{ type: "up", value: "+8%", label: "from last week" }}
          onClick={() => navigate("/search-topics")}
        />
        <StatCard
          title="Explore Topics"
          value={stats?.total_explore_topics || 0}
          icon={Compass}
          color="purple"
          trend={{ type: "neutral", value: "0%", label: "no change" }}
          onClick={() => navigate("/explore-topics")}
        />
        <StatCard
          title="Related Videos"
          value={stats?.total_videos || 0}
          icon={Video}
          color="orange"
          trend={{ type: "up", value: "+25%", label: "from last month" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="group bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  Data Overview
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Visual representation of your data
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="p-8">
            <SimpleChart data={chartData} type="bar" />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="group bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  Content Distribution
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Breakdown of content types
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="p-8">
            <SimpleChart data={chartData} type="pie" />
            <div className="mt-6 space-y-3">
              {chartData.map((item, index) => {
                const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: colors[index] }}
                      />
                      <span className="font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {item.value}
                      </span>
                      <span className="text-xs text-gray-500">items</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="group bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Latest system activities and updates
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              purple: "bg-purple-100 text-purple-600",
              orange: "bg-orange-100 text-orange-600",
            };

            return (
              <div
                key={activity.id}
                className="group/item p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className={`p-3 rounded-xl ${
                        colorClasses[activity.color]
                      } group-hover/item:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover/item:text-gray-800 transition-colors duration-300">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        by {activity.user}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 group-hover/item:text-gray-600 transition-colors duration-300">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
