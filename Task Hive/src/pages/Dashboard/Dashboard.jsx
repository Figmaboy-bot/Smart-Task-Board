
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TeamActivity from "../../components/TeamActivity/TeamActivity";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Notifications from "../Notifications/Notifications";
import './Dashboard.css';
import { Greetings } from "../../components/Greetings/Greetings";
import { StatsDashboard } from "../../components/StatsBoard/Statsboard";
import { UpcomingDeadlines } from "../../components/UpcomingDeadlines/UpcomingDealines";


function Dashboard() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  // Example notifications, replace with real data as needed
  const notifications = [
    "Task 'Design UI' is due tomorrow!",
    "New comment on 'API Integration'",
    "Team meeting at 3 PM"
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header onNotificationClick={() => setNotifOpen(true)} />
        <Greetings />
        <StatsDashboard />
        <UpcomingDeadlines />
        <TeamActivity />
        <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} />
      </div>
    </div>
  );
}

export default Dashboard