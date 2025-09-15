import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiState } from "../../shared/hooks/useApi.js";
import { keywordsService } from "../../shared/services/keywords.js";
import Table from "../../shared/components/Table.jsx";
import Button from "../../shared/components/Button.jsx";
import Modal from "../../shared/components/Modal.jsx";
import KeywordForm from "./KeywordForm.jsx";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ArrowLeft,
  Filter,
  Hash,
  TrendingUp,
  Database,
  BarChart3,
} from "lucide-react";

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const navigate = useNavigate();
  const { loading, error, execute } = useApiState();

  useEffect(() => {
    fetchKeywords();
  }, []);

  useEffect(() => {
    filterKeywords();
  }, [keywords, searchTerm, sortBy]);

  const fetchKeywords = async () => {
    try {
      const data = await execute(keywordsService.getKeywords);
      setKeywords(data);
    } catch (err) {
      console.error("Failed to fetch keywords:", err);
    }
  };

  const filterKeywords = () => {
    if (!Array.isArray(keywords)) {
      setFilteredKeywords([]);
      return;
    }

    let filtered = [...keywords];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (keyword) =>
          keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          keyword.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "popularity":
          return (b.popularity || 0) - (a.popularity || 0);
        case "created_at":
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredKeywords(filtered);
  };

  const handleCreate = () => {
    setSelectedKeyword(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (keyword) => {
    setSelectedKeyword(keyword);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (keyword) => {
    setSelectedKeyword(keyword);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (keywordId) => {
    if (window.confirm("Are you sure you want to delete this keyword?")) {
      try {
        await execute(keywordsService.deleteKeyword, keywordId);
        await fetchKeywords(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete keyword:", err);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedKeyword(null);
  };

  const handleKeywordSaved = () => {
    fetchKeywords(); // Refresh the list
    setShowModal(false);
    setSelectedKeyword(null);
  };

  const handleSearchTopics = (keyword) => {
    navigate(
      `/search-topics?keyword=${encodeURIComponent(keyword.name)}&keywordId=${
        keyword.id
      }`
    );
  };

  const columns = [
    {
      header: "Keyword",
      accessor: "name",
      className: "w-1/4",
      render: (keyword) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">{keyword.name}</span>
          {keyword.is_trending && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              Trending
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      className: "w-1/3",
      render: (keyword) => (
        <span className="text-gray-600 truncate">
          {keyword.description || "No description"}
        </span>
      ),
    },
    {
      header: "Popularity",
      accessor: "popularity",
      className: "w-1/6",
      render: (keyword) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min((keyword.popularity || 0) * 10, 100)}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {keyword.popularity || 0}
          </span>
        </div>
      ),
    },
    {
      header: "Topics Count",
      accessor: "topics_count",
      className: "w-1/6",
      render: (keyword) => (
        <span className="text-sm font-medium text-gray-900">
          {keyword.topics_count || 0}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (keyword) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(keyword)}
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(keyword)}
            className="text-green-600 hover:text-green-900 cursor-pointer"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleSearchTopics(keyword)}
            className="text-purple-600 hover:text-purple-900 cursor-pointer"
            title="Search Topics"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(keyword.id)}
            className="text-red-600 hover:text-red-900 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "w-1/6",
    },
  ];

  const getModalTitle = () => {
    switch (modalMode) {
      case "create":
        return "Create New Keyword";
      case "edit":
        return "Edit Keyword";
      case "view":
        return "Keyword Details";
      default:
        return "Keyword";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Keywords Management
          </h1>
          <p className="mt-1 text-gray-600">
            Manage keywords and search for related topics
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="name">Sort by Name</option>
              <option value="created_at">Sort by Date</option>
            </select>
          </div>
          <Button
            onClick={handleCreate}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Keyword</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Keywords
              </p>
              <p className="text-2xl font-bold">
                {Array.isArray(keywords) ? keywords.length : 0}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Hash className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Trending</p>
              <p className="text-2xl font-bold">
                {Array.isArray(keywords)
                  ? keywords.filter((k) => k.is_trending).length
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Topics
              </p>
              <p className="text-2xl font-bold">
                {Array.isArray(keywords)
                  ? keywords.reduce((sum, k) => sum + (k.topics_count || 0), 0)
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Database className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Avg Popularity
              </p>
              <p className="text-2xl font-bold">
                {Array.isArray(keywords) && keywords.length > 0
                  ? Math.round(
                      keywords.reduce(
                        (sum, k) => sum + (k.popularity || 0),
                        0
                      ) / keywords.length
                    )
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Error: {error}
        </div>
      )}

      <Table
        columns={columns}
        data={filteredKeywords}
        loading={loading}
        emptyMessage="No keywords found"
      />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={getModalTitle()}
        size="md"
      >
        <KeywordForm
          keyword={selectedKeyword}
          mode={modalMode}
          onSave={handleKeywordSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
