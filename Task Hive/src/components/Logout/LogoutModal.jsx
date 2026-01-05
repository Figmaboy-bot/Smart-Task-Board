import React from "react";
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import "./LogoutModal.css";

export default function LogoutModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <div className="icon-logout"><ArrowLeftEndOnRectangleIcon className="icon-logout-svg" /></div>
        <div className="logout-text-container">
        <div className="logout-modal-title">Logout</div>
        <div className="logout-modal-message">Are you sure you want to logout?</div>
        </div>
        <div className="logout-modal-actions">
          <button className="logout-modal-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="logout-modal-btn confirm" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
