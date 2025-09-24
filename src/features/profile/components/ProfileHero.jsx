import React from "react";

const ProfileHero = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-white">
      <div className="flex items-center space-x-6">
        <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-3xl">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username || "User"}
          </h2>
          <p className="text-purple-100">{user?.email}</p>
          <p className="text-purple-200 text-sm mt-1">
            Member since{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
