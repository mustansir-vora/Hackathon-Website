import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import '../styles/usermanagement.css';
import usersData from '../data/users.json';

const UserManagementModal = ({ visible, onClose }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    name: '', 
    password: '', 
    role: 'maker',
    showPassword: false 
  });
  const [loading, setLoading] = useState(true);

  // New state for tracking which user is editing password
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedPassword, setEditedPassword] = useState('');

  useEffect(() => {
    try {
      if (Array.isArray(usersData)) {
        setUsers(usersData.map(user => ({ ...user, showPassword: false })));
      } else {
        throw new Error('Invalid users data format');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([
        {
          id: 1,
          name: 'admin',
          password: 'admin123',
          role: 'admin',
          showPassword: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUsersToFile = async (usersToSave) => {
    try {
      const usersToStore = usersToSave.map(({showPassword, ...rest}) => rest);
      
      // 1. Save to localStorage for session persistence
      localStorage.setItem('users', JSON.stringify(usersToStore));
      
      // 2. Create downloadable JSON file with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `users-${timestamp}.json`;
      const dataStr = "data:text/json;charset=utf-8," + 
        encodeURIComponent(JSON.stringify(usersToStore, null, 2));
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      
      // 3. Show clear instructions
      alert(`Users data downloaded as ${filename}\n\n` +
            'To update your project:\n' +
            '1. Save the file to src/data/users.json\n' +
            '2. Replace the existing file\n' +
            '3. Refresh the application');
      
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      alert('Failed to save users');
      return false;
    }
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.password) {
      const updatedUsers = [...users, {
        ...newUser,
        id: users.length + 1,
        showPassword: false
      }];
      setUsers(updatedUsers);
      setNewUser({ name: '', password: '', role: 'maker', showPassword: false });
      await saveUsersToFile(updatedUsers);
    }
  };

  const handleDeleteUser = async (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    await saveUsersToFile(updatedUsers);
  };

  const togglePasswordVisibility = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, showPassword: !user.showPassword } : user
    ));
  };

  // New handler for starting password edit
  const handleEditPassword = (user) => {
    setEditingUserId(user.id);
    setEditedPassword(user.password);
  };

  // New handler for saving edited password
  const handleSavePassword = async (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, password: editedPassword } : user
    );
    setUsers(updatedUsers);
    setEditingUserId(null);
    setEditedPassword('');
    await saveUsersToFile(updatedUsers);
  };

  // New handler for canceling password edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedPassword('');
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Management</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td className="password-cell">
                          <div className="password-container">
                            {editingUserId === user.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editedPassword}
                                  onChange={(e) => setEditedPassword(e.target.value)}
                                />
                                <button
                                  onClick={() => handleSavePassword(user.id)}
                                  className="save-password-btn"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="cancel-password-btn"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <span>{user.showPassword ? user.password : '••••••••'}</span>
                                <button 
                                  onClick={() => togglePasswordVisibility(user.id)}
                                  className="toggle-password"
                                >
                                  {user.showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <button
                                  onClick={() => handleEditPassword(user)}
                                  className="edit-password-btn"
                                  title="Edit Password"
                                >
                                  <MdEdit />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="role-cell">{user.role}</td>
                        <td className="action-cell">
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center'}}>No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="add-user-section">
              <h3 className="add-user-title">Add New User</h3>
              <div className="add-user-form">
                <input
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
                <div className="password-input">
                  <input
                    type={newUser.showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                  <button 
                    onClick={() => setNewUser({...newUser, showPassword: !newUser.showPassword})}
                    className="toggle-password-2"
                  >
                    {newUser.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="admin">Admin</option>
                  <option value="maker">Maker</option>
                  <option value="checker">Checker</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button 
                  onClick={handleAddUser}
                  className="add-btn"
                >
                  Add User
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagementModal;
