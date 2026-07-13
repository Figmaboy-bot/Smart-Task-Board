import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import AuthFlow from "./pages/Auth/AuthFlow"
import Dashboard from "./pages/Dashboard/Dashboard"
import MyTasks from "./pages/MyTasks/MyTasks"
import AllTasks from "./pages/AllTasks/AllTasks"
import Projects from "./pages/Projects/Projects"
import Teams from "./pages/Teams/Teams"
import Calendar from "./pages/Calendar/Calendar"
import ReportsInsights from "./pages/ReportsInsights/ReportsInsights"
import Messages from "./pages/Messages/Messages"
import Settings from "./pages/Settings/Settings"
import VerifyMfa from "./pages/VerifyMfa/VerifyMfa"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import JoinWorkspace from "./pages/JoinWorkspace/JoinWorkspace"
import { useAuth } from "./context/AuthContext"
import { useWorkspaces } from "./context/WorkspacesContext"
import OnboardingWizard from "./pages/Onboarding/OnboardingWizard"

function ProtectedRoute({ children }) {
  const { user, isInitialized, mfaRequired } = useAuth()
  const { loading: workspacesLoading, loadError: workspacesError, needsOnboarding } = useWorkspaces()
  const location = useLocation()
  if (!isInitialized) return null
  if (!user) return <Navigate to="/login" />
  if (!user.isGuest) {
    if (mfaRequired) return <Navigate to="/verify-mfa" />
    // Clicking the confirmation link in the signup OTP email (instead of
    // typing the code into AuthFlow) signs the user in directly, bypassing
    // the create-password step. Send them back to finish it instead of
    // letting them into an app they have no password for.
    if (localStorage.getItem("pendingEmail") === user.email) {
      return <Navigate to="/login" />
    }
    if (workspacesLoading) return null
    // Don't guess needsOnboarding when the workspace fetch itself failed:
    // defaulting to "no" would strand a brand-new user with no workspace,
    // defaulting to "yes" risks nudging an existing user into recreating one.
    if (workspacesError) {
      return (
        <div className="auth-flow-page">
          <div className="auth-flow-glow" />
          <div className="auth-flow-logo">
            <img src="/TaskHive Logo.svg" alt="TaskHive" />
          </div>
          <div className="auth-flow-card">
            <div className="auth-flow-heading">
              <h1>Couldn't load your workspaces</h1>
              <p>Something went wrong reaching TaskHive. Check your connection and try again.</p>
            </div>
            <div className="auth-flow-body">
              <button type="button" className="auth-flow-primary-button" onClick={() => window.location.reload()}>
                <span>Retry</span>
                <ArrowPathIcon />
              </button>
            </div>
          </div>
        </div>
      )
    }
    const pendingInviteToken = localStorage.getItem("pendingInviteToken")
    if (pendingInviteToken && !location.pathname.startsWith("/join/")) {
      return <Navigate to={`/join/${pendingInviteToken}`} />
    }
    if (needsOnboarding) return <OnboardingWizard />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<AuthFlow />} />
      <Route path="/login" element={<AuthFlow />} />
      <Route path="/verify-mfa" element={<VerifyMfa />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/join/:token" element={<JoinWorkspace />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
      <Route path="/all-tasks" element={<ProtectedRoute><AllTasks /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/reports-insights" element={<ProtectedRoute><ReportsInsights /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  )
}

export default App