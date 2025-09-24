import React from "react";
import ToggleSwitch from "./ToggleSwitch";

const SettingsSection = ({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div
        className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-8 py-6 text-white`}
      >
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8">{icon}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="mt-1 opacity-90">{description}</p>
      </div>
      <div className="p-8 space-y-6">{children}</div>
    </div>
  );
};

export default SettingsSection;
