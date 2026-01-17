import React from "react";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import LinkIcon from "@heroicons/react/24/outline/LinkIcon";
import "./ActivityTaskCard.css";

export default function ActivityTaskCard({ task, onClick }) {
  return (
    <div
      className="activity-task-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="task-card-top">
        <div className="task-tags-row">
          <span className="task-tag">{task.tag}</span>
          <div className="statusanddot">
            <span
              className="task-status-dot"
              style={{ background: task.statusColor }}
            ></span>
            <span className="task-status-label">{task.status}</span>
          </div>
        </div>
        <div>
          <div className="task-name">{task.title}</div>
          <div className="task-description">{task.desc}</div>
        </div>
      </div>
      <div className="task-footer-row">
        <div className="task-footer-user">
          <img
            src={task.user.avatar}
            alt={task.user.name}
            className="task-user-avatar"
          />
          <span className="task-user-name">{task.user.name}</span>
        </div>
        <div className="task-footer-date">
          <CalendarIcon className="task-footer-icon" />
          <span className="task-user-name">{task.date}</span>
        </div>
        <div className="task-footer-links">
          <LinkIcon className="task-footer-icon" />
          <span className="task-user-name">{task.links}</span>
        </div>
      </div>
    </div>
  );
}
