import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import IconButton from "../../components/Buttons/Buttons"
import { PlusCircleIcon, EllipsisVerticalIcon, ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline"
import Dropdown from "../../components/Dropdown/Dropdown"
import React, { useState } from "react";
import ActivityTaskCard from "../../components/ActivityTaskCard/ActivityTaskCard"
import EditableTable from "../../components/EditableTable/EditableTable";
import TaskModal from "../../components/TaskModal/TaskModal"
import './MyTasks.css'

export default function MyTasks() {
    const [showTaskModal, setShowTaskModal] = useState(false);

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

    const [view, setView] = useState("kanban");

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
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
                {
                    tag: "Frontend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
                {
                    tag: "Frontend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
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
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                {
                    tag: "API",
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                {
                    tag: "API",
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
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
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                {
                    tag: "Docs",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                {
                    tag: "Docs",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
            ],
        },
    ];

    // Example table columns and data for EditableTable
    const tableColumns = [
        { key: "title", label: "Task", headerClassName: "table-header-cell Task", cellClassName: "table-cell table-title", width: "20%" },
        { key: "status", label: "Status", headerClassName: "table-header-cell Status", cellClassName: "table-cell table-status", width: "10%" },
        { key: "desc", label: "Description", headerClassName: "table-header-cell Description", cellClassName: "table-cell table-desc", width: "30%" },
        { key: "user", label: "Assigned", headerClassName: "table-header-cell Assigned", cellClassName: "table-cell table-user", width: "12%" },
        { key: "date", label: "Date", headerClassName: "table-header-cell Date", cellClassName: "table-cell table-date", width: "9%" },
        { key: "links", label: "Links", headerClassName: "table-header-cell Links", cellClassName: "table-cell table-links", width: "9%" },
        { key: "section", label: "Priority", headerClassName: "table-header-cell Action", cellClassName: "table-cell table-actions", width: "10%" },
    ];
    const tableData = myKanbanColumns.flatMap((col) =>
        col.tasks.map((task, j) => ({
            ...task,
            section: col.title,
            id: `${col.title}-${j}`,
            user: (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <img src={task.user.avatar} alt={task.user.name} className="task-user-avatar" style={{ width: 22, height: 22 }} />
                    {task.user.name}
                </span>
            ),
        }))
    );

    return (
        <div className="my-tasks-page">
            <Sidebar />
            <div className="my-tasks-content">
                <Header onNotificationClick={() => { }} />
                <div className="my-tasks-main">
                    <div className="my-tasks-header">
                        <h2>My Tasks</h2>
                        <div className="my-tasks-header-buttons">
                            <div className="view-switcher">
                                <button
                                    className={view === "kanban" ? "active" : ""}
                                    onClick={() => setView("kanban")}
                                    aria-pressed={view === "kanban"}
                                >
                                    <ViewColumnsIcon className="view-icon" />
                                    Kanban
                                </button>
                                <button
                                    className={view === "list" ? "active" : ""}
                                    onClick={() => setView("list")}
                                    aria-pressed={view === "list"}
                                >
                                    <TableCellsIcon className="view-icon" />
                                    List
                                </button>
                            </div>
                            <IconButton
                                icon={PlusCircleIcon}
                                text="Add Task"
                                className="Add-Task"
                                onClick={() => setShowTaskModal(true)}
                            />
                            <TaskModal open={showTaskModal} onClose={() => setShowTaskModal(false)}
                            />
                        </div>
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
                        {view === "kanban" ? (
                            <div className="team-activity-board">
                                {myKanbanColumns.map((col) => (
                                    <div className="activity-column" key={col.title}>
                                        <div className="column-header">
                                            <div className="column-title-icon">
                                                <span className="column-icon" style={{ color: col.color }}>

                                                </span>
                                                <span className="column-title">{col.title}</span>
                                            </div>
                                            <div>
                                                <button
                                                    className="column-add"
                                                    onClick={() => setShowTaskModal(true)}
                                                ><PlusCircleIcon className="plusicon" /></button>
                                                <EllipsisVerticalIcon className="plusicon" />
                                            </div>
                                        </div>
                                        {col.tasks.map((task, j) => (
                                            <ActivityTaskCard key={j} task={task} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="activity-list-view">
                                <EditableTable columns={tableColumns} data={tableData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}