import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import Notifications from "../Notifications/Notifications"
import './MyTasks.css'

export default function MyTasks() {
    return (
        <div className="my-tasks-page">
            <Sidebar />
            <div className="my-tasks-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}