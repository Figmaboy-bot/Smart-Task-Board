import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import SignUp from "./pages/Signup/SignUp"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import MyTasks from "./pages/MyTasks/MyTasks"
import AllTasks from "./pages/AllTasks/AllTasks"
import Projects from "./pages/Projects/Projects"
import Teams from "./pages/Teams/Teams"
import Calendar from "./pages/Calendar/Calendar"
import ReportsInsights from "./pages/ReportsInsights/ReportsInsights"
import Messages from "./pages/Messages/Messages"
import Settings from "./pages/Settings/Settings"
import VerifyOtp from "./pages/VerifyOTP/VerifyOtp"
import VerifyMfa from "./pages/VerifyMfa/VerifyMfa"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import JoinWorkspace from "./pages/JoinWorkspace/JoinWorkspace"
import { useAuth } from "./context/AuthContext"
import { useWorkspaces } from "./context/WorkspacesContext"
import WorkspaceOnboarding from "./components/WorkspaceOnboarding/WorkspaceOnboarding"

function ProtectedRoute({ children }) {
  const { user, isInitialized, mfaRequired } = useAuth()
  const { loading: workspacesLoading, workspaces } = useWorkspaces()
  const location = useLocation()
  if (!isInitialized) return null
  if (!user) return <Navigate to="/login" />
  if (!user.isGuest) {
    if (mfaRequired) return <Navigate to="/verify-mfa" />
    if (workspacesLoading) return null
    const pendingInviteToken = localStorage.getItem("pendingInviteToken")
    if (pendingInviteToken && !location.pathname.startsWith("/join/")) {
      return <Navigate to={`/join/${pendingInviteToken}`} />
    }
    if (workspaces.length === 0) return <WorkspaceOnboarding />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
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