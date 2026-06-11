import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from './assets/logo.png';
import bg from './assets/muet.jpg';

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showPassword, setShowPassword] = useState(false);
  const showPasswordTimer = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  useEffect(() => {
    let interval;
    if (locked) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setLocked(false);
            setAttempts(0);
            setTimer(30);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [locked]);

  const isValidEmail = (email) => {
    const lower = email.toLowerCase();
    if (lower.endsWith('@students.muet.edu.pk')) {
      const part = lower.split('@')[0];
      return /^\d{2}(cs|sw|tl|el|es|bm|ce|me|ch|ar|bba|bscs|mech|te|it)\d+$/i.test(part);
    }
    if (
      lower.endsWith('@faculty.muet.edu.pk') ||
      lower.endsWith('@admin.muet.edu.pk')
    ) {
      const part = lower.split('@')[0];
      return /^[a-z]+\.[a-z]+$/.test(part);
    }
    return false;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewUser = () => {
    setError('');
    if (!email) {
      setError('Please enter your MUET email.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Only official MUET emails are allowed.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('muetUsers') || '{}');
    if (users[email]) {
      setError('This email is already registered. Please use Existing User.');
      return;
    }
    const pass = generatePassword();
    users[email] = { password: pass, firstTime: true };
    localStorage.setItem('muetUsers', JSON.stringify(users));
    setGeneratedPass(pass);
    setSavedEmail(email);
    setStep('passwordGenerated');
  };

  const handleLogin = () => {
    if (locked) return;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setEmail('');
      setPassword('');
      if (newAttempts >= 3) {
        setLocked(true);
        setError('Too many wrong attempts. Please wait 30 seconds.');
      } else {
        setError(`Invalid MUET email. ${3 - newAttempts} attempt(s) remaining.`);
      }
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = JSON.parse(localStorage.getItem('muetUsers') || '{}');
      if (!users[email]) {
        setError('Email not registered. Please use New User first.');
        return;
      }
      if (users[email].password !== password) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPassword('');
        if (newAttempts >= 3) {
          setLocked(true);
          setError('Too many wrong attempts. Please wait 30 seconds.');
        } else {
          setError(`Wrong password. ${3 - newAttempts} attempt(s) remaining.`);
        }
        return;
      }
      setError('');
      setAttempts(0);
      localStorage.setItem('loggedInUser', email);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay" />

      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="MUET ORIC Logo" />
        </div>

        <h2>MUET ORIC Portal</h2>
        <p>Sign in to your university account</p>

        {locked && (
          <div className="error-message">
            Account locked. Please wait <strong>{timer}s</strong>
          </div>
        )}

        {!locked && error && (
          <div className="error-message">{error}</div>
        )}

        {/* Step 1 — Initial Login Button */}
        {step === 'initial' && (
          <button className="login-btn" onClick={() => setStep('choose')}>
            Login
          </button>
        )}

        {/* Step 2 — Choose Existing or New */}
        {step === 'choose' && (
          <div className="form-slide">
            <div className="choose-row">
              <button
                className="choose-btn active-choose"
                onClick={() => setStep('existing')}
              >
                Existing User
              </button>
              <button
                className="choose-btn"
                onClick={() => { setStep('newuser'); setEmail(''); setError(''); }}
              >
                New User
              </button>
            </div>
          </div>
        )}

        {/* Step 3A — Existing User Form */}
        {step === 'existing' && (
          <div className="form-slide">
            <div className="choose-row">
              <button className="choose-btn active-choose">Existing User</button>
              <button className="choose-btn" onClick={() => { setStep('newuser'); setEmail(''); setPassword(''); setError(''); }}>
                New User
              </button>
            </div>

            <div className="input-group">
              <label>MUET Email</label>
              <input
                type="email"
              
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={locked}
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={locked}
                  autoComplete="off"
                />
                <span className="eye-icon" onClick={() => {
                  if (showPasswordTimer.current) clearTimeout(showPasswordTimer.current);
                  setShowPassword(true);
                  showPasswordTimer.current = setTimeout(() => setShowPassword(false), 590);
                }}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <button
              className="login-btn"
              onClick={handleLogin}
              disabled={locked || loading}
            >
              {locked ? `Wait ${timer}s` : loading ? (
                <span className="spinner-row">
                  <span className="spinner" /> Logging in...
                </span>
              ) : 'Login'}
            </button>

            <p className="hint-text">
              New to the portal? Switch to New User to register.
            </p>
          </div>
        )}

        {/* Step 3B — New User Form */}
        {step === 'newuser' && (
          <div className="form-slide">
            <div className="choose-row">
              <button className="choose-btn" onClick={() => { setStep('existing'); setEmail(''); setError(''); }}>
                Existing User
              </button>
              <button className="choose-btn active-choose">New User</button>
            </div>

            <div className="input-group">
              <label>MUET Email</label>
              <input
                
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <button className="login-btn" onClick={handleNewUser}>
              Generate Password
            </button>

            <p className="hint-text">
              Already registered? Switch to Existing User to login.
            </p>
          </div>
        )}

        {/* Step 4 — Password Generated */}
        {step === 'passwordGenerated' && (
          <div className="form-slide">
            <div className="pass-generated-box">
              <p className="pass-generated-title">Password Generated</p>
              <p className="pass-generated-sub">Save this password — you will need it to login.</p>
              <div className="pass-display-row">
                <span className="pass-display-text">{generatedPass}</span>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="pass-warning">Use this password with your email to login.</p>
              <button
                className="login-btn"
                onClick={() => {
                  setStep('existing');
                  setEmail(savedEmail);
                  setPassword('');
                  setError('');
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;