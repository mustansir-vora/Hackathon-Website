import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { saveUserData, getUserData, clearUserData } from '../utils/storage';
import { fadeIn, hoverEffect } from '../utils/animations';
import BackgroundAnimation from './BackgroundAnimation';
import users from '../data/users.json';
import '../styles/login.css';

const NewLogin = ({ history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    if (formRef.current) {
      fadeIn(formRef.current);
    }
    if (buttonRef.current) {
      hoverEffect(buttonRef.current);
    }
    clearUserData(); // Clear any existing session on login page load
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    const user = users.find(u => 
      u.name === username && u.password === password
    );
    
    if (user) {
      saveUserData({
        ...user,
        token: 'sample-auth-token',
        tokenExpiration: Date.now() + (8 * 60 * 60 * 1000) // 8 hours from now
      });
      const { state } = history.location;
      const destination = state?.from?.pathname || '/dashboard';
      history.push(destination);
    } else {
      setError('Invalid credentials. Please retry');
    }
  };

  return (
    <div className="login-container">
      <BackgroundAnimation />
      <div className="logo-container">
        <img src="../assets/logo-header.webp" alt="Company Logo" className="login-logo" />
      </div>
      <form 
        className="login-form" 
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          className="login-btn" 
          type="submit"
          ref={buttonRef}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default withRouter(NewLogin);
