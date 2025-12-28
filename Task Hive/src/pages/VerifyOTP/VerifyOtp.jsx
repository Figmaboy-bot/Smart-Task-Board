import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom";
import './VerifyOtp.css'

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
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

  const verifyOtp = () => {
    const saved = JSON.parse(localStorage.getItem("otp"))
    const enteredOtp = otp.join("")

    if (!saved) {
      setError("OTP expired")
      return
    }

    if (Date.now() > saved.expiresAt) {
      setError("OTP expired")
      localStorage.removeItem("otp")
      return
    }

    if (enteredOtp !== saved.otp) {
      setError("Invalid OTP")
      return
    }

    // OTP valid → create user account with email and password
    if (saved.email && saved.password) {
      completeSignup(saved.email, saved.password)
      localStorage.removeItem("otp")
      navigate("/")
    } else {
      setError("Missing user data. Please sign up again.")
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

        <button onClick={verifyOtp} className="Verify-Button">Verify</button>
      </div>
    </div>
  )
}

export default VerifyOtp