import { Routes, Route, Navigate } from "react-router-dom"
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
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import { useAuth } from "./context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, isInitialized } = useAuth()
  if (!isInitialized) return null
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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