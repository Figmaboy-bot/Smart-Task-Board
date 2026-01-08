import React, { useState } from "react"
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Settings.css'
import IconButton from "../../components/Buttons/Buttons"
import { PencilIcon } from "@heroicons/react/24/outline"

export default function Settings() {
    const [setting, setSetting] = useState("Profile");
    const defaultProfileImg = "/Profile.jpg";
    const [profilePic, setProfilePic] = useState(defaultProfileImg);
    const settings = ["Profile", "Appearance", "Notifications", "Productivity", "Integrations", "Security", "Preferences"];
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
                                <h3>{setting} Settings</h3>
                                <p>Settings content for {setting} goes here.</p>
                            </div>
                        </div>

                        <div className="settings">
                            <div className="personal-info">
                                <p>Personal Information</p>
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
                            <div className="Role-Workspace">
                                <p>Role & Workspace</p>
                                <div className="role-workspace-form">
                                    <form className="role-workspace-info-form">
                                        <label className="label">
                                            <p>Role:</p>
                                            <input type="text" placeholder="Your Role" className="form-input" />
                                        </label>
                                        <label className="label">
                                            <p>Workspace:</p>
                                            <input type="text" placeholder="Your Workspace" className="form-input" />
                                        </label>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}