import { useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import './ResetPassword.css'

const OTP_LENGTH = 8

export default function ResetPassword() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""))
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const { confirmPasswordReset, requestPasswordReset } = useAuth()

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleResend = async () => {
    const email = localStorage.getItem("pendingResetEmail")
    if (!email) {
      setError("Session expired. Please request a new code.")
      return
    }
    try {
      await requestPasswordReset(email)
      setResent(true)
      setError("")
    } catch (err) {
      setError(err.message || "Failed to resend code.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setResent(false)

    const token = otp.join("")
    if (token.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`)
      return
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await confirmPasswordReset(token, newPassword)
      navigate("/")
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otp-page">
      <div className="Back-Arrow">
        <Link to="/login" className="back-img">
          <img src="/Icons/Arrow.svg" alt="Back Arrow" />
        </Link>
      </div>
      <div className="otp-container">
        <h2>Reset Password</h2>
        <p>Enter the {OTP_LENGTH}-digit code sent to your email, then choose a new password.</p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }} noValidate>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                placeholder="·"
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
              />
            ))}
          </div>

          <div className="reset-password-fields">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {resent && <p style={{ color: "#22c55e", marginTop: "0.5rem" }}>Code resent — check your email.</p>}

          <button type="submit" className="Verify-Button" disabled={loading}>
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <button type="button" className="resend-link" onClick={handleResend}>
          Didn't get a code? Resend
        </button>
      </div>
    </div>
  )
}
