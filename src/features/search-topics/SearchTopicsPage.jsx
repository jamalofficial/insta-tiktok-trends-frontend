import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApiState } from "../../shared/hooks/useApi.js";
import { searchService } from "../../shared/services/search.js";
import { formatDate, truncateText } from "../../shared/utils/index.js";
import Table from "../../shared/components/Table.jsx";
import Button from "../../shared/components/Button.jsx";
import Modal from "../../shared/components/Modal.jsx";
import SearchTopicForm from "./SearchTopicForm.jsx";
import { Plus, Edit, Trash2, Eye, Search, ArrowLeft, Hash } from "lucide-react";

export default function SearchTopicsPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, execute } = useApiState();

  useEffect(() => {
    // Check if we came from keywords page
    const urlParams = new URLSearchParams(location.search);
    const keywordParam = urlParams.get("keyword");
    if (keywordParam) {
      setSelectedKeyword(keywordParam);
      setSearchQuery(keywordParam);
    }
    fetchTopics();
  }, [page, sortBy, searchQuery, location.search]);

  const fetchTopics = async () => {
    try {
      let data;
      if (searchQuery) {
        data = await execute(searchService.searchTopics, searchQuery, {
          skip: page * limit,
          limit,
        });
      } else {
        data = await execute(searchService.getSearchTopics, {
          skip: page * limit,
          limit,
          sort_by: sortBy,
        });
      }
      setTopics(data);
    } catch (err) {
      console.error("Failed to fetch search topics:", err);
    }
  };

  const handleCreate = () => {
    setSelectedTopic(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (topic) => {
    setSelectedTopic(topic);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (topicId) => {
    if (window.confirm("Are you sure you want to delete this search topic?")) {
      try {
        await execute(searchService.deleteSearchTopic, topicId);
        await fetchTopics(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete search topic:", err);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTopic(null);
  };

  const handleTopicSaved = () => {
    fetchTopics(); // Refresh the list
    setShowModal(false);
    setSelectedTopic(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    fetchTopics();
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (topic) => (
        <div>
          <div className="font-medium text-gray-900">{topic.title}</div>
          {topic.ai_tips && (
            <div className="text-sm text-gray-500 mt-1">
              {truncateText(topic.ai_tips, 60)}
            </div>
          )}
        </div>
      ),
      className: "w-1/3",
    },
    {
      header: "Quick Actions",
      accessor: "quick_actions",
      render: (topic) =>
        topic.quick_actions ? truncateText(topic.quick_actions, 50) : "N/A",
      className: "w-1/4",
    },
    {
      header: "Popularity",
      accessor: "popularity",
      render: (topic) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {topic.popularity || 0}
        </span>
      ),
      className: "w-1/6",
    },
    {
      header: "Created",
      accessor: "created_at",
      render: (topic) => formatDate(topic.created_at),
      className: "w-1/6",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (topic) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(topic)}
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(topic)}
            className="text-green-600 hover:text-green-900 cursor-pointer"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(topic.id)}
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
        return "Create New Search Topic";
      case "edit":
        return "Edit Search Topic";
      case "view":
        return "Search Topic Details";
      default:
        return "Search Topic";
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
            {selectedKeyword
              ? `Search Topics for "${selectedKeyword}"`
              : "Search Topics"}
          </h1>
          <p className="mt-1 text-gray-600">
            {selectedKeyword
              ? `Manage search topics related to the keyword "${selectedKeyword}"`
              : "Manage search topics and their content"}
          </p>
          {selectedKeyword && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <Hash className="h-4 w-4 mr-1" />
                Keyword: {selectedKeyword}
              </span>
            </div>
          )}
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Topic</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </form>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="title">Sort by Title</option>
              <option value="created_at">Sort by Date</option>
            </select>
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
        data={topics}
        loading={loading}
        emptyMessage="No search topics found"
      />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={getModalTitle()}
        size="lg"
      >
        <SearchTopicForm
          topic={selectedTopic}
          mode={modalMode}
          onSave={handleTopicSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
