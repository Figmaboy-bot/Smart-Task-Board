import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import "./AlertModal.css";

export default function AlertModal({ open, title = "Heads up", message, onClose }) {
  if (!open) return null;
  return (
    <div className="alert-modal-overlay">
      <div className="alert-modal">
        <div className="icon-alert"><ExclamationTriangleIcon className="icon-alert-svg" /></div>
        <div className="alert-text-container">
          <div className="alert-modal-title">{title}</div>
          <div className="alert-modal-message">{message}</div>
        </div>
        <div className="alert-modal-actions">
          <button className="alert-modal-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
