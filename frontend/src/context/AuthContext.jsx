import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("access");
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Function to refresh access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");
      if (!refreshToken) return logout();

      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });

      localStorage.setItem("access", response.data.access);
      return response.data.access;
    } catch (error) {
      logout();
    }
  };

  // Axios Interceptor to attach the access token to requests
  axios.interceptors.request.use(
    async (config) => {
      let accessToken = localStorage.getItem("access");
      if (!accessToken) {
        accessToken = await refreshAccessToken();
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  const login = (userData, access, refresh) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
