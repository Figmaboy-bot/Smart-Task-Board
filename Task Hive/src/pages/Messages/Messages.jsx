import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Messages.css'

export default function Messages() {
    return (
        <div className="messages-page">
            <Sidebar />
              <div className="messages-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}