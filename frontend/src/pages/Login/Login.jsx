import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Refresh access token if expired
  const refreshAccessToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        console.error("No refresh token found");
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/token/refresh/',
        { refresh }
      );

      // Store the new access token
      const { access } = response.data;
      localStorage.setItem('access', access);

      // Set the Authorization header globally for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    if (access && refresh) {
      // Decode the access token to check its expiration time
      const decoded = jwt_decode(access);
      const exp = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      // If the access token is expired, try refreshing it
      if (exp < now) {
        refreshAccessToken();
      } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous error

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { email, password }
      );

      // Assuming backend returns user data along with tokens
      const { user, access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Set the Authorization header globally for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Optionally use context to set login state globally
      login(user, access, refresh);

      // Redirect to dashboard or home page after successful login
      navigate('/dashboard');
      console.log('Login successful', response.data);
    } catch (error) {
      setErrorMessage('Invalid email or password'); // Show a generic error message
      console.error('Login error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-4 shadow-sm bg-white rounded-3" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
