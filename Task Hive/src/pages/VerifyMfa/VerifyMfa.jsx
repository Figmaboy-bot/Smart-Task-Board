import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import '../VerifyOTP/VerifyOtp.css'

const CODE_LENGTH = 6

function VerifyMfa() {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const { verifyMfa, logout } = useAuth()

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleVerify = async () => {
    const token = code.join("")
    if (token.length < CODE_LENGTH) {
      setError(`Please enter the full ${CODE_LENGTH}-digit code.`)
      return
    }

    setLoading(true)
    setError("")

    try {
      await verifyMfa(token)
      navigate("/")
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h2>Two-Factor Authentication</h2>
        <p>Enter the {CODE_LENGTH}-digit code from your authenticator app</p>

        <div className="otp-inputs">
          {code.map((digit, i) => (
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

        <button onClick={handleVerify} className="Verify-Button" disabled={loading}>
          {loading ? "Verifying…" : "Verify"}
        </button>

        <button onClick={logout} className="Verify-Button" style={{ marginTop: 12, background: "transparent", color: "var(--grey-60)" }}>
          Cancel and sign out
        </button>
      </div>
    </div>
  )
}

export default VerifyMfa
