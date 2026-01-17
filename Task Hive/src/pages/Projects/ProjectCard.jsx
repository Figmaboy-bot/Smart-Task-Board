import React from "react";
import "./Projects.css";

export default function ProjectCard({
  name = "Project Name",
  description = "Short project description goes here.",
  progress = 72,
  totalTasks = 12,
  overdueTasks = 3,
  team = [], // Array of avatar URLs
  due = "Mar 24",
  onClick
}) {
  return (
    <div
      className="project-card custom-project-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="project-card-content">
        <div className="project-card-title">{name}</div>
        <div className="project-card-desc">{description}</div>
        <div className="project-card-progress-row">
          <div className="project-card-progress-bar">
            <div
              className="project-card-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="project-card-progress-label">{progress}%</span>
        </div>
        <div className="project-card-meta-row">
          <span>{totalTasks} Tasks</span>
          <span className="overdue">• {overdueTasks} Overdue</span>
        </div>
        <div className="project-card-footer">
          <div className="project-card-avatars">
            {team.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt="Team member"
                className="project-card-avatar"
              />
            ))}
          </div>
          <div className="project-card-due">Due: {due}</div>
        </div>
      </div>
    </div>
  );
}
