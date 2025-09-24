import React from "react";

const ProfileCard = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {children}
    </div>
  );
};

export default ProfileCard;
