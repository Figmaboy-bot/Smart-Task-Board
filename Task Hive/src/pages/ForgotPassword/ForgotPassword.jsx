import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import "../Auth/AuthFlow.css"

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
    <div className="auth-flow-page">
      <div className="auth-flow-glow" />

      <div className="auth-flow-logo">
        <img src="/TaskHive Logo.svg" alt="TaskHive" />
      </div>

      <div className="auth-flow-card">
        <Link to="/login" className="auth-flow-back" aria-label="Back to login">
          <ArrowLeftIcon />
        </Link>

        <div className="auth-flow-heading">
          <h1>Forgot Password</h1>
          <p>Enter your email and we'll send you a reset code.</p>
        </div>

        <div className="auth-flow-body">
          <form onSubmit={handleSubmit} className="auth-flow-form">
            <div className="auth-flow-field-group">
              <label htmlFor="forgot-password-email">Email</label>
              <input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
                autoFocus
              />
            </div>

            {error && <p className="auth-flow-error">{error}</p>}

            <button type="submit" className="auth-flow-primary-button" disabled={loading}>
              <span>{loading ? "Sending…" : "Send Reset Code"}</span>
              {!loading && <ArrowRightIcon />}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-flow-footer">
        <span>Terms &amp; Conditions</span>
        <span>Privacy Policy</span>
      </div>
    </div>
  )
}
