import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './ForgotPassword.css'
import '../../index.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await requestPasswordReset(email)
      navigate("/reset-password")
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="left-panel">
        <img className="Signup-Image" src="/Login.jpg" alt="Forgot Password" />
      </div>

      <div className="right-panel">
        <div className="logo-container">
          <img className="logo-icon" src="/TaskHive Logo.svg" alt="Logo" />
        </div>

        <div className="form-wrapper">
          <div className="header-section">
            <h1 className="title">Forgot Password</h1>
            <p className="subtitle">Enter your email and we'll send you a reset code.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-fields">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="form-input"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Code"}
            </button>
          </form>

          <p className="login-link">
            Remember your password? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
