import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Settings.css'

export default function Settings() {
    return (
        <div className="settings-page">
            <Sidebar />
              <div className="settings-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}