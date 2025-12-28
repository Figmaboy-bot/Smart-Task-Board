import { useAuth } from "../../context/AuthContext"
import TeamActivity from "../../components/TeamActivity/TeamActivity"
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Dashboard.css'
import { Greetings } from "../../components/Greetings/Greetings"
import { StatsDashboard } from "../../components/StatsBoard/Statsboard"
import { UpcomingDeadlines } from "../../components/UpcomingDeadlines/UpcomingDealines"

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <Greetings />
        <StatsDashboard />
        <UpcomingDeadlines />
        <TeamActivity />
      </div>
    </div>
  )
}

export default Dashboard