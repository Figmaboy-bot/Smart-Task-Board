import React from "react";
import "./Notifications.css";
import { XMarkIcon } from '@heroicons/react/24/outline'; 

const Notifications = ({ open, onClose, notifications = [] }) => {
	if (!open) return null;
	return (
		<div className="notification-overlay" onClick={onClose}>
			<div className="notification-modal" onClick={e => e.stopPropagation()}>
				<button className="notification-close" onClick={onClose}>&times;</button>
				<h2>Notifications</h2>
				<ul className="notification-list">
					{notifications.length === 0 ? (
						<li className="notification-empty">No notifications</li>
					) : (
						notifications.map((note, idx) => (
							<li key={idx} className="notification-item">{note}</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};

export default Notifications;
