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
import VerifyOtp from "./pages/VerifyOTP/VerifyOtp"
import { useAuth } from "./context/AuthContext"

console.log("useAuth:", useAuth);

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
      <Route path="/my-tasks" element={<MyTasks />} />
      <Route path="/all-tasks" element={<AllTasks />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/reports-insights" element={<ReportsInsights />} />


    </Routes>
  )
}

export default App