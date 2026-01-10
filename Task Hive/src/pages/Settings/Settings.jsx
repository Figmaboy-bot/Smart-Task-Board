import React, { useState } from "react"
import { CheckIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Settings.css'
import IconButton from "../../components/Buttons/Buttons"
import { PencilIcon, ShieldCheckIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline"
import { MdOutlineSave } from "react-icons/md";
import Dropdown from "../../components/Dropdown/Dropdown";


export default function Settings() {
    // Example connection state for each integration
    const [integrationStatus, setIntegrationStatus] = useState({
        'google-calendar': false,
        'slack': true,
        'trello': false,
        'notion': true,
    });

    const handleConnect = (key) => {
        setIntegrationStatus((prev) => ({ ...prev, [key]: true }));
    };
    const [setting, setSetting] = useState("Profile");
    const defaultProfileImg = "/Profile.jpg";
    const [profilePic, setProfilePic] = useState(defaultProfileImg);
    const settings = ["Profile", "Notifications", "Productivity", "Integrations", "Security", "Preferences"];
    const [taskView, setTaskView] = useState("Today");
    const taskViewOptions = [
        { value: "Today", label: "Today" },
        { value: "project1", label: "Project 1" },
        { value: "project2", label: "Project 2" },
    ];

    const [taskPriority, setTaskPriority] = useState("6:00 PM");
    const taskPriorityOptions = [
        { value: "6:00 PM", label: "6:00 PM" },
        { value: "project1", label: "Project 1" },
        { value: "project2", label: "Project 2" },
    ];

    const [dueTime, setDueTime] = useState("all");
    const dueTimeOptions = [
        { value: "all", label: "All Projects" },
        { value: "project1", label: "Project 1" },
        { value: "project2", label: "Project 2" },
    ];

    const [taskReminder, setTaskReminder] = useState("all");
    const taskReminderOptions = [
        { value: "all", label: "All Projects" },
        { value: "project1", label: "Project 1" },
        { value: "project2", label: "Project 2" },
    ];

    // preferences options dropdowns
    const [timeZone, setTimeZone] = useState("Africa/Lagos");
    const timeZoneOptions = [
        { value: "Africa/Lagos", label: "Africa/Lagos" },
        { value: "GMT +5", label: "GMT +5" },
        { value: "GMT -3", label: "GMT -3" },
    ];

    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
    const dateFormatOptions = [
        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
        { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
    ];

    const [timeFormat, setTimeFormat] = useState("24-hour");
    const timeFormatOptions = [
        { value: "24-hour", label: "24-hour" },
        { value: "12-hour", label: "12-hour" },
    ];

    const [language, setLanguage] = useState("English");
    const languageOptions = [
        { value: "English", label: "English" },
        { value: "Spanish", label: "Spanish" },
        { value: "French", label: "French" },
    ];


    // Tab content mapping
    const tabContent = {
        Profile: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Profile Settings</h3>
                        <p>Manage your profile information here.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>
                <div className="settings">
                    <div className="info-form">
                        <form className="personal-info-form">
                            <div className="profile-picture">
                                <p>Profile Picture</p>
                                <div className="placeholder-img-change">
                                    <div className="profile-picture-preview">
                                        <img
                                            src={profilePic || "/default-profile.png"}
                                            alt="Profile Preview"
                                            className="profile-img-preview"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="profile-pic-input"
                                        style={{ display: "none" }}
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                const reader = new FileReader();
                                                reader.onload = ev => setProfilePic(ev.target.result);
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <IconButton
                                        type="button"
                                        className="change-pic-btn"
                                        onClick={() => document.getElementById("profile-pic-input").click()}
                                        text="Change Picture"
                                        icon={PencilIcon}
                                    />
                                </div>
                            </div>
                            <label className="label">
                                <p>Name:</p>
                                <input type="text" placeholder="Your Name" className="form-input" />
                            </label>
                            <label className="label">
                                <p>Email:</p>
                                <input type="email" placeholder="Your Email" className="form-input" />
                            </label>
                        </form>
                    </div>

                </div>
            </div>
        ),
        Notifications: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Notification Settings</h3>
                        <p>Manage your notification preferences here.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>
                <div className="settings">
                    <div className="task-notifications">
                        <h3>Task Notifications</h3>
                        <div className="task-notifications-list">
                            <div className="notification-option">
                                <span>Assigned to a task</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Due date reminders</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Task completed</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="team-notifications">
                        <h3>Team Notifications</h3>
                        <div className="task-notifications-list">
                            <div className="notification-option">
                                <span>Mentions</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Project updates</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>New team members</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-notifications">
                        <h3>Delivery Notifications</h3>
                        <div className="delivery-notifications-list">
                            <DeliveryCheckbox id="delivery-mentions" label="Push" defaultChecked={true} />
                            <DeliveryCheckbox id="delivery-project-updates" label="Email" defaultChecked={false} />
                            <DeliveryCheckbox id="delivery-new-team-members" label="In-app" defaultChecked={true} />
                        </div>
                    </div>
                </div>
            </div>
        ),
        Productivity: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Productivity Settings</h3>
                        <p>Customize productivity tools and options.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>

                <div className="settings">
                    <div className="task-notifications">
                        <h3>Task Defaults</h3>
                        <div className="task-notifications-list">
                            <div className="notification-option">
                                <span>Default task view</span>
                                <Dropdown
                                    options={taskViewOptions}
                                    value={taskView}
                                    onChange={setTaskView}
                                    placeholder="All Projects"
                                    className="custom-select"
                                />
                            </div>
                            <div className="notification-option">
                                <span>Default task priority</span>
                                <Dropdown
                                    options={taskPriorityOptions}
                                    value={taskPriority}
                                    onChange={setTaskPriority}
                                    placeholder="All Projects"
                                    className="custom-select"
                                />
                            </div>
                            <div className="notification-option">
                                <span>Default due time</span>
                                <Dropdown
                                    options={dueTimeOptions}
                                    value={dueTime}
                                    onChange={setDueTime}
                                    placeholder="All Projects"
                                    className="custom-select"
                                />
                            </div>
                            <div className="notification-option">
                                <span>Default task reminder</span>
                                <Dropdown
                                    options={taskReminderOptions}
                                    value={taskReminder}
                                    onChange={setTaskReminder}
                                    placeholder="All Projects"
                                    className="custom-select"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="team-notifications smart-focus-settings">
                        <h3>Smart Focus & Attention Control</h3>
                        <div className="task-notifications-list">
                            <div className="smart-settings">
                                <DeliveryCheckbox id="delivery-mentions" label="Silence non-urgent notifications" defaultChecked={true} />
                                <DeliveryCheckbox id="delivery-hide-completed" label="Hide completed tasks" defaultChecked={true} />
                                <DeliveryCheckbox id="delivery-block-reassignment" label="Block task reassignment during focus" defaultChecked={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        Integrations: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Integrations</h3>
                        <p>Connect with third-party apps and services.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>
                <div className="settings">
                    <div className="integrations-list">
                        <div className="integration-item">
                            <div className="item-logo-desc">
                                <img src="Icons/google-calendar.svg" alt="" />
                                <div className="item-desc">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Google Calendar</h3>
                                        <span className={`status-badge ${integrationStatus['google-calendar'] ? 'connected' : 'not-connected'}`}>
                                            {integrationStatus['google-calendar'] ? 'Connected' : 'Not Connected'}
                                        </span>
                                    </div>
                                    <p>Sync your tasks with Google Calendar.</p>
                                </div>
                            </div>
                            <IconButton
                                type="button"
                                className="connect-btn"
                                onClick={() => handleConnect('google-calendar')}
                                text={integrationStatus['google-calendar'] ? 'Connected' : 'Connect'}
                                icon={PencilIcon}
                                disabled={integrationStatus['google-calendar']}
                            />
                        </div>
                        <div className="integration-item">
                            <div className="item-logo-desc">
                                <img src="Icons/slack.svg" alt="" />
                                <div className="item-desc">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Slack</h3>
                                        <span className={`status-badge ${integrationStatus['slack'] ? 'connected' : 'not-connected'}`}>
                                            {integrationStatus['slack'] ? 'Connected' : 'Not Connected'}
                                        </span>
                                    </div>
                                    <p>Receive task notifications in Slack.</p>
                                </div>
                            </div>
                            <IconButton
                                type="button"
                                className="connect-btn"
                                onClick={() => handleConnect('slack')}
                                text={integrationStatus['slack'] ? 'Connected' : 'Connect'}
                                icon={PencilIcon}
                                disabled={integrationStatus['slack']}
                            />
                        </div>
                        <div className="integration-item">
                            <div className="item-logo-desc">
                                <img src="Icons/trello.svg" alt="" />
                                <div className="item-desc">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Trello</h3>
                                        <span className={`status-badge ${integrationStatus['trello'] ? 'connected' : 'not-connected'}`}>
                                            {integrationStatus['trello'] ? 'Connected' : 'Not Connected'}
                                        </span>
                                    </div>
                                    <p>Import tasks from Trello boards.</p>
                                </div>
                            </div>
                            <IconButton
                                type="button"
                                className="connect-btn"
                                onClick={() => handleConnect('trello')}
                                text={integrationStatus['trello'] ? 'Connected' : 'Connect'}
                                icon={PencilIcon}
                                disabled={integrationStatus['trello']}
                            />
                        </div>
                        <div className="integration-item">
                            <div className="item-logo-desc">
                                <img src="Icons/notion.svg" alt="" className="notion-icon" />
                                <div className="item-desc">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={{ margin: 0 }}>Notion</h3>
                                        <span className={`status-badge ${integrationStatus['notion'] ? 'connected' : 'not-connected'}`}>
                                            {integrationStatus['notion'] ? 'Connected' : 'Not Connected'}
                                        </span>
                                    </div>
                                    <p>Import tasks from Notion pages.</p>
                                </div>
                            </div>
                            <IconButton
                                type="button"
                                className="connect-btn"
                                onClick={() => handleConnect('notion')}
                                text={integrationStatus['notion'] ? 'Connected' : 'Connect'}
                                icon={PencilIcon}
                                disabled={integrationStatus['notion']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ),
        Security: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Security Settings</h3>
                        <p>Update your password and security options.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>

                <div className="settings">
                    <div className="task-notifications">
                        <h3>Account Security</h3>
                        <div className="account-security-form">
                            <p>Password:</p>
                            <input type="password" placeholder="········" className="form-inputs password" />
                        </div>
                    </div>

                    <div className="team-notifications">
                        <h3>Two-Factor Authentication</h3>
                        <div className="two-fa-settings">
                            <p>Status: <span>OFF</span></p>
                            <IconButton
                                type="button"
                                className="enable-2fa-btn"
                                onClick={() => { }}
                                text="Enable 2FA"
                                icon={ShieldCheckIcon}
                            />
                        </div>
                    </div>
                </div>

                <div className="team-notifications smart-focus-settings">
                    <h3>Sessions</h3>
                    <div className="sessions-settings">
                        <div className="session-details">
                            <p>MacBook Pro</p>
                            <p>Lagos, NG</p>
                            <p className="active-now">Active now</p>
                        </div>
                        <IconButton
                            type="button"
                            className="sessions-btn"
                            onClick={() => { }}
                            text="Log out of all sessions"
                            icon={ArrowLeftEndOnRectangleIcon}
                        />
                    </div>
                </div>
            </div>


        ),
        Preferences: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h4>Preferences</h4>
                        <p>Set your app preferences and appearance.</p>
                    </div>
                    <div className="save-btn-container">
                        <IconButton
                            type="button"
                            className="save-btn"
                            onClick={() => { }}
                            text="Save Changes"
                            icon={MdOutlineSave}
                        />
                    </div>
                </div>
                <div className="settings">
                    <div className="task-notifications">
                        <div className="notification-option">
                            <span>Time zone</span>
                            <Dropdown
                                options={timeZoneOptions}
                                value={timeZone}
                                onChange={setTimeZone}
                                placeholder="Africa/Lagos"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Date format</span>
                            <Dropdown
                                options={dateFormatOptions}
                                value={dateFormat}
                                onChange={setDateFormat}
                                placeholder="MM/DD/YYYY"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Time format</span>
                            <Dropdown
                                options={timeFormatOptions}
                                value={timeFormat}
                                onChange={setTimeFormat}
                                placeholder="24-hour"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Language</span>
                            <Dropdown
                                options={languageOptions}
                                value={language}
                                onChange={setLanguage}
                                placeholder="English"
                                className="custom-select"
                            />
                        </div>
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <div className="settings-page">
            <Sidebar />
            <div className="settings-content">
                <Header onNotificationClick={() => { }} />
                <div className="settings-main">
                    <h2>Settings</h2>
                    <div className="settings-container">
                        <div className="tab-header">
                            <div className="settings-sidebar">
                                {settings.map((item) => (
                                    <button
                                        key={item}
                                        className={setting === item ? "active" : ""}
                                        onClick={() => setSetting(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <div className="settings-content-area">
                                {tabContent[setting]}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Checkbox with checkmark icon for delivery notifications
function DeliveryCheckbox({ id, label, defaultChecked }) {
    const [checked, setChecked] = React.useState(!!defaultChecked);
    return (
        <div className="notification-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="checkbox-wrapper">
                <input
                    type="checkbox"
                    className="table-checkbox"
                    id={id}
                    checked={checked}
                    onChange={e => setChecked(e.target.checked)}
                />
                {checked && <CheckIcon className="checkbox-checkmark" />}
            </div>
            <label htmlFor={id} style={{ margin: 0 }}>{label}</label>
        </div>
    );
}