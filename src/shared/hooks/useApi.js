import { useState, useEffect } from "react";
import api from "../services/api.js";

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "An error occurred"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute };
};

export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "An error occurred"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return { loading, error, execute, reset };
};

// Hook that provides a request function for direct API calls
export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, responseType = "json") => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method: method.toLowerCase(),
        url: url,
        responseType: responseType,
      };

      if (data) {
        config.data = data;
      }

      const response = await api(config);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || err.message || "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return { request, loading, error, reset };
};
