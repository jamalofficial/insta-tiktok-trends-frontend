import React, { useState, useEffect } from "react";
import { authService } from "../../features/auth/services/authService";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setToken(storedToken);
          } catch (authError) {
            console.error("Auth error:", authError);
            // Token is invalid, clear auth data
            authService.clearAuth();
          }
        }
      } catch (initError) {
        console.error("Auth initialization error:", initError);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      // console.log("Starting login process...");
      
      const authResponse = await authService.login(credentials);
      // console.log("Login response:", authResponse);
      
      // Check if we have the access token (handle different possible field names)
      const accessToken = authResponse.access_token || authResponse.token || authResponse.accessToken;
      if (!accessToken) {
        console.error("No access token found in response:", authResponse);
        throw new Error("No access token received from server");
      }
      
      // Set token first before making authenticated requests
      authService.setToken(accessToken);
      setToken(accessToken);
      // console.log("Token set successfully");
      
      // Now get user data with the token set
      const currentUser = await authService.getCurrentUser();
      // console.log("Current user data:", currentUser);
      
      authService.setUser(currentUser);
      setUser(currentUser);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      // Clear any partial auth data on error
      authService.clearAuth();
      setToken(null);
      setUser(null);
      
      return {
        success: false,
        error: error.response?.data?.detail || error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      await authService.register(userData);

      // Auto-login after registration
      const authResponse = await authService.login({
        username: userData.username,
        password: userData.password,
      });

      // Set token first before making authenticated requests
      authService.setToken(authResponse.access_token);
      setToken(authResponse.access_token);

      // Now get user data with the token set
      const currentUser = await authService.getCurrentUser();
      authService.setUser(currentUser);
      setUser(currentUser);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      // Clear any partial auth data on error
      authService.clearAuth();
      setToken(null);
      setUser(null);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.message ||
          "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setToken(null);
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await authService.updateUser(userData);
      authService.setUser(updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Update failed",
      };
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
