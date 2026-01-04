import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Calendar.css'

export default function Calendar() {
    return (
        <div className="calendar-page">
            <Sidebar />
            <div className="calendar-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}