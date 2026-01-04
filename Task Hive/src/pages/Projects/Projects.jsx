import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Projects.css'

export default function Projects() {
    return (
        <div className="projects-page">
            <Sidebar />
            <div className="projects-content">
                <Header onNotificationClick={() => setNotifOpen(true)} />
            </div>
        </div>
    )
}