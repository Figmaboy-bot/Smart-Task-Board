import React from "react";
import {
    XMarkIcon,
    CalendarIcon,
    UserIcon,
    TagIcon,
    FlagIcon,
    LinkIcon,
    ClockIcon,
    FolderIcon
} from "@heroicons/react/24/outline";
import "./TaskDetailModal.css";

export default function TaskDetailModal({ open, onClose, task }) {
    if (!open || !task) return null;

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high": return "#ef4444";
            case "medium": return "#fbbc05";
            case "low": return "#22c55e";
            default: return "#6b7280";
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "high": return "#ef4444";
            case "medium": return "#fbbc05";
            case "low": return "#22c55e";
            default: return "#6b7280";
        }
    };

    return (
        <div className="task-detail-overlay" onClick={onClose}>
            <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-detail-header">
                    <div className="task-detail-header-content">
                        <h2>About {task.title || "Task Details"} </h2>
                    </div>
                    <button className="task-detail-close" onClick={onClose}>
                        <XMarkIcon className="close-icon" />
                    </button>
                </div>



                <div className="task-detail-body">
                    <div className="task-detail-section">
                        <h4>Title</h4>
                        <div className="title-tag">
                        <p>{task.title || "No title provided."}</p>
                         <span className="task-tag-badge">{task.tag || "General"}</span>
                         </div>
                    </div>
                    <div className="task-detail-section">
                        <h4>Description</h4>
                        <p>{task.desc || task.description || "No description provided."}</p>
                    </div>

                    <div className="task-detail-meta">
                        <div className="meta-item">
                            <FolderIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Project</span>
                                <span className="meta-value project-badge">
                                    {task.project || task.projectName || "No Project"}
                                </span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <FlagIcon className="meta-icon" style={{ color: getStatusColor(task.status) }} />
                            <div className="meta-content">
                                <span className="meta-label">Priority</span>
                                <span
                                    className="meta-value priority-badge"
                                    style={{
                                        color: getStatusColor(task.status),
                                        backgroundColor: `${getStatusColor(task.status)}15`
                                    }}
                                >
                                    {task.status || "Medium"}
                                </span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <CalendarIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Due Date</span>
                                <span className="meta-value">{task.date || task.dueDate || "Not set"}</span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <UserIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Assignee</span>
                                <div className="meta-value assignee-value">
                                    {task.user && (
                                        <>
                                            <img
                                                src={task.user.avatar || "/Profile.jpg"}
                                                alt={task.user.name}
                                                className="assignee-avatar"
                                            />
                                            <span>{task.user.name || "Unassigned"}</span>
                                        </>
                                    )}
                                    {!task.user && <span>Unassigned</span>}
                                </div>
                            </div>
                        </div>

                        <div className="meta-item">
                            <LinkIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Links</span>
                                <span className="meta-value">{task.links || 0} attached</span>
                            </div>
                        </div>
                    </div>

                    {task.links > 0 && (
                        <div className="task-detail-section">
                            <h4>Attached Links</h4>
                            <div className="task-links-list">
                                {Array.from({ length: task.links }).map((_, index) => (
                                    <a key={index} href="#" className="task-link-item">
                                        <LinkIcon className="link-icon" />
                                        <span>Link {index + 1}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="task-detail-footer">
                    <button className="task-detail-btn secondary" onClick={onClose}>Close</button>
                    <button className="task-detail-btn primary">Edit Task</button>
                </div>
            </div>
        </div>
    );
}
