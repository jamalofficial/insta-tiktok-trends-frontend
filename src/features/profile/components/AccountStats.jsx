import React from "react";

const AccountStats = ({ user }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Account Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <span className="text-gray-500">Member since:</span>
          <p className="font-medium text-gray-900">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Last login:</span>
          <p className="font-medium text-gray-900">
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Account status:</span>
          <p className="font-medium text-green-600">Active</p>
        </div>
      </div>
    </div>
  );
};

export default AccountStats;
