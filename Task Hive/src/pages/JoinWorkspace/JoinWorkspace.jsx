import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useWorkspaces } from "../../context/WorkspacesContext"
import "../VerifyOTP/VerifyOtp.css"

const PENDING_INVITE_KEY = "pendingInviteToken"

export default function JoinWorkspace() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user, isInitialized } = useAuth()
  const { redeemInviteLink } = useWorkspaces()
  const isGuest = !user || user.isGuest

  const [status, setStatus] = useState("checking")
  const [errorMsg, setErrorMsg] = useState("")
  const [workspaceName, setWorkspaceName] = useState("")
  const attempted = useRef(false)

  useEffect(() => {
    if (!isInitialized || !token) return

    if (isGuest) {
      localStorage.setItem(PENDING_INVITE_KEY, token)
      setStatus("needs-auth")
      return
    }

    if (attempted.current) return
    attempted.current = true

    setStatus("joining")
    redeemInviteLink(token)
      .then((joined) => {
        localStorage.removeItem(PENDING_INVITE_KEY)
        setWorkspaceName(joined.name)
        setStatus("success")
        setTimeout(() => navigate("/"), 1500)
      })
      .catch((err) => {
        localStorage.removeItem(PENDING_INVITE_KEY)
        setErrorMsg(err.message || "This invite link is invalid or has expired.")
        setStatus("error")
      })
  }, [isInitialized, isGuest, token, redeemInviteLink, navigate])

  return (
    <div className="otp-page">
      <div className="otp-container">
        {status === "checking" && (
          <>
            <h2>Checking invite link…</h2>
          </>
        )}

        {status === "needs-auth" && (
          <>
            <h2>Join a Workspace</h2>
            <p>Sign in or create an account to accept this invite.</p>
            <Link to="/login" className="Verify-Button" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
              Log In
            </Link>
            <Link
              to="/signup"
              className="Verify-Button"
              style={{ textAlign: "center", textDecoration: "none", display: "block", marginTop: "1rem", background: "transparent", color: "var(--primary-50)", outline: "1px solid var(--primary-50)" }}
            >
              Sign Up
            </Link>
          </>
        )}

        {status === "joining" && (
          <>
            <h2>Joining workspace…</h2>
            <p>Please wait while we add you.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2>You're in!</h2>
            <p>You've joined {workspaceName}. Redirecting…</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Invite link invalid</h2>
            <p className="error" style={{ marginTop: 0 }}>{errorMsg}</p>
            <Link to="/" className="Verify-Button" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
