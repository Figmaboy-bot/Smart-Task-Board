import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline"
import './Header.css'

function Header() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    // Add search functionality here
  }

  return (
    <div className="header">
      {/* Search Bar */}
      <div className="header-search">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks, projects, or team members"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Right Side - Notifications and Profile */}
      <div className="header-right">
        {/* Notifications */}
        <button className="header-notification" type="button" aria-label="Notifications">
          <BellIcon className="notification-icon" />
        </button>

        {/* User Profile */}
        <div className="header-profile">
          <img 
            src="./public/Profile.jpg" 
            alt="Profile" 
            className="profile-image"
          />
        </div>
      </div>
    </div>
  )
}

export default Header