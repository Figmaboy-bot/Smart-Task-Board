import React, { useState } from "react";
import { XMarkIcon, CalendarIcon, UserGroupIcon, FlagIcon, LinkIcon } from "@heroicons/react/24/outline";
import ProjectTasksModal from "../ProjectTasksModal/ProjectTasksModal";
import "./ProjectDetailModal.css";

export default function ProjectDetailModal({ open, onClose, project }) {
    const [showTasksModal, setShowTasksModal] = useState(false);

    if (!open || !project) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed": return "var(--success-50)";
            case "in progress": return "var(--warning-50)";
            case "on hold": return "var(--error-50)";
            default: return "var(--success-50)";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high": return "#ef4444";
            case "medium": return "#fbbc05";
            case "low": return "#22c55e";
            default: return "#6b7280";
        }
    };

    return (
        <div className="project-detail-overlay" onClick={onClose}>
            <div className="project-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="project-detail-header">
                    <div className="project-detail-title-section">
                        <h2>About {project.name || project.title || "Project Details"}</h2>
                        
                    </div>
                    <button className="project-detail-close" onClick={onClose}>
                        <XMarkIcon className="close-icon" />
                    </button>
                </div>

                <div className="project-detail-body">
                     <div className="project-detail-section">
                        <h4>Title</h4>
                        <div className="project-detail-title-section">
                        <p>{project.name || project.title || "No title provided."}</p>
                        <span 
                            className="project-status-badge"
                            style={{ backgroundColor: getStatusColor(project.status) }}
                        >
                            {project.status || "Active"}
                        </span>
                        </div>
                    </div>

                    <div className="project-detail-section">
                        <h4>Description</h4>
                        <p>{project.description || "No description provided."}</p>
                    </div>

                    <div className="project-detail-meta">
                        <div className="meta-item">
                            <CalendarIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Due Date</span>
                                <span className="meta-value">{project.due || project.dueDate || project.date || "Not set"}</span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <FlagIcon className="meta-icon" style={{ color: getPriorityColor(project.priority) }} />
                            <div className="meta-content">
                                <span className="meta-label">Priority</span>
                                <span className="meta-value" style={{ color: getPriorityColor(project.priority) }}>
                                    {project.priority || "Medium"}
                                </span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <UserGroupIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Team Members</span>
                                <span className="meta-value">{project.members?.length || project.teamCount || 0} members</span>
                            </div>
                        </div>

                        <div className="meta-item">
                            <LinkIcon className="meta-icon" />
                            <div className="meta-content">
                                <span className="meta-label">Tasks</span>
                                <span className="meta-value">{project.totalTasks || project.taskCount || project.tasks?.length || 0} tasks</span>
                            </div>
                        </div>
                    </div>

                    {project.members && project.members.length > 0 && (
                        <div className="project-detail-section">
                            <h4>Team Members</h4>
                            <div className="project-members-list">
                                {project.members.map((member, index) => (
                                    <div key={index} className="project-member-item">
                                        <img 
                                            src={member.avatar || "/Profile.jpg"} 
                                            alt={member.name} 
                                            className="member-avatar"
                                        />
                                        <div className="member-info">
                                            <span className="member-name">{member.name}</span>
                                            <span className="member-role">{member.role || "Member"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.progress !== undefined && (
                        <div className="project-detail-section">
                            <h4>Progress</h4>
                            <div className="project-progress-container">
                                <div className="project-progress-bar">
                                    <div 
                                        className="project-progress-fill"
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                <span className="project-progress-text">{project.progress}% Complete</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="project-detail-footer">
                    <button className="project-detail-btn secondary" onClick={onClose}>Close</button>
                    <button 
                        className="project-detail-btn primary" 
                        onClick={() => setShowTasksModal(true)}
                    >
                        View Tasks
                    </button>
                </div>
            </div>

            <ProjectTasksModal
                open={showTasksModal}
                onClose={() => setShowTasksModal(false)}
                project={project}
            />
        </div>
    );
}
