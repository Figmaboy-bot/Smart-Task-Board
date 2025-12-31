import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import './Login.css';
import '../../index.css';
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('')
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('')
    
    console.log("🔐 Attempting login with:", { 
      email: formData.email, 
      password: formData.password ? "***" : "(empty)",
      passwordLength: formData.password?.length 
    });
    
    // Check localStorage before login
    const checkUser = localStorage.getItem("user")
    console.log("🔍 localStorage check before login:", checkUser)
    
    const success = login(formData.email, formData.password);

    if (success) {
      navigate("/")
    } else {
      setError("Invalid email or password")
    }
  };

  const handleGoogleSignUp = async () => {
    await loginWithGoogle();
  };

  const handleAppleSignUp = () => {
    console.log('Sign up with Apple');
    alert('Apple sign-up clicked');
  };

  return (
    <div className="signup-container">
      {/* Left Panel - Purple Gradient */}
      <div className="left-panel">
        <img className="Signup-Image" src="public/Login.jpg" alt="Signup" />
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className="right-panel">
        <div className="form-wrapper">
          {/* Logo and Header */}
          <div className="header-section">
            <div className="logo-container">
              <img className="logo-icon" src="public/TaskHive Logo.svg" alt="Logo" />
            </div>
            <h1 className="title">Login</h1>
            <p className="subtitle">Welcome Back to TaskHive! Let's Get Things Done.</p>
          </div>

          {/* Login Form */}
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
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280"
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="Password-icon"/> : <EyeIcon className="Password-icon" />}
                </button>
              </div>
            </div>

            {error && <p className="error" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}

            {/* Login Button */}
            <button type="submit" className="submit-button">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">Or Login with</span>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="social-buttons">
            <button type="button" onClick={handleGoogleSignUp} className="social-button">
              <img className="social-icon" src="public/Social Icons/Google.svg" alt="Google" />
              <span className="social-text">Google</span>
            </button>

            <button type="button" onClick={handleAppleSignUp} className="social-button">
              <img className="social-icon" src="public/Social Icons/Apple.svg" alt="Apple" />
              <span className="social-text">Apple</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="login-link">
            Don't have an account? <Link to="/signup">Sign Up Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}