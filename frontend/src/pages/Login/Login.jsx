import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message
  
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,    // Ensure email is sent as 'email'
        password, // Ensure password is sent as 'password'
      });
  
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Invalid email or password');
      } else {
        setErrorMessage('Network error. Please try again.');
      }
    }
  };  

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-4 shadow-sm bg-white rounded-3" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Log In</h2>
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
          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">Don't have an account? <a href="/signup" className="text-decoration-none">Sign up</a></small>
        </div>
      </div>
    </div>
  );
};

export default Login;
