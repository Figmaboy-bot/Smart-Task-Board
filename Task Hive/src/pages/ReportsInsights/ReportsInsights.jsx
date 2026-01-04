import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './ReportsInsights.css'

export default function ReportsInsights() {
    return (
        <div className="reports-insights-page">
            <Sidebar />
              <div className="reports-insights-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}