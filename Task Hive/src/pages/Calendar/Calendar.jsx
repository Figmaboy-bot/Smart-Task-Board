
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import IconButton, { OutlineButton } from "../../components/Buttons/Buttons";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Calendar.css";


const allDays = [
    { label: "MON", date: "04" },
    { label: "TUE", date: "05" },
    { label: "WED", date: "06" },
    { label: "THU", date: "07" },
    { label: "FRI", date: "08" },
    { label: "SAT", date: "09" },
    { label: "SUN", date: "10" },
    { label: "MON", date: "11" },
    { label: "TUE", date: "12" },
    { label: "WED", date: "13" },
    { label: "THU", date: "14" },
    { label: "FRI", date: "15" },
    { label: "SAT", date: "16" },
    { label: "SUN", date: "17" },
];

const times = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];

const events = [
    // Monday (day: 0)
    { day: 0, start: 0, end: 0.5, title: "Brainstorming Session", time: "9:00 - 9:30 AM", color: "#e5e7eb", priority: "high" },
    { day: 0, start: 0.5, end: 1, title: "Bi-Weekly Marketing Team Meeting", time: "9:30 - 10:00 AM", color: "#e5e7eb" },
    { day: 0, start: 2, end: 3, title: "Workshop: 'Mastering Design Thinking'", time: "11:30 AM - 1:00 PM", color: "#fde2cf", location: "Venue: XYZ Conference Center", priority: "high" },
    // Tuesday (day: 1)
    { day: 1, start: 0, end: 0.5, title: "Project Review Meeting", time: "9:00 - 9:30 AM", color: "#dbeafe" },
    { day: 1, start: 1, end: 1.5, title: "Sales Team Training Session - Improving Sales Techniques", time: "10:00 - 11:30 AM", color: "#dbeafe", participants: 7, meeting: "Zoom", priority: "high" },
    { day: 1, start: 2, end: 2.5, title: "Quarterly Financial Review - Analysis", time: "12:00 PM - 12:30 PM", color: "#dbeafe" },
    // Wednesday (day: 2)
    { day: 2, start: 0.5, end: 1, title: "Marketing Strategy Discussion", time: "9:30 - 10:00 AM", color: "#dbeafe" },
    { day: 2, start: 1, end: 1.5, title: "Strategy Planning for Company Expansion", time: "11:00 - 11:30 AM", color: "#dbeafe" },
    { day: 2, start: 1.5, end: 3, title: "New Feature Implementation and Roadmap Discussion", time: "11:30 AM - 1:00 PM", color: "#dbeafe" },
    // Thursday (day: 3)
    { day: 3, start: 0, end: 1, title: "Customer Feedback Analysis", time: "9:00 - 10:00 AM", color: "#dbeafe", participants: 4, meeting: "Meet" },
    { day: 3, start: 2, end: 3, title: "Webinar: 'Digital Marketing Trends for 2023'", time: "11:30 AM - 1:00 PM", color: "#fde2cf", link: "http://www.examplewebinar.com" },
    // Friday (day: 4)
    { day: 4, start: 1, end: 2, title: "Team Retrospective", time: "10:00 - 11:00 AM", color: "#e5e7eb" },
    { day: 4, start: 3, end: 4, title: "Design Review", time: "12:00 PM - 1:00 PM", color: "#fde2cf", priority: "high" },
    // Saturday (day: 5)
    { day: 5, start: 2, end: 3, title: "Weekend Planning", time: "11:00 AM - 12:00 PM", color: "#dbeafe" },
    { day: 5, start: 4, end: 5, title: "Personal Development", time: "1:00 PM - 2:00 PM", color: "#e5e7eb" },
    // Sunday (day: 6)
    { day: 6, start: 0, end: 1, title: "Family Brunch", time: "9:00 AM - 10:00 AM", color: "#fde2cf" },
    { day: 6, start: 2, end: 3, title: "Weekly Reflection", time: "11:00 AM - 12:00 PM", color: "#e5e7eb", priority: "high" },
    // Monday (day: 7)
    { day: 7, start: 1, end: 2, title: "Sprint Planning", time: "10:00 AM - 11:00 AM", color: "#dbeafe" },
    { day: 7, start: 3, end: 4, title: "Client Call", time: "12:00 PM - 1:00 PM", color: "#fde2cf", priority: "high" },
    // Tuesday (day: 8)
    { day: 8, start: 0, end: 1, title: "Market Research", time: "9:00 AM - 10:00 AM", color: "#e5e7eb" },
    { day: 8, start: 2, end: 3, title: "Product Demo", time: "11:00 AM - 12:00 PM", color: "#dbeafe" },
    // Wednesday (day: 9)
    { day: 9, start: 1, end: 2, title: "Team Sync", time: "10:00 AM - 11:00 AM", color: "#e5e7eb" },
    { day: 9, start: 3, end: 4, title: "Strategy Update", time: "12:00 PM - 1:00 PM", color: "#fde2cf", priority: "high" },
    // Thursday (day: 10)
    { day: 10, start: 0, end: 1, title: "Budget Review", time: "9:00 AM - 10:00 AM", color: "#dbeafe" },
    { day: 10, start: 2, end: 3, title: "Team Building", time: "11:00 AM - 12:00 PM", color: "#e5e7eb" },
    // Friday (day: 11)
    { day: 11, start: 1, end: 2, title: "Release Prep", time: "10:00 AM - 11:00 AM", color: "#fde2cf", priority: "high" },
    { day: 11, start: 3, end: 4, title: "QA Testing", time: "12:00 PM - 1:00 PM", color: "#dbeafe" },
    // Saturday (day: 12)
    { day: 12, start: 0, end: 1, title: "Learning Session", time: "9:00 AM - 10:00 AM", color: "#e5e7eb" },
    { day: 12, start: 2, end: 3, title: "Hackathon", time: "11:00 AM - 12:00 PM", color: "#fde2cf", priority: "high" },
    // Sunday (day: 13)
    { day: 13, start: 1, end: 2, title: "Rest & Recharge", time: "10:00 AM - 11:00 AM", color: "#dbeafe" },
    { day: 13, start: 3, end: 4, title: "Family Time", time: "12:00 PM - 1:00 PM", color: "#e5e7eb" },
    // Monday (day: 14)
    { day: 14, start: 0, end: 1, title: "Kickoff Meeting", time: "9:00 AM - 10:00 AM", color: "#fde2cf", priority: "high" },
    { day: 14, start: 2, end: 3, title: "Design Sprint", time: "11:00 AM - 12:00 PM", color: "#dbeafe" },
    // Tuesday (day: 15)
    { day: 15, start: 1, end: 2, title: "Stakeholder Review", time: "10:00 AM - 11:00 AM", color: "#e5e7eb" },
    { day: 15, start: 3, end: 4, title: "Wrap-up", time: "12:00 PM - 1:00 PM", color: "#fde2cf", priority: "high" },
    // Wednesday (day: 16)
    { day: 16, start: 0, end: 1, title: "Final Presentation", time: "9:00 AM - 10:00 AM", color: "#dbeafe", priority: "high" },
    { day: 16, start: 2, end: 3, title: "Celebration", time: "11:00 AM - 12:00 PM", color: "#e5e7eb" },
];



