import React, { useState } from "react"
import { CheckIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import './Settings.css'
import IconButton from "../../components/Buttons/Buttons"
import { PencilIcon, ShieldCheckIcon, ArrowLeftEndOnRectangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { MdOutlineSave } from "react-icons/md";
import Dropdown from "../../components/Dropdown/Dropdown";
import LogoutModal from "../../components/Logout/LogoutModal.jsx";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspacesContext";
import { usePreferences } from "../../context/PreferencesContext";
import { supabase } from "../../utils/supabaseClient";

let listFactorsPromise = null;

export default function Settings() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isGuest = !user || user.isGuest;
    const {
        workspaces, activeWorkspaceId, activeWorkspace, setActiveWorkspaceId, createWorkspace,
        members, pendingInvites, membersLoading, removeMember, cancelInvite,
    } = useWorkspaces();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [creatingWorkspace, setCreatingWorkspace] = useState(false);
    const [workspaceError, setWorkspaceError] = useState("");
    const isOwner = activeWorkspace?.role === "Owner";

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim() || creatingWorkspace) return;
        setCreatingWorkspace(true);
        setWorkspaceError("");
        try {
            await createWorkspace(newWorkspaceName);
            setNewWorkspaceName("");
        } catch (err) {
            setWorkspaceError(err.message || "Failed to create workspace.");
        } finally {
            setCreatingWorkspace(false);
        }
    };

    const handleRemoveMember = (memberRowId) => {
        if (!window.confirm("Remove this person's access to the workspace?")) return;
        removeMember(memberRowId).catch((err) => alert(err.message || "Failed to remove member."));
    };

    const handleCancelInvite = (inviteId) => {
        if (!window.confirm("Cancel this pending invite?")) return;
        cancelInvite(inviteId).catch((err) => alert(err.message || "Failed to cancel invite."));
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        logout();
        navigate("/login");
    };

    const { profilePic, updateProfilePic } = useProfile();
    const { preferences, updatePreferences } = usePreferences();
    const [setting, setSetting] = useState("Profile");
    const settings = ["Profile", "Workspace", "Notifications", "Productivity", "Integrations", "Security", "Preferences"];

    const setPref = (key) => (value) => {
        updatePreferences({ [key]: value }).catch((err) => console.error("Failed to save preference:", err));
    };
    const togglePref = (key) => (e) => setPref(key)(e.target.checked);

    const priorityOptions = [
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
    ];

    const timeZoneOptions = [
        { value: "UTC", label: "UTC" },
        { value: "Africa/Lagos", label: "Africa/Lagos" },
        { value: "America/New_York", label: "America/New York" },
        { value: "America/Los_Angeles", label: "America/Los Angeles" },
        { value: "Europe/London", label: "Europe/London" },
        { value: "Asia/Dubai", label: "Asia/Dubai" },
    ];

    const dateFormatOptions = [
        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
        { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
    ];

    const timeFormatOptions = [
        { value: "24-hour", label: "24-hour" },
        { value: "12-hour", label: "12-hour" },
    ];

    const languageOptions = [
        { value: "English", label: "English" },
    ];

    // Security tab state
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChangePassword = async () => {
        setPasswordMessage("");
        setPasswordError("");
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords don't match.");
            return;
        }
        setPasswordSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setPasswordMessage("Password updated.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err.message || "Failed to update password.");
        } finally {
            setPasswordSaving(false);
        }
    };

    // Two-factor authentication (Supabase Auth TOTP MFA)
    const [mfaFactors, setMfaFactors] = useState([]);
    const [mfaLoading, setMfaLoading] = useState(!isGuest);
    const [mfaEnrolling, setMfaEnrolling] = useState(false);
    const [mfaQrCode, setMfaQrCode] = useState("");
    const [mfaFactorId, setMfaFactorId] = useState(null);
    const [mfaCode, setMfaCode] = useState("");
    const [mfaError, setMfaError] = useState("");
    const [mfaBusy, setMfaBusy] = useState(false);
    const verifiedTotpFactor = mfaFactors.find((f) => f.factor_type === "totp" && f.status === "verified");

    const refreshMfaFactors = async () => {
        // Deduped at module scope so React StrictMode's double-invoked mount
        // effect doesn't fire two concurrent requests against Supabase's
        // internal auth lock (throws NavigatorLockAcquireTimeoutError). Also
        // guarded with try/catch since a lock timeout rejects rather than
        // resolving to { error }, which would otherwise skip setMfaLoading(false).
        try {
            if (!listFactorsPromise) {
                listFactorsPromise = supabase.auth.mfa.listFactors().finally(() => { listFactorsPromise = null; });
            }
            const { data, error } = await listFactorsPromise;
            if (!error) setMfaFactors(data?.totp || []);
        } catch (err) {
            console.error("Failed to load 2FA factors:", err);
        } finally {
            setMfaLoading(false);
        }
    };

    React.useEffect(() => {
        if (isGuest) {
            setMfaLoading(false);
            return;
        }
        refreshMfaFactors();
    }, [isGuest]);

    const handleStartEnroll2fa = async () => {
        setMfaError("");
        setMfaBusy(true);
        try {
            const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
            if (error) throw error;
            setMfaFactorId(data.id);
            setMfaQrCode(data.totp.qr_code);
            setMfaEnrolling(true);
        } catch (err) {
            setMfaError(err.message || "Failed to start 2FA enrollment.");
        } finally {
            setMfaBusy(false);
        }
    };

    const handleVerify2fa = async () => {
        setMfaError("");
        if (mfaCode.trim().length !== 6) {
            setMfaError("Enter the 6-digit code from your authenticator app.");
            return;
        }
        setMfaBusy(true);
        try {
            const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
            if (challengeError) throw challengeError;

            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId: mfaFactorId,
                challengeId: challenge.id,
                code: mfaCode.trim(),
            });
            if (verifyError) throw verifyError;

            setMfaEnrolling(false);
            setMfaQrCode("");
            setMfaFactorId(null);
            setMfaCode("");
            await refreshMfaFactors();
        } catch (err) {
            setMfaError(err.message || "Invalid code. Please try again.");
        } finally {
            setMfaBusy(false);
        }
    };

    const handleCancelEnroll2fa = async () => {
        if (mfaFactorId) {
            await supabase.auth.mfa.unenroll({ factorId: mfaFactorId }).catch(() => { });
        }
        setMfaEnrolling(false);
        setMfaQrCode("");
        setMfaFactorId(null);
        setMfaCode("");
        setMfaError("");
    };

    const handleDisable2fa = async () => {
        if (!verifiedTotpFactor) return;
        if (!window.confirm("Disable two-factor authentication?")) return;
        setMfaBusy(true);
        try {
            const { error } = await supabase.auth.mfa.unenroll({ factorId: verifiedTotpFactor.id });
            if (error) throw error;
            await refreshMfaFactors();
        } catch (err) {
            setMfaError(err.message || "Failed to disable 2FA.");
        } finally {
            setMfaBusy(false);
        }
    };


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
                                                reader.onload = ev => updateProfilePic(ev.target.result);
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
                                <input type="text" placeholder="Your Name" className="form-inputs" />
                            </label>
                            <label className="label">
                                <p>Email:</p>
                                <input type="email" placeholder="Your Email" className="form-inputs" />
                            </label>
                        </form>
                    </div>

                </div>
            </div>
        ),
        Workspace: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Workspace Settings</h3>
                        <p>Manage the workspaces you belong to.</p>
                    </div>
                </div>
                <div className="settings">
                    {isGuest ? (
                        <div className="task-notifications">
                            <h3>Workspace</h3>
                            <p>Guest sessions don&apos;t use real workspaces. Sign up for an account to create and manage workspaces.</p>
                        </div>
                    ) : (
                        <>
                            <div className="task-notifications">
                                <h3>Your Workspaces</h3>
                                <div className="integrations-list">
                                    {workspaces.map((ws) => (
                                        <div className="integration-item" key={ws.id}>
                                            <div className="item-logo-desc">
                                                <div className="item-desc">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <h3 style={{ margin: 0 }}>{ws.name}</h3>
                                                        <span className={`status-badge ${ws.id === activeWorkspaceId ? 'connected' : 'not-connected'}`}>
                                                            {ws.id === activeWorkspaceId ? 'Active' : ws.role}
                                                        </span>
                                                    </div>
                                                    <p>{ws.role === "Owner" ? "You own this workspace." : "You're a member of this workspace."}</p>
                                                </div>
                                            </div>
                                            <IconButton
                                                type="button"
                                                className="connect-btn"
                                                onClick={() => setActiveWorkspaceId(ws.id)}
                                                text={ws.id === activeWorkspaceId ? 'Current' : 'Switch'}
                                                icon={PencilIcon}
                                                disabled={ws.id === activeWorkspaceId}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="task-notifications">
                                <h3>Members of {activeWorkspace?.name || "this workspace"}</h3>
                                {membersLoading ? (
                                    <p>Loading members…</p>
                                ) : (
                                    <div className="integrations-list">
                                        {members.map((m) => (
                                            <div className="integration-item" key={m.id}>
                                                <div className="item-logo-desc">
                                                    <div className="item-desc">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <h3 style={{ margin: 0 }}>{m.email || "Unknown"}</h3>
                                                            <span className={`status-badge ${m.role === 'Owner' ? 'connected' : 'not-connected'}`}>
                                                                {m.role}
                                                            </span>
                                                            {m.user_id === user.id && (
                                                                <span className="status-badge not-connected">You</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isOwner && m.user_id !== user.id && (
                                                    <IconButton
                                                        type="button"
                                                        className="connect-btn"
                                                        onClick={() => handleRemoveMember(m.id)}
                                                        text="Remove"
                                                        icon={XMarkIcon}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        {members.length === 0 && <p>No members yet.</p>}
                                    </div>
                                )}
                            </div>

                            {pendingInvites.length > 0 && (
                                <div className="team-notifications">
                                    <h3>Pending Invites</h3>
                                    <div className="integrations-list">
                                        {pendingInvites.map((inv) => (
                                            <div className="integration-item" key={inv.id}>
                                                <div className="item-logo-desc">
                                                    <div className="item-desc">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <h3 style={{ margin: 0 }}>{inv.email}</h3>
                                                            <span className="status-badge not-connected">{inv.role}</span>
                                                        </div>
                                                        <p>Invited {new Date(inv.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {isOwner && (
                                                    <IconButton
                                                        type="button"
                                                        className="connect-btn"
                                                        onClick={() => handleCancelInvite(inv.id)}
                                                        text="Cancel"
                                                        icon={XMarkIcon}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="team-notifications">
                                <h3>Create a New Workspace</h3>
                                <div className="account-security-form">
                                    <p>Workspace name:</p>
                                    <input
                                        type="text"
                                        placeholder="e.g. Marketing Team"
                                        className="form-inputs"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    />
                                </div>
                                {workspaceError && <p style={{ color: "var(--error-50)" }}>{workspaceError}</p>}
                                <IconButton
                                    type="button"
                                    className="save-btn"
                                    onClick={handleCreateWorkspace}
                                    text={creatingWorkspace ? "Creating…" : "Create Workspace"}
                                    icon={MdOutlineSave}
                                    disabled={creatingWorkspace || !newWorkspaceName.trim()}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        ),
        Notifications: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h3>Notification Settings</h3>
                        <p>Manage your notification preferences here. Changes save automatically.</p>
                    </div>
                </div>
                <div className="settings">
                    <div className="task-notifications">
                        <h3>Task Notifications</h3>
                        <div className="task-notifications-list">
                            <div className="notification-option">
                                <span>Assigned to a task</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" checked={preferences.notify_assigned} onChange={togglePref("notify_assigned")} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Due date reminders</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" checked={preferences.notify_due_date} onChange={togglePref("notify_due_date")} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Task completed</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" checked={preferences.notify_task_completed} onChange={togglePref("notify_task_completed")} />
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
                                    <input type="checkbox" checked={preferences.notify_mentions} onChange={togglePref("notify_mentions")} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>Project updates</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" checked={preferences.notify_project_updates} onChange={togglePref("notify_project_updates")} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="notification-option">
                                <span>New team members</span>
                                <label className="theme-toggle">
                                    <input type="checkbox" checked={preferences.notify_new_team_members} onChange={togglePref("notify_new_team_members")} />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="delivery-notifications">
                        <h3>Delivery Notifications</h3>
                        <div className="delivery-notifications-list">
                            <DeliveryCheckbox id="delivery-push" label="Push" checked={preferences.delivery_push} onChange={togglePref("delivery_push")} />
                            <DeliveryCheckbox id="delivery-email" label="Email" checked={preferences.delivery_email} onChange={togglePref("delivery_email")} />
                            <DeliveryCheckbox id="delivery-in-app" label="In-app" checked={preferences.delivery_in_app} onChange={togglePref("delivery_in_app")} />
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
                        <p>Customize productivity tools and options. Changes save automatically.</p>
                    </div>
                </div>

                <div className="settings">
                    <div className="task-notifications">
                        <h3>Task Defaults</h3>
                        <div className="task-notifications-list">
                            <div className="notification-option">
                                <span>Default task priority</span>
                                <Dropdown
                                    options={priorityOptions}
                                    value={preferences.default_priority}
                                    onChange={setPref("default_priority")}
                                    placeholder="Medium"
                                    className="custom-select"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="team-notifications smart-focus-settings">
                        <h3>Smart Focus & Attention Control</h3>
                        <div className="task-notifications-list">
                            <div className="smart-settings">
                                <DeliveryCheckbox id="silence-non-urgent" label="Silence non-urgent notifications" checked={preferences.silence_non_urgent} onChange={togglePref("silence_non_urgent")} />
                                <DeliveryCheckbox id="hide-completed" label="Hide completed tasks" checked={preferences.hide_completed_tasks} onChange={togglePref("hide_completed_tasks")} />
                                <DeliveryCheckbox id="block-reassignment" label="Block task reassignment during focus" checked={preferences.block_reassignment_focus} onChange={togglePref("block_reassignment_focus")} />
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
                </div>
                <div className="settings">
                    <div className="integrations-list">
                        {[
                            { key: "google-calendar", icon: "Icons/google-calendar.svg", name: "Google Calendar", desc: "Sync your tasks with Google Calendar." },
                            { key: "slack", icon: "Icons/slack.svg", name: "Slack", desc: "Receive task notifications in Slack." },
                            { key: "trello", icon: "Icons/trello.svg", name: "Trello", desc: "Import tasks from Trello boards." },
                            { key: "notion", icon: "Icons/notion.svg", name: "Notion", desc: "Import tasks from Notion pages.", iconClassName: "notion-icon" },
                        ].map((integration) => (
                            <div className="integration-item" key={integration.key}>
                                <div className="item-logo-desc">
                                    <img src={integration.icon} alt="" className={integration.iconClassName} />
                                    <div className="item-desc">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h3 style={{ margin: 0 }}>{integration.name}</h3>
                                            <span className="status-badge not-connected">Coming Soon</span>
                                        </div>
                                        <p>{integration.desc}</p>
                                    </div>
                                </div>
                                <IconButton type="button" className="connect-btn" text="Coming Soon" icon={PencilIcon} disabled />
                            </div>
                        ))}
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
                </div>

                {isGuest ? (
                    <div className="settings">
                        <div className="task-notifications">
                            <h3>Account Security</h3>
                            <p>Guest sessions have no real account to secure. Sign up for password and 2FA options.</p>
                        </div>
                    </div>
                ) : (
                    <div className="settings">
                        <div className="task-notifications">
                            <h3>Account Security</h3>
                            <div className="account-security-form">
                                <p>New Password:</p>
                                <input
                                    type="password"
                                    placeholder="At least 8 characters"
                                    className="form-inputs password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="account-security-form">
                                <p>Confirm Password:</p>
                                <input
                                    type="password"
                                    placeholder="········"
                                    className="form-inputs password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {passwordError && <p style={{ color: "var(--error-50)" }}>{passwordError}</p>}
                            {passwordMessage && <p style={{ color: "var(--success-50)" }}>{passwordMessage}</p>}
                            <IconButton
                                type="button"
                                className="save-btn"
                                onClick={handleChangePassword}
                                text={passwordSaving ? "Saving…" : "Update Password"}
                                icon={MdOutlineSave}
                                disabled={passwordSaving || !newPassword || !confirmPassword}
                            />
                        </div>

                        <div className="team-notifications">
                            <h3>Two-Factor Authentication</h3>
                            {mfaLoading ? (
                                <p>Loading…</p>
                            ) : mfaEnrolling ? (
                                <div className="two-fa-settings" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                                    <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.), then enter the 6-digit code it shows.</p>
                                    {mfaQrCode && (
                                        <img src={mfaQrCode} alt="2FA QR code" style={{ width: 180, height: 180, background: "#fff", padding: 8, borderRadius: 8 }} />
                                    )}
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        className="form-inputs"
                                        style={{ maxWidth: 160 }}
                                        value={mfaCode}
                                        onChange={(e) => setMfaCode(e.target.value)}
                                        maxLength={6}
                                    />
                                    {mfaError && <p style={{ color: "var(--error-50)" }}>{mfaError}</p>}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <IconButton type="button" className="save-btn" onClick={handleVerify2fa} text={mfaBusy ? "Verifying…" : "Verify & Enable"} icon={ShieldCheckIcon} disabled={mfaBusy} />
                                        <IconButton type="button" className="connect-btn" onClick={handleCancelEnroll2fa} text="Cancel" icon={XMarkIcon} disabled={mfaBusy} />
                                    </div>
                                </div>
                            ) : (
                                <div className="two-fa-settings">
                                    <p>Status: <span>{verifiedTotpFactor ? "ON" : "OFF"}</span></p>
                                    {mfaError && <p style={{ color: "var(--error-50)" }}>{mfaError}</p>}
                                    {verifiedTotpFactor ? (
                                        <IconButton
                                            type="button"
                                            className="connect-btn"
                                            onClick={handleDisable2fa}
                                            text={mfaBusy ? "Disabling…" : "Disable 2FA"}
                                            icon={XMarkIcon}
                                            disabled={mfaBusy}
                                        />
                                    ) : (
                                        <IconButton
                                            type="button"
                                            className="enable-2fa-btn"
                                            onClick={handleStartEnroll2fa}
                                            text={mfaBusy ? "Starting…" : "Enable 2FA"}
                                            icon={ShieldCheckIcon}
                                            disabled={mfaBusy}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="team-notifications smart-focus-settings">
                    <h3>Sessions</h3>
                    <div className="sessions-settings">
                        <div className="session-details">
                            <p>This device</p>
                            <p className="active-now">Active now</p>
                        </div>
                        <IconButton
                            type="button"
                            className="sessions-btn"
                            onClick={handleLogout}
                            text="Log out of all sessions"
                            icon={ArrowLeftEndOnRectangleIcon}
                        />

                        <LogoutModal open={showLogoutModal} onCancel={handleLogoutCancel} onConfirm={handleLogoutConfirm} />

                    </div>
                </div>
            </div>
        ),
        Preferences: (
            <div>
                <div className="settings-tab-content tab-header-section">
                    <div className="tab-header">
                        <h4>Preferences</h4>
                        <p>Set your app preferences and appearance. Changes save automatically.</p>
                    </div>
                </div>
                <div className="settings">
                    <div className="task-notifications">
                        <div className="notification-option">
                            <span>Time zone</span>
                            <Dropdown
                                options={timeZoneOptions}
                                value={preferences.timezone}
                                onChange={setPref("timezone")}
                                placeholder="UTC"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Date format</span>
                            <Dropdown
                                options={dateFormatOptions}
                                value={preferences.date_format}
                                onChange={setPref("date_format")}
                                placeholder="MM/DD/YYYY"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Time format</span>
                            <Dropdown
                                options={timeFormatOptions}
                                value={preferences.time_format}
                                onChange={setPref("time_format")}
                                placeholder="24-hour"
                                className="custom-select"
                            />
                        </div>
                        <div className="notification-option">
                            <span>Language</span>
                            <Dropdown
                                options={languageOptions}
                                value={preferences.language}
                                onChange={setPref("language")}
                                placeholder="English"
                                className="custom-select"
                            />
                            <p style={{ color: "var(--grey-50)", fontSize: 12, margin: "4px 0 0" }}>More languages coming soon.</p>
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
function DeliveryCheckbox({ id, label, checked, onChange }) {
    return (
        <div className="notification-option" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="checkbox-wrapper">
                <input
                    type="checkbox"
                    className="table-checkbox"
                    id={id}
                    checked={!!checked}
                    onChange={onChange}
                />
                {checked && <CheckIcon className="checkbox-checkmark" />}
            </div>
            <label htmlFor={id} style={{ margin: 0 }}>{label}</label>
        </div>
    );
}