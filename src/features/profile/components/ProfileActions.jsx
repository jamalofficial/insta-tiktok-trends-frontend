import React from "react";

const ProfileActions = ({ isEditing, onEdit, onSave, onCancel }) => {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
      <div className="text-sm text-gray-500">
        {isEditing
          ? "Make your changes and save"
          : "Click edit to modify your profile"}
      </div>
      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileActions;
