import React from "react";
import ToggleSwitch from "./ToggleSwitch";

const SecuritySettings = ({ settings, onSettingChange }) => {
  return (
    <>
      <ToggleSwitch
        checked={settings.security.twoFactor}
        onChange={(e) =>
          onSettingChange("security", "twoFactor", e.target.checked)
        }
        label="Two-Factor Authentication"
        description="Add an extra layer of security"
      />
      <ToggleSwitch
        checked={settings.security.loginAlerts}
        onChange={(e) =>
          onSettingChange("security", "loginAlerts", e.target.checked)
        }
        label="Login Alerts"
        description="Get notified of new login attempts"
      />
    </>
  );
};

export default SecuritySettings;
