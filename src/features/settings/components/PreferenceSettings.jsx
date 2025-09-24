import React from "react";

const PreferenceSettings = ({ settings, onSettingChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Theme
        </label>
        <select
          value={settings.preferences.theme}
          onChange={(e) =>
            onSettingChange("preferences", "theme", e.target.value)
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Language
        </label>
        <select
          value={settings.preferences.language}
          onChange={(e) =>
            onSettingChange("preferences", "language", e.target.value)
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
    </div>
  );
};

export default PreferenceSettings;