export default function Calendar() {
    const [startIdx, setStartIdx] = useState(0);
    const visibleDays = allDays.slice(startIdx, startIdx + 5);

    const handlePrev = () => {
        setStartIdx(idx => Math.max(0, idx - 1));
    };
    const handleNext = () => {
        setStartIdx(idx => Math.min(allDays.length - 5, idx + 1));
    };

    return (
        <div className="calendar-page">
            <Sidebar />
            <div className="calendar-content">
                <Header onNotificationClick={() => { }} />
                <div className="calendar-container">
                    <div className="calendar-container-header">
                        <h2>Calendar View</h2>
                        <div className="filter-addtask-container">
                            <OutlineButton icon={FunnelIcon} text="Filter" className="Add-Task" />
                            <IconButton icon={PlusCircleIcon} text="Add Task" className="Add-Task" />
                        </div>
                    </div>
                    <div className="calendar-grid">
                        <div className="calendar-header-row">
                            <div className="calendar-time-col empty-col">
                                <button className="calendar-arrow-btn" onClick={handlePrev} disabled={startIdx === 0} aria-label="Previous days">
                                    <ChevronLeftIcon style={{ width: 20, height: 20 }} />
                                </button>
                                <button className="calendar-arrow-btn" onClick={handleNext} disabled={startIdx === allDays.length - 5} aria-label="Next days">
                                    <ChevronRightIcon style={{ width: 20, height: 20 }} />
                                </button>
                            </div>
                            {visibleDays.map((d, i) => (
                                <div key={i} className="calendar-day-col">
                                    <div className="calendar-day-col-inner">
                                        <span className="calendar-day-label">{d.label}</span>
                                        <span className="calendar-date-label">{d.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Time slots */}
                        {times.map((t, i) => (
                            <div key={i} className="calendar-time-row">
                                <div className="calendar-time-col">{t}</div>
                                {visibleDays.map((d, j) => {
                                    // Find event for this day and time slot
                                    const event = events.find(ev => ev.day === (j + startIdx) && Math.floor(ev.start) === i);
                                    const slotClass = `calendar-slot${j === 0 ? ' first-slot' : ''}${j === visibleDays.length - 1 ? ' last-slot' : ''}`;
                                    return (
                                        <div key={j} className={slotClass}>
                                            <div className="calendar-slot-inner">
                                                {event && (
                                                    <div
                                                        className={`calendar-event-card${event.color === '#fde2cf' ? ' calendar-event-orange' : ''}${event.priority === 'high' ? ' high-priority' : ''}`}
                                                    >
                                                        <div className="calendar-event-title">{event.title}</div>
                                                        <div className="calendar-event-time">{event.time}</div>
                                                        {event.participants && (
                                                            <div className="calendar-event-participants">
                                                                <span className="calendar-event-avatar-group">{/* Avatars here */}</span>
                                                                <span className="calendar-event-participant-count">+{event.participants}</span>
                                                                {event.meeting && <span className="calendar-event-meeting">on {event.meeting}</span>}
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="calendar-event-location">{event.location}</div>
                                                        )}
                                                        {event.link && (
                                                            <div className="calendar-event-link">
                                                                <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}