import React from "react";

const SettingsActions = ({ onSave, onReset }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Reset to Default
        </button>
        <button
          onClick={onSave}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsActions;
