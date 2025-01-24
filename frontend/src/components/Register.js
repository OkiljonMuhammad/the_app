import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:3001/api/users/register', formData);
      setFormData({ name: '', email: '', password: '' });
      setMessage('Registration successful!');
      navigate('/')
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Email is already in use.");
      }else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="mt-5 p-3 d-flex flex-column justify-content-center align-items-center">
      <h2>Register</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className='w-25'>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            minLength={3}
            maxLength={50}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            minLength={6}
            maxLength={100}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">Register</button>
      </form>
      <div className="text-center mt-3">
      <span className="mx-2">Have an account?</span>
        <a href="/" className="text-decoration-none">Sign in</a>
      </div>
    </div>
  );
}

export default Register;
