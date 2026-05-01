import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom";
import './VerifyOtp.css'

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const { completeSignup } = useAuth()

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1].focus()
    }
  }

  const verifyOtp = async () => {
    const email = localStorage.getItem("pendingEmail")
    const token = otp.join("")

    if (!email) {
      setError("Session expired. Please sign up again.")
      return
    }

    if (token.length < 6) {
      setError("Please enter the full 6-digit code.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await completeSignup(email, token)
      navigate("/")
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otp-page">
      <div className="Back-Arrow">
        <Link to="/signup" className="back-img">
          <img src="/Icons/Arrow.svg" alt="Back Arrow" />
        </Link>
      </div>
      <div className="otp-container">
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to your email</p>

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

        {error && <p className="error">{error}</p>}

        <button onClick={verifyOtp} className="Verify-Button" disabled={loading}>
          {loading ? "Verifying…" : "Verify"}
        </button>
      </div>
    </div>
  )
}

export default VerifyOtp
