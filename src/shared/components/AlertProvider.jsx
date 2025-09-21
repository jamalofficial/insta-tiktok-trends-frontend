import React, { useState, useCallback } from "react";
import { AlertContext } from "../contexts/AlertContext";
import Alert from "./Alert";

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((alert) => {
    const id = Date.now() + Math.random();
    const newAlert = {
      id,
      ...alert,
    };
    setAlerts((prev) => [...prev, newAlert]);
    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, title = "Success") => {
      return addAlert({ type: "success", title, message });
    },
    [addAlert]
  );

  const showError = useCallback(
    (message, title = "Error") => {
      return addAlert({ type: "error", title, message });
    },
    [addAlert]
  );

  const showWarning = useCallback(
    (message, title = "Warning") => {
      return addAlert({ type: "warning", title, message });
    },
    [addAlert]
  );

  const showInfo = useCallback(
    (message, title = "Info") => {
      return addAlert({ type: "info", title, message });
    },
    [addAlert]
  );

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {/* Alert Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            {...alert}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
