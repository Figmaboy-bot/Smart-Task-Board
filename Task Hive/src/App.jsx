import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from "./pages/Signup/SignUp"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import VerifyOtp from "./pages/VerifyOTP/VerifyOtp"
import { useAuth } from "./context/AuthContext"

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  )
}

export default App