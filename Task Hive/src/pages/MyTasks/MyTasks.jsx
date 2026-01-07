import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import IconButton from "../../components/Buttons/Buttons"
import { PlusCircleIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import Dropdown from "../../components/Dropdown/Dropdown"
import React, { useState } from "react";
import ActivityTaskCard from "../../components/ActivityTaskCard/ActivityTaskCard"
import './MyTasks.css'

export default function MyTasks() {
    const [date, setDate] = useState("All");
    const dates = ["All", "Today", "Upcoming", "Overdue"];

    const [project, setProject] = useState("all");
    const projectOptions = [
        { value: "all", label: "All Projects" },
        { value: "project1", label: "Project 1" },
        { value: "project2", label: "Project 2" },
    ];

        const [priority, setPriority] = useState("all");
    const priorityOptions = [
        { value: "all", label: "All Priorities" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
    ];

            const [status, setStatus] = useState("all");
    const statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "open", label: "Open" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
    ];

                const [assignees, setAssignees] = useState("all");
    const assigneesOptions = [
        { value: "all", label: "All Assignees" },
        { value: "user1", label: "User 1" },
        { value: "user2", label: "User 2" },
        { value: "user3", label: "User 3" },
    ];

    // Example Kanban columns for MyTasks
    const myKanbanColumns = [
        {
            title: "TO-DO",
            color: "#2563eb",
            tasks: [
                {
                    tag: "Frontend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
                                {
                    tag: "Frontend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
                                {
                    tag: "Frontend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
            ],
        },
        {
            title: "IN PROGRESS",
            color: "#f59e42",
            tasks: [
                {
                    tag: "API",
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                                {
                    tag: "API",
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                                                {
                    tag: "API",
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
            ],
        },
        {
            title: "DONE",
            color: "#22c55e",
            tasks: [
                {
                    tag: "Docs",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                                {
                    tag: "Docs",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                                {
                    tag: "Docs",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
            ],
        },
    ];

    return (
        <div className="my-tasks-page">
            <Sidebar />
            <div className="my-tasks-content">
                <Header onNotificationClick={() => { }} />
                <div className="my-tasks-main">
                    <div className="my-tasks-header">
                        <h2>My Tasks</h2>
                        <IconButton
                            icon={PlusCircleIcon}
                            text="Add Task"
                            className="Add-Task"
                        />
                    </div>
                    <div className="tasks-filter-container">
                        <div className="tasks-filter-time-switcher">
                            {dates.map((d) => (
                                <button
                                    key={d}
                                    className={date === d ? "active" : ""}
                                    onClick={() => setDate(d)}
                                    aria-pressed={date === d}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="tasks-filter-options">
                            <Dropdown
                                options={projectOptions}
                                value={project}
                                onChange={setProject}
                                placeholder="All Projects"
                                className="custom-select"
                            />
                            <Dropdown
                                options={priorityOptions}
                                value={priority}
                                onChange={setPriority}
                                placeholder="All Priorities"
                                className="custom-select"
                            />
                            <Dropdown
                                options={statusOptions}
                                value={status}
                                onChange={setStatus}
                                placeholder="All Statuses"
                                className="custom-select"
                            />
                            <Dropdown
                                options={assigneesOptions}
                                value={assignees}
                                onChange={setAssignees}
                                placeholder="All Assignees"
                                className="custom-select"
                            />
                            {/* Repeat for other filters as needed */}
                        </div>
                    </div>

                    <div className="Tasks-main-contents">
                        <div className="team-activity-board">
                            {myKanbanColumns.map((col) => (
                                <div className="activity-column" key={col.title}>
                                    <div className="column-header">
                                        <div className="column-title-icon">
                                            <span className="column-icon" style={{ color: col.color }}>
                                                {/* Optionally add an icon here */}
                                            </span>
                                            <span className="column-title">{col.title}</span>
                                        </div>
                                        <div className="column-header-buttons">
									<button className="column-add"><PlusCircleIcon className="plusicon" /></button>
									<button className="column-add"><EllipsisVerticalIcon className="plusicon" /></button>
								</div>
                                    </div>
                                    {col.tasks.map((task, j) => (
                                        <ActivityTaskCard key={j} task={task} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Add your My Tasks content here */}
                    {/* TODO: Filter tasks based on selected filter */}
                </div>
            </div>
        </div>
    )
}