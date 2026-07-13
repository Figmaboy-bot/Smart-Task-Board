import React, { useMemo, useRef } from 'react';
import "./UpcomingDeadlines.css"
import {
    CalendarIcon,
    LinkIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import EmptyState from '../EmptyState/EmptyState';

export function UpcomingDeadlines({ tasks = [] }) {
    const trackRef = useRef(null);

    const scroll = (direction) => {
        if (trackRef.current) {
            const scrollAmount = 370; // card width + gap
            trackRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const upcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasks
            .filter(t => t.columnTitle !== "DONE" && t.date)
            .map(t => ({ ...t, _parsedDate: new Date(`${t.date}, ${today.getFullYear()}`) }))
            .filter(t => !isNaN(t._parsedDate.getTime()))
            .sort((a, b) => a._parsedDate - b._parsedDate)
            .slice(0, 8)
            .map(t => {
                const isOverdue = t._parsedDate < today;
                const statusLabel = isOverdue ? 'Overdue alert' : (t.status === 'High' ? 'High Priority' : 'On Track');
                return {
                    tag: t.tag,
                    title: t.title,
                    status: statusLabel,
                    subtitle: t.desc,
                    img: t.user.avatar,
                    name: t.user.name,
                    datetime: t.date,
                    link: t.links,
                };
            });
    }, [tasks]);

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h2>Upcoming Deadlines</h2>
                {upcoming.length > 0 && (
                    <div className="carousel-controls">
                        <button
                            className="carousel-button"
                            onClick={() => scroll('left')}
                        >
                            <ChevronLeftIcon className='carousel-control-icon' />
                        </button>
                        <button
                            className="carousel-button"
                            onClick={() => scroll('right')}
                        >
                            <ChevronRightIcon className='carousel-control-icon' />
                        </button>
                    </div>
                )}
            </div>

            {upcoming.length === 0 ? (
                <EmptyState compact icon={CalendarIcon} title="No upcoming deadlines" description="You're all caught up." />
            ) : (
                <div className="tasks-carousel">
                    <div className="tasks-track" ref={trackRef}>
                        {upcoming.map((task, index) => (
                            <div key={index} className="task">
                                <div className="task-body-top">
                                    <div className="tag-status">
                                        <div className="tag">{task.tag}</div>
                                        <div className="status-container">
                                            <div className="statuscircle" style={{
                                                backgroundColor:
                                                    task.status === 'Overdue alert' ? '#EF4444' :
                                                        task.status === 'High Priority' ? '#FBBC05' :
                                                            task.status === 'On Track' ? '#10B981' :
                                                                '#6B7280'
                                            }}></div>
                                            <div className="statuss">{task.status}</div>
                                        </div>
                                    </div>
                                    <div className="task-body">
                                        <h4 className="deadline-task-title">
                                            {task.title}
                                        </h4>

                                        <p className="deadline-task-subtitle">
                                            {task.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="task-footer">
                                    <div className="profile">
                                        <img className='profile-img' src={task.img} alt="" />
                                        <p className="profile-name">{task.name}</p>
                                    </div>

                                    <div className="datetime">
                                        <CalendarIcon className='datetime-icon' />
                                        <p className="datetime-texts">{task.datetime}</p>
                                    </div>

                                    <div className="links">
                                        <LinkIcon className='datetime-icon' />
                                        <p className="link-amount">{task.link}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
