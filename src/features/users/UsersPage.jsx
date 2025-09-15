import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiState } from "../../shared/hooks/useApi.js";
import { usersService } from "../../shared/services/users.js";
import { formatDate, getRoleColor } from "../../shared/utils/index.js";
import Table from "../../shared/components/Table.jsx";
import Button from "../../shared/components/Button.jsx";
import Modal from "../../shared/components/Modal.jsx";
import UserForm from "./UserForm.jsx";
import { Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const navigate = useNavigate();
  const { loading, error, execute } = useApiState();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await execute(usersService.getUsers);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await execute(usersService.getRoles);
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await execute(usersService.deleteUser, userId);
        await fetchUsers(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    fetchUsers(); // Refresh the list
    setShowModal(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      header: "Username",
      accessor: "username",
      className: "w-1/4",
    },
    {
      header: "Email",
      accessor: "email",
      className: "w-1/4",
    },
    {
      header: "Role",
      accessor: "role",
      render: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            user.role?.name
          )}`}
        >
          {user.role?.name}
        </span>
      ),
      className: "w-1/6",
    },
    {
      header: "Created",
      accessor: "created_at",
      render: (user) => formatDate(user.created_at),
      className: "w-1/6",
    },
    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(user)}
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(user)}
            className="text-green-600 hover:text-green-900 cursor-pointer"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
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
        return "Create New User";
      case "edit":
        return "Edit User";
      case "view":
        return "User Details";
      default:
        return "User";
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          Error: {error}
        </div>
      )}

      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
      />

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={getModalTitle()}
        size="md"
      >
        <UserForm
          user={selectedUser}
          roles={roles}
          mode={modalMode}
          onSave={handleUserSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
}
