import React from "react";
import ToggleSwitch from "./ToggleSwitch";

const PrivacySettings = ({ settings, onSettingChange }) => {
  return (
    <>
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Profile Visibility
        </label>
        <select
          value={settings.privacy.profileVisibility}
          onChange={(e) =>
            onSettingChange("privacy", "profileVisibility", e.target.value)
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <ToggleSwitch
        checked={settings.privacy.showEmail}
        onChange={(e) =>
          onSettingChange("privacy", "showEmail", e.target.checked)
        }
        label="Show Email Address"
        description="Display email on your profile"
      />
    </>
  );
};

export default PrivacySettings;
