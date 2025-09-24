import React from "react";
import ToggleSwitch from "./ToggleSwitch";

const NotificationSettings = ({ settings, onSettingChange }) => {
  return (
    <>
      <ToggleSwitch
        checked={settings.notifications.email}
        onChange={(e) =>
          onSettingChange("notifications", "email", e.target.checked)
        }
        label="Email Notifications"
        description="Receive updates via email"
      />
      <ToggleSwitch
        checked={settings.notifications.push}
        onChange={(e) =>
          onSettingChange("notifications", "push", e.target.checked)
        }
        label="Push Notifications"
        description="Receive push notifications"
      />
      <ToggleSwitch
        checked={settings.notifications.sms}
        onChange={(e) =>
          onSettingChange("notifications", "sms", e.target.checked)
        }
        label="SMS Notifications"
        description="Receive text message alerts"
      />
    </>
  );
};

export default NotificationSettings;
