import React from 'react';
import { BellSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './Notifications.css';



const typeColors = {
    success: { icon: '#22c55e', bg: 'rgba(34,197,94,0.1)' }, // green
    error: { icon: '#ef4444', bg: 'rgba(239,68,68,0.1)' },   // red
    warning: { icon: '#f59e42', bg: 'rgba(245,158,66,0.1)' }, // orange
    grey: { icon: '#64748b', bg: 'rgba(100,116,139,0.1)' },  // grey
    default: { icon: '#64748b', bg: 'rgba(100,116,139,0.1)' }
};

const NotificationItem = ({ title, desc, icon, time, type }) => {
    const colorSet = typeColors[type] || typeColors.default;
    return (
        <div className="notification-item-custom" >
            <div className="notification-icon-custom" style={{ background: colorSet.bg }}>
                {icon && React.cloneElement(icon, { className: "notification-item-icon", stroke: colorSet.icon })}
            </div>
            <div className='main-notification'>
                <div className="notification-title-custom">{title}</div>
                <div className="notification-desc-custom">{desc}</div>
                <div className="notification-time-custom">{time}</div>
            </div>
        </div>
    );
};

const Notifications = ({ open, onClose, notifications = [] }) => {
    if (!open) return null;
    const isGrouped = notifications.length > 0 && notifications[0].group && notifications[0].items;
    return (
        <div className="notification-overlay" onClick={onClose}>
            <div className="notification-modal" onClick={e => e.stopPropagation()}>
                <div className='notification-header'>
                    <h2>Notifications</h2>
                   <div className='close-icon-container'> <XMarkIcon className="notification-close-icon" onClick={onClose}  /> </div>
                </div>
                {notifications.length === 0 ? (
                    <div className="notification-empty">
                        <BellSlashIcon className="notification-empty-icon" />
                        No notifications</div>
                ) : isGrouped ? (
                    notifications.map(group => (
                        <div key={group.group} className="notification-group">
                            <div className="notification-group-title">{group.group}</div>
                            {group.items.map(n => (
                                <NotificationItem key={n.id || n.title || n} {...n} />
                            ))}
                        </div>
                    ))
                ) : (
                    notifications.map(n => (
                        <NotificationItem key={n.id || n.title || n} {...n} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;