import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './AllTasks.css'

export default function AllTasks() {
    return (
        <div className="all-tasks-page">
            <Sidebar />
            <div className="all-tasks-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}