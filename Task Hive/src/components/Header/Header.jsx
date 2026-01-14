import { useState } from "react"
import { MagnifyingGlassIcon, BellIcon, CheckBadgeIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"
import Notifications from "../../pages/Notifications/Notifications"
import { useLocation } from "react-router-dom";
import './Header.css'

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const notifications = [
    {
      group: 'Today',
      items: [
        {
          id: 1,
          type: 'success',
          title: 'Task Completed',
          desc: 'You have completed the task "Design Homepage".',
          time: '9:42 AM',
          icon: <CheckBadgeIcon width={24} height={24} />
        },
        {
          id: 2,
          type: 'grey',
          title: 'New Comment',
          desc: 'John commented on your task "Update Docs".',
          time: '8:15 AM',
          icon: <ChatBubbleLeftEllipsisIcon width={24} height={24} />
        },
      ]
    },
    {
      group: 'Yesterday',
      items: [
        {
          id: 3,
          type: 'warning',
          title: 'Deadline Approaching',
          desc: 'The deadline for "Release v2.0" is tomorrow.',
          time: '4:30 PM',
          icon: <CheckBadgeIcon width={24} height={24} />
        },
        {
          id: 4,
          type: 'error',
          title: 'Task Failed',
          desc: 'The deployment for "Release v2.0" failed.',
          time: '2:10 PM',
          icon: <CheckBadgeIcon width={24} height={24} />
        },
      ]
    }
  ];

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
        </button>
        <Notifications open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} />

        <div className="header-profile">
          <img
            src="/Profile.jpg"
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Header