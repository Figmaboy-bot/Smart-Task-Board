import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import './SignUp.css';
import '../../index.css';
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    signup(formData.email, formData.password);
    navigate("/verify-otp");
  };

  const handleGoogleSignUp = () => {
    console.log('Sign up with Google');
    alert('Google sign-up clicked');
  };

  const handleAppleSignUp = () => {
    console.log('Sign up with Apple');
    alert('Apple sign-up clicked');
  };

  return (
    <div className="signup-container">
      {/* Left Panel - Purple Gradient */}
      <div className="left-panel">
        <img className="Signup-Image" src="/Signup.jpg" alt="Signup" />
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="right-panel">
        <div className="form-wrapper">
          {/* Logo and Header */}
          <div className="header-section">
            <div className="logo-container">
              <img className="logo-icon" src="/TaskHive Logo.svg" alt="Logo" />
            </div>
            <h1 className="title">Sign Up</h1>
            <p className="subtitle">Join TaskHive – Organize, Collaborate, Thrive.</p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="form-fields">
            {/* Email Input */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group" >
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon className="password-icon" /> : <EyeIcon className="password-icon" />}
              </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group" >
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeSlashIcon className="password-icon" /> : <EyeIcon className="password-icon" />}
              </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or Sign Up with</span>
            <div className="divider-line"></div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="social-buttons">
            <button type="button" onClick={handleGoogleSignUp} className="social-button">
              <img className="social-icon" src="/Social Icons/Google.svg" alt="Google" />
              <span className="social-text">Google</span>
            </button>

            <button type="button" onClick={handleAppleSignUp} className="social-button">
              <img className="social-icon" src="/Social Icons/Apple.svg" alt="Apple" />
              <span className="social-text">Apple</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="login-link">
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}