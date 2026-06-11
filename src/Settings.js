import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import logo from './assets/logo.png';

function getNameFromEmail(email) {
  const part = email.split('@')[0];
  if (part.includes('.')) {
    return part.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return part;
}

function getRoleFromEmail(email) {
  if (email.endsWith('@students.muet.edu.pk')) return 'Student';
  if (email.endsWith('@faculty.muet.edu.pk')) return 'Faculty Member';
  if (email.endsWith('@admin.muet.edu.pk')) return 'Administrator';
  return 'User';
}

function Settings() {
  const navigate = useNavigate();
  const email = localStorage.getItem('loggedInUser') || '';
  const name = getNameFromEmail(email);
  const role = getRoleFromEmail(email);
  const initial = email.charAt(0).toUpperCase();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const oldTimer = React.useRef(null);
  const newTimer = React.useRef(null);
  const confirmTimer = React.useRef(null);

  const toggleEye = (type) => {
    if (type === 'old') {
      if (oldTimer.current) clearTimeout(oldTimer.current);
      setShowOld(true);
      oldTimer.current = setTimeout(() => setShowOld(false), 590);
    } else if (type === 'new') {
      if (newTimer.current) clearTimeout(newTimer.current);
      setShowNew(true);
      newTimer.current = setTimeout(() => setShowNew(false), 590);
    } else {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      setShowConfirm(true);
      confirmTimer.current = setTimeout(() => setShowConfirm(false), 590);
    }
  };

  const eyeOpen = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const eyeClosed = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const handleChangePassword = () => {
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('muetUsers') || '{}');
    if (!users[email]) {
      setError('User not found.');
      return;
    }
    if (users[email].password !== oldPassword) {
      setError('Current password is incorrect.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      users[email].password = newPassword;
      users[email].firstTime = false;
      localStorage.setItem('muetUsers', JSON.stringify(users));
      setLoading(false);
      setSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  return (
    <div className="settings-root">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="MUET ORIC" />
          <span>MUET ORIC</span>
        </div>
        <nav className="sidebar-nav">
          <button className="sidebar-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="sidebar-link active-link">Settings</button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main */}
      <main className="settings-main">
        <div className="settings-layout">

          {/* Left Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">{initial}</div>
            <p className="profile-name">{name}</p>
            <p className="profile-email">{email}</p>
            <span className="profile-role">{role}</span>
          </div>

          {/* Right Change Password */}
          <div className="settings-card">
            <h2>Account Settings</h2>
            <p>Manage your MUET ORIC portal account</p>

            <div className="divider" />

            <h3>Change Password</h3>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="settings-section">
              <label>Current Password</label>
              <div className="pw-wrapper">
                <input
                  type={showOld ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="off"
                />
                <span className="eye-icon" onClick={() => toggleEye('old')}>
                  {showOld ? eyeOpen : eyeClosed}
                </span>
              </div>
            </div>

            <div className="settings-section">
              <label>New Password</label>
              <div className="pw-wrapper">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="off"
                />
                <span className="eye-icon" onClick={() => toggleEye('new')}>
                  {showNew ? eyeOpen : eyeClosed}
                </span>
              </div>
            </div>

            <div className="settings-section">
              <label>Confirm New Password</label>
              <div className="pw-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="off"
                />
                <span className="eye-icon" onClick={() => toggleEye('confirm')}>
                  {showConfirm ? eyeOpen : eyeClosed}
                </span>
              </div>
            </div>

            <button className="save-btn" onClick={handleChangePassword} disabled={loading}>
              {loading ? 'Saving...' : 'Save New Password'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;