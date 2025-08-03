import React, { useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { FaUserCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import UserManagementModal from './UserManagementModal';
import { fadeIn } from '../utils/animations';
import BackgroundAnimation from './BackgroundAnimation';

const Dashboard = ({ history }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  // Load user data and validate token
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isTokenValid = userData?.token && userData?.tokenExpiration > Date.now();
    
    if (!isTokenValid) {
      localStorage.removeItem('userData');
      if (window.location.pathname !== '/login') {
        history.push('/login');
      }
    } else {
      setUser(userData);
    }
  }, [history]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply fadeIn animation to header
  useEffect(() => {
    if (headerRef.current) {
      fadeIn(headerRef.current);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    history.push('/login');
  };

  const handleCreateSurvey = () => {
    history.push('/create-survey');
  };

  const handleSendForApproval = (surveyId) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, status: 'pending_approval' } : s
    ));
  };

  const handleApproveSurvey = (surveyId) => {
    setSurveys(surveys.map(s => 
      s.id === surveyId ? { ...s, status: 'published' } : s
    ));
  };

  // Styles
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f5f7fa',
      fontFamily: "'Segoe UI', sans-serif",
      overflow: 'auto'
    },
    header: {
      position: 'relative',
      backgroundColor: 'rgba(26, 54, 93, 0.7)',
      color: 'white',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
      overflow: 'visible'
    },
    content: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px auto',
      width: '90%'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#3182ce',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px 0'
    },
    emptyState: {
      borderTop: '1px solid rgba(0,0,0,0.1)',
      paddingTop: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      padding: '15px',
      marginTop: '10px'
    }
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div id="dashboard-container" style={styles.container}>
      <UserManagementModal 
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
      
      <header id="dashboard-header" style={styles.header} ref={headerRef}>
        <BackgroundAnimation containerId="dashboard-header" />
        <div id="dashboard-title-container" style={{ position: 'relative', display: 'inline-block' }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
        <div className="dropdown" ref={dropdownRef}>
          <div 
            className="dropdown-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>Welcome, {user.name}</span>
            {!showDropdown && <FaChevronDown style={{ marginLeft: '5px' }} />}
          </div>
          
          {showDropdown && (
            <div className="dropdown-content">
              <FaChevronDown className="dropdown-arrow" />
              {user.role === 'admin' && (
                <div 
                  className="dropdown-item"
                  onClick={() => setShowUserModal(true)}
                >
                  <FaUserCog style={{ marginRight: '5px' }} />
                  <span>Roles/Users</span>
                </div>
              )}
              <div 
                className="dropdown-item"
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ marginRight: '5px' }} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0 }}>
            <h2 style={{ margin: 0, textAlign: 'left' }}>Your Surveys</h2>
            {(user.role === 'admin' || user.role === 'maker' || user.role === 'checker') && (
              <button 
                className="create-survey-btn"
                onClick={handleCreateSurvey}
              >
                Create Survey
              </button>
            )}
          </div>

          <div style={styles.emptyState}>
            <p style={{ color: '#6c757d' }}>No Survey Forms</p>
          </div>

          {surveys.map(survey => (
            <div key={survey.id} style={{ 
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #eee',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}>
              <h3 style={{ textAlign: 'left' }}>{survey.title}</h3>
              <p style={{ textAlign: 'left' }}>{survey.description}</p>
              <p style={{ textAlign: 'left' }}>Status: {survey.status.replace('_', ' ')}</p>
              
              {user.role === 'maker' && survey.status === 'draft' && (
                <button 
                  style={styles.button}
                  onClick={() => handleSendForApproval(survey.id)}
                >
                  Send for Approval
                </button>
              )}
              
              {user.role === 'checker' && survey.status === 'pending_approval' && (
                <button 
                  style={{ ...styles.button, backgroundColor: '#38a169' }}
                  onClick={() => handleApproveSurvey(survey.id)}
                >
                  Approve Survey
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default withRouter(Dashboard);
