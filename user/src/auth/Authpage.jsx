// AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Authpage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState('');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Sign Up state
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const redirectAfterAuth = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      await login(email.trim(), password, remember);
      redirectAfterAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please try again.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !signUpEmail || !phone || !signUpPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms of Service.');
      return;
    }

    try {
      await register({
        fullname: fullName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        phone: phone.trim(),
      });
      redirectAfterAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const switchToSignUp = () => {
    setError('');
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(true);
      setIsTransitioning(false);
    }, 300);
  };

  const switchToSignIn = () => {
    setError('');
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(false);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="auth-page">
      {/* Fixed Background Image */}
      <div className="auth-background">
        <div className="auth-background-overlay"></div>
        <img
          className="auth-background-image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WBeSpWNecXfW9FxQaDKRH3aUWPQ8uVq2XzNYU0eqg18kAR_6aU_S-ShN7rFYP4jpD2WSES5rejRZZnnkcYeetcagt2lBzlDZ3646mSdOQXh7E5H90iR2Xh-nworH5gtmDDDUSpO3R9otBZ8vZIJFOKzCmFBwYXBTjY7d1dtQr6zaa6eLc1nMwySNSrU3Yyz9CJUo0IyIn39N3BpU1fGq5TOpePlvRFpxJhEpj4tmo9wQOa3EOrZhRjdqKbAyjQyNS3eLbMQS-v0"
          alt="Background"
        />
      </div>

      {/* Auth Card */}
      <main className="auth-main">
        <div className="auth-card">
          {/* Logo Section */}
          <div className="auth-logo-section">
            <div className="auth-logo-wrapper">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAx5gi9hOlH2pUCt3y70KK04_rvokiFDePEjGcz8ChxKEbqVfCinJhfFLSEsmdaUvqm1WhNSy8kJufTTbTB96iTKN8Pcfp54_xp5PCBcQWIaEbPV7tafOvx1erMnTvn1KBnQXnmdWAzbMG_DwEroMAcgXpPQbl9FIRxwwc6bcoXOPvaZNvTqDi-tYE2XRyHs7p3VLjyJ_-muKFlqHuudmpUe3VfEgxMWTLwKXn6Z6MeRfIyJgo_N6BKbG0JZ_bPAd9Bqzpczrmlhw"
                alt="SportZone Logo"
                className="auth-logo"
              />
            </div>
            
            {/* Toggle Switch */}
            <div className="auth-toggle-container">
              <div className="auth-toggle">
                <button 
                  className={`auth-toggle-btn ${!isSignUp ? 'auth-toggle-active' : ''}`}
                  onClick={switchToSignIn}
                >
                  <span className="material-symbols-outlined">login</span>
                  Sign In
                </button>
                <button 
                  className={`auth-toggle-btn ${isSignUp ? 'auth-toggle-active' : ''}`}
                  onClick={switchToSignUp}
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Sign Up
                </button>
                <div className={`auth-toggle-slider ${isSignUp ? 'auth-toggle-slider-right' : 'auth-toggle-slider-left'}`}>
                  <div className="auth-toggle-ripple"></div>
                </div>
              </div>
            </div>

            <h1 className="auth-title">
              {isSignUp ? 'CREATE ATHLETE ACCOUNT' : 'SIGN IN TO YOUR ZONE'}
            </h1>
            {isSignUp && (
              <p className="auth-subtitle">Join the elite performance community.</p>
            )}
          </div>

          {/* Forms Container with Fade Transition */}
          <div className="auth-forms-container">
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            {/* Sign In Form */}
            <div className={`auth-form-wrapper ${!isSignUp ? 'auth-form-active' : 'auth-form-inactive'}`}>
              <form className="auth-form" onSubmit={handleSignInSubmit}>
                {/* Email Field */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="email">
                    Athlete Email
                  </label>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon material-symbols-outlined">person</span>
                    <input
                      className="auth-input"
                      id="email"
                      placeholder="name@sportzone.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="auth-field">
                  <div className="auth-password-header">
                    <label className="auth-label" htmlFor="password">
                      Secure Password
                    </label>
                    <a className="auth-forgot-link" href="#">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon material-symbols-outlined">lock</span>
                    <input
                      className="auth-input"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="auth-password-toggle"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="auth-remember">
                  <input
                    className="auth-checkbox"
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="auth-remember-label" htmlFor="remember">
                    Remember Me
                  </label>
                </div>

                {/* CTA Button */}
                <div className="auth-cta-wrapper">
                  <button className="auth-cta-button" type="submit" disabled={loading}>
                    {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </div>
              </form>
            </div>

            {/* Sign Up Form */}
            <div className={`auth-form-wrapper ${isSignUp ? 'auth-form-active' : 'auth-form-inactive'}`}>
              <form className="auth-form" onSubmit={handleSignUpSubmit}>
                {/* Full Name */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="full_name">Full Name</label>
                  <div className="auth-input-wrapper">
                    <input
                      className="auth-input"
                      id="full_name"
                      placeholder="John Doe"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <span className="auth-input-icon material-symbols-outlined">person</span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="signup_email">Email Address</label>
                  <div className="auth-input-wrapper">
                    <input
                      className="auth-input"
                      id="signup_email"
                      placeholder="athlete@sportzone.com"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                    <span className="auth-input-icon material-symbols-outlined">mail</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="phone">Phone Number</label>
                  <div className="auth-input-wrapper">
                    <input
                      className="auth-input"
                      id="phone"
                      placeholder="+963 933 000 000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <span className="auth-input-icon material-symbols-outlined">phone</span>
                  </div>
                </div>

                {/* Password Row */}
                <div className="auth-password-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="signup_password">Password</label>
                    <input
                      className="auth-input-full"
                      id="signup_password"
                      placeholder="••••••••"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="confirm_password">Confirm Password</label>
                    <input
                      className="auth-input-full"
                      id="confirm_password"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="auth-terms">
                  <input
                    className="auth-checkbox"
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label className="auth-terms-label" htmlFor="terms">
                    I agree to the <a className="auth-terms-link" href="#">Terms of Service</a> &amp; <a className="auth-terms-link" href="#">Privacy Policy</a>
                  </label>
                </div>

                {/* CTA */}
                <button className="auth-cta-button" type="submit" disabled={loading}>
                  {loading ? 'REGISTERING...' : 'REGISTER NOW'}
                  {!loading && <span className="material-symbols-outlined">bolt</span>}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="auth-bottom">
            <p className="auth-bottom-text">
              {isSignUp ? 'Already have an account?' : "Don't have an athlete account?"}
              <button 
                className="auth-bottom-link"
                onClick={isSignUp ? switchToSignIn : switchToSignUp}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="auth-footer-text">
        Precision Performance © 2024 SportZone Elite Athletics
      </div>
    </div>
  );
};

export default AuthPage;