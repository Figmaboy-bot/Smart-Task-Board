import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import "./AuthFlow.css"

const OTP_LENGTH = 6
const RESEND_SECONDS = 102 // 01:42, matching the design
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function firstNameFrom(email) {
  const local = (email || "").split("@")[0].replace(/[0-9._-]+$/g, "")
  if (!local) return "there"
  return local.charAt(0).toUpperCase() + local.slice(1)
}

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`
}

const PASSWORD_RULES = [
  { key: "length", label: "8+ characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "Number", test: (v) => /[0-9]/.test(v) },
  { key: "special", label: "Special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
]

export default function AuthFlow() {
  const navigate = useNavigate()
  const {
    user,
    checkEmailExists,
    sendSignupOtp,
    verifySignupOtp,
    setPassword,
    login,
    loginAsGuest,
    loginWithGoogle,
  } = useAuth()

  const [step, setStep] = useState("entry") // entry | welcome-back | otp | create-password
  const [email, setEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const otpRefs = useRef([])

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [step, secondsLeft])

  // Clicking the confirmation link in the signup OTP email (instead of
  // typing the code below) signs the user in directly. Land them on the
  // create-password step instead of leaving the account without one.
  useEffect(() => {
    if (user && !user.isGuest && localStorage.getItem("pendingEmail") === user.email) {
      setEmail(user.email)
      setStep("create-password")
    }
  }, [user])

  const resetError = () => error && setError("")

  const handleEntryContinue = async (e) => {
    e.preventDefault()
    resetError()
    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    setLoading(true)
    try {
      const exists = await checkEmailExists(email)
      if (exists) {
        setStep("welcome-back")
      } else {
        await sendSignupOtp(email)
        setOtp(Array(OTP_LENGTH).fill(""))
        setSecondsLeft(RESEND_SECONDS)
        setStep("otp")
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleContinue = async () => {
    resetError()
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.")
    }
  }

  const handleWelcomeBackLogin = async (e) => {
    e.preventDefault()
    resetError()
    if (!loginPassword) {
      setError("Please enter your password.")
      return
    }
    setLoading(true)
    try {
      await login(email, loginPassword)
      navigate("/")
    } catch (err) {
      setError(err.message || "Incorrect password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    resetError()
    const token = otp.join("")
    if (token.length < OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`)
      return
    }
    setLoading(true)
    try {
      await verifySignupOtp(token)
      setStep("create-password")
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return
    resetError()
    try {
      await sendSignupOtp(email)
      setSecondsLeft(RESEND_SECONDS)
    } catch (err) {
      setError(err.message || "Couldn't resend the code. Please try again.")
    }
  }

  const passwordChecks = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(newPassword) }))
  const allRulesMet = passwordChecks.every((r) => r.met)

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    resetError()
    if (!allRulesMet) {
      setError("Please meet all password requirements.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      await setPassword(newPassword)
      navigate("/")
    } catch (err) {
      setError(err.message || "Failed to create your account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const goBackToEntry = () => {
    resetError()
    setLoginPassword("")
    setStep("entry")
  }

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-glow" />

      <div className="auth-flow-logo">
        <img src="/TaskHive Logo.svg" alt="TaskHive" />
      </div>

      <div className="auth-flow-card">
        {step !== "entry" && (
          <button type="button" className="auth-flow-back" onClick={goBackToEntry} aria-label="Back">
            <ArrowLeftIcon />
          </button>
        )}

        {step === "entry" && (
          <>
            <div className="auth-flow-heading">
              <h1>Get Things Done, Together</h1>
              <p>Signup or log in to continue</p>
            </div>

            <div className="auth-flow-body">
              <button type="button" className="auth-flow-google" onClick={handleGoogleContinue}>
                <img src="/Social Icons/Google.svg" alt="" />
                <span>Google</span>
              </button>

              <div className="auth-flow-divider">
                <span className="auth-flow-divider-line" />
                <span className="auth-flow-divider-text">Or</span>
                <span className="auth-flow-divider-line" />
              </div>

              <form onSubmit={handleEntryContinue} className="auth-flow-form" noValidate>
                <div className="auth-flow-field-group">
                  <label htmlFor="auth-email">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                  />
                </div>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Please wait…" : "Continue"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>
              </form>

              <p className="auth-flow-disclaimer">
                By continuing, you acknowledge that you understand and agree to the Terms &amp; Conditions and Privacy Policy
              </p>
            </div>
          </>
        )}

        {step === "welcome-back" && (
          <>
            <div className="auth-flow-heading">
              <h1>Welcome back, {firstNameFrom(email)} 👋</h1>
              <p>Continue to your TaskHive workspace</p>
            </div>

            <div className="auth-flow-user-chip">
              <img src="/Icons/default-profile.svg" alt="" />
              <span>{email}</span>
            </div>

            <div className="auth-flow-body">
              <form onSubmit={handleWelcomeBackLogin} className="auth-flow-form" noValidate>
                <div className="auth-flow-field-group">
                  <label htmlFor="auth-login-password">Password</label>
                  <div className="auth-flow-input-with-icon">
                    <input
                      id="auth-login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Logging in…" : "Log In"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>

                <div className="auth-flow-row-between">
                  <label className="auth-flow-checkbox">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <Link to="/forgot-password" className="auth-flow-link">
                    Forgot password?
                  </Link>
                </div>
              </form>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="auth-flow-heading">
              <h1>Verify your email</h1>
              <p>
                We've sent a {OTP_LENGTH}-digit verification code to <span className="auth-flow-highlight">{email}</span>
              </p>
            </div>

            <div className="auth-flow-body">
              <form onSubmit={handleVerifyOtp} className="auth-flow-form">
                <div className="auth-flow-otp-row">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="auth-flow-otp-input"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <p className="auth-flow-timer">{formatTimer(Math.max(secondsLeft, 0))}</p>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Verifying…" : "Verify Email"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>
              </form>

              <div className="auth-flow-row-between auth-flow-resend">
                <span>Didn't receive the code?</span>
                <button
                  type="button"
                  className="auth-flow-link auth-flow-resend-btn"
                  onClick={handleResendOtp}
                  disabled={secondsLeft > 0}
                >
                  Resend Code
                </button>
              </div>
            </div>
          </>
        )}

        {step === "create-password" && (
          <>
            <div className="auth-flow-heading">
              <h1>Create your password</h1>
              <p>Create a secure password for your account.</p>
            </div>

            <div className="auth-flow-body">
              <form onSubmit={handleCreateAccount} className="auth-flow-form" noValidate>
                <div className="auth-flow-field-group">
                  <label htmlFor="auth-new-password">Password</label>
                  <div className="auth-flow-input-with-icon">
                    <input
                      id="auth-new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="auth-flow-field-group">
                  <label htmlFor="auth-confirm-password">Confirm Password</label>
                  <div className="auth-flow-input-with-icon">
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="auth-flow-rules">
                  <p>Password must contain :</p>
                  <div className="auth-flow-rules-list">
                    {passwordChecks.map((rule) => (
                      <div key={rule.key} className={`auth-flow-rule${rule.met ? " met" : ""}`}>
                        <CheckIcon />
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Creating…" : "Create Account"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>
              </form>
            </div>
          </>
        )}

        {step === "entry" && (
          <button
            type="button"
            className="auth-flow-guest"
            onClick={() => { loginAsGuest(); navigate("/"); }}
          >
            Continue as Guest
          </button>
        )}
      </div>

      <div className="auth-flow-footer">
        <span>Terms &amp; Conditions</span>
        <span>Privacy Policy</span>
      </div>
    </div>
  )
}
