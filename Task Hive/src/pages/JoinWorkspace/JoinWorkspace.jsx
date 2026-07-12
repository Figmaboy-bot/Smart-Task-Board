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

  const [asyncResult, setAsyncResult] = useState(null) // null | {ok:true,name} | {ok:false,message}
  const attempted = useRef(false)

  // Not signed in yet: remember the token so ProtectedRoute can send the
  // user back here once they log in or finish signing up.
  useEffect(() => {
    if (isInitialized && isGuest && token) {
      localStorage.setItem(PENDING_INVITE_KEY, token)
    }
  }, [isInitialized, isGuest, token])

  // Signed in: redeem the invite exactly once.
  useEffect(() => {
    if (!isInitialized || !token || isGuest) return
    if (attempted.current) return
    attempted.current = true

    localStorage.removeItem(PENDING_INVITE_KEY)
    redeemInviteLink(token)
      .then((joined) => {
        setAsyncResult({ ok: true, name: joined.name })
        setTimeout(() => navigate("/"), 1500)
      })
      .catch((err) => {
        setAsyncResult({ ok: false, message: err.message || "This invite link is invalid or has expired." })
      })
  }, [isInitialized, isGuest, token, redeemInviteLink, navigate])

  let phase = "checking"
  if (isInitialized) {
    if (isGuest) phase = "needs-auth"
    else if (!asyncResult) phase = "joining"
    else if (asyncResult.ok) phase = "success"
    else phase = "error"
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        {phase === "checking" && <h2>Checking invite link…</h2>}

        {phase === "needs-auth" && (
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

        {phase === "joining" && (
          <>
            <h2>Joining workspace…</h2>
            <p>Please wait while we add you.</p>
          </>
        )}

        {phase === "success" && (
          <>
            <h2>You're in!</h2>
            <p>You've joined {asyncResult.name}. Redirecting…</p>
          </>
        )}

        {phase === "error" && (
          <>
            <h2>Invite link invalid</h2>
            <p className="error" style={{ marginTop: 0 }}>{asyncResult.message}</p>
            <Link to="/" className="Verify-Button" style={{ textAlign: "center", textDecoration: "none", display: "block" }}>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
