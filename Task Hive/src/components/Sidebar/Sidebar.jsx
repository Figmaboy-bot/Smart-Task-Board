import { useState } from "react";
import './Sidebar.css';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    HomeIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    FolderIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    Cog6ToothIcon,
    MoonIcon,
    ArrowLeftStartOnRectangleIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("Dashboard")
    const [isThemeOn, setIsThemeOn] = useState(true)
    const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleLogout = () => {
        // Add confirmation to prevent accidental logout
        const confirmed = window.confirm("Are you sure you want to logout?")
        if (confirmed) {
            logout()
            navigate("/login")
        }
    }

    const handleNavClick = (item) => {
        setActiveItem(item)
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

    const navItems = [
        { name: "Dashboard", icon: HomeIcon },
        { name: "My Tasks", icon: CheckCircleIcon },
        { name: "All Tasks", icon: ClipboardDocumentListIcon },
        { name: "Projects", icon: FolderIcon },
        { name: "Teams", icon: UserGroupIcon },
        { name: "Calendar", icon: CalendarDaysIcon },
        { name: "Reports & Insights", icon: ChartBarIcon },
    ]

    const collaborationItems = [
        { name: "Messages", icon: ChatBubbleLeftRightIcon },
        { name: "Notifications", icon: BellIcon },
    ]

    const settingsItems = [
        { name: "Settings", icon: Cog6ToothIcon },
        { name: "Theme", icon: MoonIcon, hasToggle: true },
    ]

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Toggle Button */}
            <button 
                className="sidebar-toggle"
                onClick={toggleSidebar}
                type="button"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>

            {/* Workspace Header */}
            <div className="sidebar-workspace">
                <div className="workspace-logo">
                    <div className="workspace-icon">
                        <div className="workspace-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="grid-square"></div>
                            ))}
                        </div>
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="workspace-info">
                        <div className="workspace-name">Design Team</div>
                        <div className="workspace-email">{user?.email || "Workspacename@gmail.com"}</div>
                    </div>
                )}
                {!isCollapsed && (
                    <button
                        className="workspace-dropdown"
                        onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                        type="button"
                    >
                        <ChevronUpIcon />
                        <ChevronDownIcon />
                    </button>
                )}
            </div>

            <div>
                {/* Main Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeItem === item.name
                        return (
                            <button
                                key={item.name}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                onClick={() => handleNavClick(item.name)}
                                type="button"
                                title={isCollapsed ? item.name : ""}
                            >
                                <Icon className="nav-icon" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </button>
                        )
                    })}
                </nav>

                <div className="sidebar-divider"></div>

                {/* Collaboration & Notifications */}
                <div className="sidebar-section">
                    {!isCollapsed && (
                        <div className="section-title">Collaboration & Notifications</div>
                    )}
                    {collaborationItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.name}
                                className="nav-item"
                                onClick={() => handleNavClick(item.name)}
                                type="button"
                                title={isCollapsed ? item.name : ""}
                            >
                                <Icon className="nav-icon" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </button>
                        )
                    })}
                </div>
               <div className="sidebar-divider"></div>
            </div>

            {/* User & Settings */}
            <div className="sidebar-section">
                {!isCollapsed && (
                    <div className="section-title">User & Settings</div>
                )}
                {settingsItems.map((item) => {
                    const Icon = item.icon
                    if (item.hasToggle) {
                        return (
                            <div key={item.name} className="nav-item theme-item">
                                <div className="theme-label">
                                    <Icon className="nav-icon" />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </div>
                                {!isCollapsed && (
                                    <label className="theme-toggle">
                                        <input
                                            type="checkbox"
                                            checked={isThemeOn}
                                            onChange={(e) => setIsThemeOn(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                )}
                            </div>
                        )
                    }
                    return (
                        <button
                            key={item.name}
                            className="nav-item"
                            onClick={() => handleNavClick(item.name)}
                            type="button"
                            title={isCollapsed ? item.name : ""}
                        >
                            <Icon className="nav-icon" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </button>
                    )
                })}
                <button
                    className="nav-item logout-item"
                    onClick={handleLogout}
                    type="button"
                    title={isCollapsed ? "Logout" : ""}
                >
                    <ArrowLeftStartOnRectangleIcon className="nav-icon" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    )
}

export default Sidebar