import React, { useState } from "react"
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import IconButton from "../../components/Buttons/Buttons"
import { PlusCircleIcon, EllipsisVerticalIcon, ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline"
import ActivityTaskCard from "../../components/ActivityTaskCard/ActivityTaskCard";
import EditableTable from "../../components/EditableTable/EditableTable"
import Dropdown from "../../components/Dropdown/Dropdown"
import TaskModal from "../../components/TaskModal/TaskModal";
import './AllTasks.css'

export default function AllTasks() {

    const [tag, setTag] = useState("all");
    const tagOptions = [
        { value: "all", label: "All Tags" },
        { value: "tag1", label: "Frontend" },
        { value: "tag2", label: "API" },
        { value: "tag3", label: "Backend" },
        { value: "tag4", label: "Docs" },
    ];

    const [priority, setPriority] = useState("all");
    const priorityOptions = [
        { value: "all", label: "All Priorities" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" },
    ];

    const [dueDate, setDueDate] = useState("all");
    const dueDateOptions = [
        { value: "all", label: "All Due Dates" },
        { value: "today", label: "Today" },
        { value: "this_week", label: "This Week" },
        { value: "this_month", label: "This Month" },
    ];

    const [createdBy, setCreatedBy] = useState("all");
    const createdByOptions = [
        { value: "all", label: "All Assignees" },
        { value: "user1", label: "Linda" },
        { value: "user2", label: "Jake" },
        { value: "user3", label: "Mathew" },
        { value: "user4", label: "Me" },
    ];

    const [view, setView] = useState("kanban");
    const [showTaskModal, setShowTaskModal] = useState(false);

    // Convert to state so we can add tasks
    const [kanbanColumns, setKanbanColumns] = useState([
        {
            title: "TO-DO",
            color: "#2563eb",
            tasks: [
                {
                    tag: "Backend",
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Implement login UI",
                    desc: "Create a responsive login form for the app.",
                    user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                    date: "Jan 10",
                    links: 1,
                },
                {
                    tag: "API",
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
                    status: "High",
                    statusColor: "#ef4444",
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
                    status: "Medium",
                    statusColor: "#fbbc05",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                {
                    tag: "Frontend",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Integrate Auth API",
                    desc: "Connect frontend login to backend authentication API.",
                    user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    date: "Jan 11",
                    links: 2,
                },
                {
                    tag: "Docs",
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
                    status: "High",
                    statusColor: "#ef4444",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                {
                    tag: "Backend",
                    status: "Low",
                    statusColor: "#22c55e",
                    title: "Write onboarding guide",
                    desc: "Document onboarding steps for new users.",
                    user: { name: "Me", avatar: "/Profile.jpg" },
                    date: "Jan 9",
                    links: 0,
                },
                {
                    tag: "API",
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
    ]);

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

    const [tableData, setTableData] = useState(
        kanbanColumns.flatMap((col) =>
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
        )
    );

    const handleAddTask = (task) => {
        console.log('=== AllTasks onSubmit called ===');
        console.log('Task received:', task);
        
        const statusMap = {
            "To-Do": "TO-DO",
            "In Progress": "IN PROGRESS",
            "Done": "DONE",
        };
        const priorityMap = {
            "high": "High",
            "medium": "Medium",
            "low": "Low",
        };
        
        const normalizedStatus = statusMap[task.status] || "TO-DO";
        const normalizedPriority = priorityMap[task.priority] || "Medium";
        
        const newTask = {
            status: normalizedPriority,
            statusColor: normalizedPriority === "High" ? "#ef4444" : (normalizedPriority === "Medium" ? "#fbbc05" : "#22c55e"),
            user: { name: task.assignee || "Me", avatar: "/Profile.jpg" },
            desc: task.description || "",
            title: task.title || "",
            tag: task.tag || "General",
            date: task.dueDate || "",
            links: task.linksCount || 0,
        };
        
        setKanbanColumns((prev) => prev.map(col => {
            if (col.title === normalizedStatus) {
                return { ...col, tasks: [...col.tasks, newTask] };
            }
            return col;
        }));
        
        setTableData(prev => [
            ...prev,
            {
                ...newTask,
                section: normalizedStatus,
                id: `${normalizedStatus}-${Date.now()}`,
                user: (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src="/Profile.jpg" alt={task.assignee || "Me"} className="task-user-avatar" style={{ width: 22, height: 22 }} />
                        {task.assignee || "Me"}
                    </span>
                ),
            }
        ]);
        
        setShowTaskModal(false);
    };

    return (
        <div className="all-tasks-page">
            <Sidebar />
            <div className="all-tasks-content">
                <Header onNotificationClick={() => { }} />
                <div className="Tasks-top-section">
                    <div className="all-tasks-container">
                        <h2>All Tasks</h2>
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
                        </div>
                    </div>
                    <div className="tasks-filter-options">
                        <Dropdown
                            options={priorityOptions}
                            value={priority}
                            onChange={setPriority}
                            placeholder="All Priorities"
                            className="custom-select"
                        />
                        <Dropdown
                            options={tagOptions}
                            value={tag}
                            onChange={setTag}
                            placeholder="All Tags"
                            className="custom-select"
                        />
                        <Dropdown
                            options={dueDateOptions}
                            value={dueDate}
                            onChange={setDueDate}
                            placeholder="All Due Dates"
                            className="custom-select"
                        />
                        <Dropdown
                            options={createdByOptions}
                            value={createdBy}
                            onChange={setCreatedBy}
                            placeholder="All Created By"
                            className="custom-select"
                        />
                    </div>
                </div>
                <div className="Tasks-main-contents">
                    {view === "kanban" ? (
                        <div className="team-activity-board">
                            {kanbanColumns.map((col) => (
                                <div className="activity-column" key={col.title}>
                                    <div className="column-header">
                                        <div className="column-title-icon">
                                            <span className="column-icon" style={{ color: col.color }}></span>
                                            <span className="column-title">{col.title} ({col.tasks.length})</span>
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
                                        <ActivityTaskCard key={`${col.title}-${j}-${task.title}`} task={task} />
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

            <TaskModal 
                open={showTaskModal} 
                onClose={() => setShowTaskModal(false)} 
                onSubmit={handleAddTask}
            />
        </div>
    )
}