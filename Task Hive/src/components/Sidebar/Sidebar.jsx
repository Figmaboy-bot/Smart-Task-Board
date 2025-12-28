import React, { useState } from "react";
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

    // Dropdown workspace options
    const workspaceOptions = [
        { name: "Personal Workspace", email: "personal@email.com" },
        { name: "Design Team", email: "designteam@email.com" },
        { name: "Dev Workspace", email: "devworkspace@email.com" },
    ];

    // Close dropdown on outside click
    React.useEffect(() => {
        if (!showWorkspaceDropdown) return;
        function handleClick(e) {
            if (!document.querySelector('.workspace-dropdown-menu')?.contains(e.target) &&
                !document.querySelector('.workspace-dropdown')?.contains(e.target)) {
                setShowWorkspaceDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showWorkspaceDropdown]);

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
            <div className="sidebar-workspace" style={{ position: 'relative' }}>
                <div className="workspace-logo">
                    <div className="workspace-icon">
                        <img className="workspace-icon" src="/workspace-icon.svg" alt="Workspace Logo" />
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
                        aria-haspopup="listbox"
                        aria-expanded={showWorkspaceDropdown}
                    >
                        {showWorkspaceDropdown ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                )}
                {/* Dropdown menu */}
                {showWorkspaceDropdown && !isCollapsed && (
                    <div className="workspace-dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
                        marginTop: '8px',
                        zIndex: 100,
                        minWidth: '220px',
                        padding: '8px 0',
                    }}>
                        {workspaceOptions.map((ws, idx) => (
                            <div key={ws.email} style={{
                                padding: '10px 18px',
                                cursor: 'pointer',
                                borderBottom: idx !== workspaceOptions.length - 1 ? '1px solid #f1f5f9' : 'none',
                                background: '#fff',
                                transition: 'background 0.13s',
                            }}
                                className="workspace-dropdown-item"
                                tabIndex={0}
                                role="option"
                                aria-selected={ws.name === 'Design Team'}
                            >
                                <div style={{ fontWeight: 600, color: '#232946', fontSize: '15px' }}>{ws.name}</div>
                                <div style={{ color: '#7b8ca6', fontSize: '13px' }}>{ws.email}</div>
                            </div>
                        ))}
                    </div>
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