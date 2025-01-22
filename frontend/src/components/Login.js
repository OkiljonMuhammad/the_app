import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:3001/api/users/login', formData);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage('Error logging in. Please check your credentials.');
    }
  };

  return (
    <div className="mt-5 p-3 d-flex flex-column justify-content-center align-items-center">
      <h1 className="app-logo">THE APP</h1>
      <h2>Start your journey</h2>
      <h3 className="text-muted">Sign In to The App</h3>
      {message && (
        <div className={`alert ${token ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className='w-25'>
        <div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="test@example.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="rememberMe" />
          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">Sign In</button>
        </div>
      </form>
      <div className="text-center mt-3">
      <span className="mx-2">Don't have an account?</span>
      <a href="/register" className="text-decoration-none">Sign up</a>
        <span className="mx-2">|</span>
        <a href="/" className="text-decoration-none">Forgot password?</a>
      </div>
    </div>
  );
}

export default Login;
