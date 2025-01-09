import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic client-side validation
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        email,
        password,
      });

      if (response.status === 201) {
        setSuccessMessage("User registered successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.error || "Something went wrong. Please try again."
        );
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-4 shadow-sm bg-white rounded-3" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
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
          {successMessage && <div className="text-success mb-3">{successMessage}</div>}
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account? <a href="/login" className="text-decoration-none">Log in</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
