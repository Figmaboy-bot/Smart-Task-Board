import React, { useRef } from 'react'; // Add useRef here
import "./UpcomingDeadlines.css"
import ReportImage from "../../../public/upcoming deadlines/ReportImage.jpg"
import {
    CalendarIcon,
    LinkIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export function UpcomingDeadlines() {
    const trackRef = useRef(null); // Add this

    // Add scroll function
    const scroll = (direction) => {
        if (trackRef.current) {
            const scrollAmount = 370; // card width + gap
            trackRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const tasks = [
        {
            tag: 'Report',
            title: 'Prepare Q2 Report',
            status: 'Overdue alert',
            subtitle: 'Gather and compile key financial and performance data for the Q2 report',
            img: ReportImage,
            name: 'Sulaimon',
            who: 'Me',
            datetime: 'Today, 3 PM',
            link: 8,
            trend: 'up',
            featured: false,
        },
        {
            tag: 'Clients Proposal',
            title: 'Review Client Proposal',
            status: 'High Priority',
            subtitle: 'Carefully assess the project proposal for an upcoming client deal. Double-check to ensure accuracy.',
            img: ReportImage,
            name: 'Sulaimon',
            who: 'Me',
            datetime: 'Today, 3 PM',
            link: 20,
            trend: 'up',
            featured: true,
        },
        {
            tag: 'UX Mockups',
            title: 'Finalize UX Mockups',
            status: 'On Track',
            subtitle: 'Complete the UI/UX mockups for the new dashboard redesign.',
            img: ReportImage,
            name: 'Sulaimon',
            who: 'Me',
            datetime: 'Today, 3 PM',
            link: 12,
            trend: 'down',
            featured: true,
        },
        {
            tag: 'UX Mockups',
            title: 'Finalize UX Mockups',
            status: 'On Track',
            subtitle: 'Complete the UI/UX mockups for the new dashboard redesign.',
            img: ReportImage,
            name: 'Sulaimon',
            who: 'Me',
            datetime: 'Today, 3 PM',
            link: 12,
            trend: 'down',
            featured: true,
        }
    ];

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h2>Upcoming Deadlines</h2>
                <div className="carousel-controls">
                    <button 
                        className="carousel-button"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button 
                        className="carousel-button"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
            
            <div className="tasks-carousel">
                <div className="tasks-track" ref={trackRef}>
                    {tasks.map((tasks, index) => {
                        return (
                            <div key={index} className="task">
                                <div className="tag-status">
                                    <div className="tag">{tasks.tag}</div>
                                    <>
                                        <div className="statuscircle" style={{
                                            backgroundColor:
                                                tasks.status === 'Overdue alert' ? '#EF4444' :
                                                    tasks.status === 'High Priority' ? '#FBBC05' :
                                                        tasks.status === 'On Track' ? '#10B981' :
                                                            '#6B7280'
                                        }}></div>
                                        <div className="status">{tasks.status}</div>
                                    </>
                                </div>
                                <div className="task-body">
                                    <h4 className="task-title">
                                        {tasks.title}
                                    </h4>

                                    <p className="task-subtitle">
                                        {tasks.subtitle}
                                    </p>
                                </div>

                                <div className="task-footer">
                                    <div className="profile">
                                        <img className='profile-img' src={tasks.img} alt="" />
                                        <p className="profile-name">{tasks.name} <span className='who'>({tasks.who})</span></p>
                                    </div>

                                    <div className="datetime">
                                        <CalendarIcon className='datetime-icon' />
                                        <p className="datetime-text">{tasks.datetime}</p>
                                    </div>

                                    <div className="links">
                                        <LinkIcon className='datetime-icon' />
                                        <p className="linkamount">{tasks.link}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}