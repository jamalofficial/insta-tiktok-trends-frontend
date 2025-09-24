import React, { useState } from "react";
import { useAlert } from "../../../shared/hooks/useAlert";
import Layout from "../../../shared/components/Layout";
import SettingsHeader from "../components/SettingsHeader";
import SettingsSection from "../components/SettingsSection";
import SettingsActions from "../components/SettingsActions";
import NotificationSettings from "../components/NotificationSettings";
import PrivacySettings from "../components/PrivacySettings";
import PreferenceSettings from "../components/PreferenceSettings";
import SecuritySettings from "../components/SecuritySettings";

const SettingsPage = () => {
  const { showAlert } = useAlert();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showActivity: true,
    },
    preferences: {
      theme: "light",
      language: "en",
      timezone: "UTC",
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    showAlert("Settings saved successfully!", "success");
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showActivity: true,
      },
      preferences: {
        theme: "light",
        language: "en",
        timezone: "UTC",
      },
      security: {
        twoFactor: false,
        loginAlerts: true,
      },
    });
    showAlert("Settings reset to default", "info");
  };

  // Icon components for better organization
  const NotificationIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z"
      />
    </svg>
  );

  const PrivacyIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  const PreferenceIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
      />
    </svg>
  );

  const SecurityIcon = () => (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <SettingsHeader />

        <div className="space-y-8">
          {/* Notifications Section */}
          <SettingsSection
            title="Notifications"
            description="Manage your notification preferences"
            icon={<NotificationIcon />}
            gradientFrom="from-indigo-600"
            gradientTo="to-purple-600"
          >
            <NotificationSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </SettingsSection>

          {/* Privacy Section */}
          <SettingsSection
            title="Privacy"
            description="Control your privacy and visibility settings"
            icon={<PrivacyIcon />}
            gradientFrom="from-green-600"
            gradientTo="to-teal-600"
          >
            <PrivacySettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection
            title="Preferences"
            description="Customize your application experience"
            icon={<PreferenceIcon />}
            gradientFrom="from-blue-600"
            gradientTo="to-cyan-600"
          >
            <PreferenceSettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection
            title="Security"
            description="Manage your account security settings"
            icon={<SecurityIcon />}
            gradientFrom="from-red-600"
            gradientTo="to-pink-600"
          >
            <SecuritySettings
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </SettingsSection>

          {/* Action Buttons */}
          <SettingsActions
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
