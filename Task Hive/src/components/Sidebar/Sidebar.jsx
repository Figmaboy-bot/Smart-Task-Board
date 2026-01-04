import React, { useState } from "react";
import './Sidebar.css';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
    HomeIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    FolderIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    MoonIcon,
    ArrowLeftStartOnRectangleIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import HamburgerMenu from "./HamburgerMenu";
import { useTheme } from "../../context/ThemeContext";

function Sidebar() {
    // User & settings items
    const settingsItems = [
        { name: "Settings", icon: Cog6ToothIcon },
        { name: "Theme", icon: MoonIcon, hasToggle: true },
    ];
    // Main navigation items
    const navItems = [
        { name: "Dashboard", icon: HomeIcon },
        { name: "My Tasks", icon: CheckCircleIcon },
        { name: "All Tasks", icon: ClipboardDocumentListIcon },
        { name: "Projects", icon: FolderIcon },
        { name: "Teams", icon: UserGroupIcon },
        { name: "Calendar", icon: CalendarDaysIcon },
        { name: "Reports & Insights", icon: ChartBarIcon },
    ];

    // Collaborationitems
    const collaborationItems = [
        { name: "Messages", icon: ChatBubbleLeftRightIcon },
    ];
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation();
    const [isThemeOn, setIsThemeOn] = useState(true)
    const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        // Add confirmation to prevent accidental logout
        const confirmed = window.confirm("Are you sure you want to logout?")
        if (confirmed) {
            logout()
            navigate("/login")
        }
    }

    // Map nav item names to routes
    const navRoutes = {
        "Dashboard": "/",
        "My Tasks": "/my-tasks",
        "All Tasks": "/all-tasks",
        "Projects": "/projects",
        "Teams": "/teams",
        "Calendar": "/calendar",
        "Reports & Insights": "/reports-insights",
        "Messages": "/messages",
        "Settings": "/settings",
    };

    const handleNavClick = (item) => {
        if (navRoutes[item]) {
            navigate(navRoutes[item]);
        }
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
    }

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
                                {/* Show Lottie hamburger menu on mobile, chevrons on desktop */}
                                <span className="sidebar-hamburger-menu">
                                    <HamburgerMenu style={{ width: 32, height: 32 }} />
                                </span>
                                <span className="sidebar-chevron-icon">
                                    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </span>
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
                    <div className="workspace-dropdown-menu">
                        {workspaceOptions.map((ws, idx) => (
                            <div
                                key={ws.email}
                                className={`workspace-dropdown-item${idx !== workspaceOptions.length - 1 ? ' with-border' : ''}`}
                                tabIndex={0}
                                role="option"
                                aria-selected={ws.name === 'Design Team'}
                            >
                                <div className="workspace-dropdown-name">{ws.name}</div>
                                <div className="workspace-dropdown-email">{ws.email}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="side-navs">
                {/* Main Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const route = navRoutes[item.name];
                        const isActive = location.pathname === route || (item.name === "Dashboard" && location.pathname === "/");
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
                        );
                    })}
                    {/* Messages nav item highlight */}
                    {collaborationItems.map((item) => {
                        const Icon = item.icon;
                        const route = navRoutes[item.name];
                        const isActive = location.pathname === route;
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
                        );
                    })}
                </nav>

                <div className="sidebar-divider"></div>

            </div>

            {/* User & Settings */}
            <div className="sidebar-section">
                {!isCollapsed && (
                    <div className="section-title">User & Settings</div>
                )}
                {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const route = navRoutes[item.name];
                    const isActive = location.pathname === route;
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
                                            checked={theme === "dark"}
                                            onChange={toggleTheme}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                )}
                            </div>
                        );
                    }
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
                    );
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