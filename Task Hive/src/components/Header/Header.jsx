import { useState } from "react"
import { MagnifyingGlassIcon, BellIcon, ExclamationTriangleIcon, ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import Notifications from "../../pages/Notifications/Notifications"
import { useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { useTasks } from "../../hooks/useTasks";
import { useNotifications } from "../../hooks/useNotifications";
import './Header.css'

const NOTIFICATION_ICON = {
  error: <ExclamationTriangleIcon width={24} height={24} />,
  warning: <ClockIcon width={24} height={24} />,
  grey: <CalendarDaysIcon width={24} height={24} />,
};

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { profilePic } = useProfile();
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { tasks } = useTasks();
  const notificationItems = useNotifications(tasks);
  const notifications = notificationItems.map(n => ({ ...n, icon: NOTIFICATION_ICON[n.type] }));

  // Map route to search placeholder
  const searchPlaceholders = {
    "/": "Search dashboard tasks, projects, or team members",
    "/my-tasks": "Search your tasks...",
    "/all-tasks": "Search all tasks...",
    "/projects": "Search projects...",
    "/teams": "Search teams or members...",
    "/calendar": "Search calendar events...",
    "/reports-insights": "Search reports or insights...",
    "/messages": "Search messages or people...",
    "/settings": "Search settings...",
  };
  const placeholder = searchPlaceholders[location.pathname] || "Search tasks, projects, or team members";

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Add search functionality here
  };

  return (
    <div className="header">
      {/* Search Bar */}
      <div className="header-search">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Right Side - Notifications and Profile */}
      <div className="header-right">
        {/* Notifications */}
        <button
          className="header-notification"
          type="button"
          aria-label="Notifications"
          onClick={() => setNotifOpen(true)}
        >
          <BellIcon className="notification-icon" />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>
        <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} />

        <div className="header-profile">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Header