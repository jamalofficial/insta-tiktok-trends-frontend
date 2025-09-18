import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiState } from "../../shared/hooks/useApi.js";
import { exploreService } from "../../shared/services/explore.js";
import { formatDate, truncateText } from "../../shared/utils/index.js";
import Table from "../../shared/components/Table.jsx";
import Button from "../../shared/components/Button.jsx";
import Modal from "../../shared/components/Modal.jsx";
import ExploreTopicForm from "./ExploreTopicForm.jsx";
import { Plus, Edit, Trash2, Eye, Search, ArrowLeft, Compass } from "lucide-react";

export default function ExploreTopicsPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  // const navigate = useNavigate();
  const { loading, error, execute } = useApiState();


  const fetchTopics = async () => {
    try {
      let data;
      if (searchQuery) {
        data = await execute(exploreService.searchExploreTopics, searchQuery, {
          skip: page * limit,
          limit,
        });
      } else {
        data = await execute(exploreService.getExploreTopics, {
          skip: page * limit,
          limit,
          sort_by: sortBy,
        });
      }
      setTopics(data);
    } catch (err) {
      console.error("Failed to fetch explore topics:", err);
    }
  };
  
  useEffect(() => {
    fetchTopics();
  }, [page, sortBy, searchQuery]);

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
    if (window.confirm("Are you sure you want to delete this explore topic?")) {
      try {
        await execute(exploreService.deleteExploreTopic, topicId);
        await fetchTopics(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete explore topic:", err);
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

  const handleExplore = (topic) => {
    console.log(topic);
    const url = `https://www.tiktok.com/csi/search?keyword=${topic.title}`;
    window.open(url, '_blank');
  }

  const columns = [
    {
      header: "Topic",
      accessor: "title",
      render: (topic) => (
        <div>
          <div className="font-medium text-gray-900">{topic.title}</div>
          {topic.description && (
            <div className="text-sm text-gray-500 mt-1">
              {truncateText(topic.description, 60)}
            </div>
          )}
        </div>
      ),
      className: "w-1/3",
    },
    // {
    //   header: "Category",
    //   accessor: "category",
    //   render: (topic) => topic.category || "N/A",
    //   className: "w-1/4",
    // },
    // {
    //   header: "Popularity",
    //   accessor: "popularity",
    //   render: (topic) => (
    //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
    //       {topic.popularity || 0}
    //     </span>
    //   ),
    //   className: "w-1/6",
    // },
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
            onClick={() => handleExplore(topic)}
            className="text-green-600 hover:text-green-900"
            title="Explore"
          >
            <Compass className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleView(topic)}
            className="text-blue-600 hover:text-blue-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(topic)}
            className="text-green-600 hover:text-green-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(topic.id)}
            className="text-red-600 hover:text-red-900"
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
        return "Create New Explore Topic";
      case "edit":
        return "Edit Explore Topic";
      case "view":
        return "Explore Topic Details";
      default:
        return "Explore Topic";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Topics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage explore topics and their content
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
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
              {/* <option value="popularity">Sort by Popularity</option> */}
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
        emptyMessage="No explore topics found"
      />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={getModalTitle()}
        size="lg"
      >
        <ExploreTopicForm
          topic={selectedTopic}
          mode={modalMode}
          onSave={handleTopicSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
