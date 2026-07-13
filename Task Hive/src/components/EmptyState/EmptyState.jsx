import React from "react";
import "./EmptyState.css";

export default function EmptyState({ icon: Icon, title, description, action, compact = false }) {
  return (
    <div className={`empty-state${compact ? " empty-state-compact" : ""}`}>
      {Icon && <Icon className="empty-state-icon" />}
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
