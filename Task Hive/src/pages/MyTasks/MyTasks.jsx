import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import IconButton from "../../components/Buttons/Buttons"
import { PlusCircleIcon, EllipsisVerticalIcon, ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline"
import Dropdown from "../../components/Dropdown/Dropdown"
import React, { useState, useMemo, useCallback, useRef } from "react";
import ActivityTaskCard from "../../components/ActivityTaskCard/ActivityTaskCard"
import EditableTable from "../../components/EditableTable/EditableTable";
import TaskModal from "../../components/TaskModal/TaskModal"
import TaskDetailModal from "../../components/TaskDetailModal/TaskDetailModal"
import { useTasks } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import { useTeamMembers } from "../../hooks/useTeamMembers"
import { usePreferences } from "../../context/PreferencesContext"
import './MyTasks.css'

const COLUMN_META = [
    { title: "TO-DO", color: "#2563eb" },
    { title: "IN PROGRESS", color: "#f59e42" },
    { title: "DONE", color: "#22c55e" },
];

export default function MyTasks() {
    const { tasks, loading, createTask, updateTask, updateTaskStatus } = useTasks();
    const { projects } = useProjects();
    const { teamMembers } = useTeamMembers();
    const { preferences } = usePreferences();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const openCreateModal = () => { setEditingTask(null); setShowTaskModal(true); };
    const openEditModal = (task) => { setEditingTask(task); setSelectedTask(null); setShowTaskModal(true); };
    const [dragOverCol, setDragOverCol] = useState(null);
    const dragInfo = useRef(null); // { colTitle, task }

    const [date, setDate] = useState("All");
    const dates = ["All", "Today", "Upcoming", "Overdue"];

    const [view, setView] = useState("kanban");

    // "My Tasks" = tasks assigned to the current user, matching today's
    // behavior where every task created from this page defaults to "Me".
    const myTasks = useMemo(() => tasks.filter(t => t.user.name === "Me"), [tasks]);

    const myKanbanColumns = useMemo(() => COLUMN_META
        .filter(meta => !preferences.hide_completed_tasks || meta.title !== "DONE")
        .map(meta => ({
            ...meta,
            tasks: myTasks.filter(t => t.columnTitle === meta.title),
        })), [myTasks, preferences.hide_completed_tasks]);

    const [project, setProject] = useState("all");
    const projectOptions = useMemo(() => {
        const options = [{ value: "all", label: "All Projects" }];
        const projectNames = new Set();
        myTasks.forEach(task => {
            if (task.project) projectNames.add(task.project);
        });
        projects.forEach(p => {
            if (p.name) projectNames.add(p.name);
        });
        projectNames.forEach(name => {
            options.push({ value: name, label: name });
        });
        return options;
    }, [myTasks, projects]);

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


    // Filter function wrapped in useCallback
    const filterTask = useCallback((task, columnTitle = null) => {
        // Date filter
        if (date !== "All") {
            const taskDateStr = task.date;
            if (!taskDateStr) return false;

            const currentYear = new Date().getFullYear();
            const taskDate = new Date(`${taskDateStr}, ${currentYear}`);

            if (isNaN(taskDate.getTime())) return false;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            taskDate.setHours(0, 0, 0, 0);

            switch (date) {
                case "Today":
                    if (taskDate.getTime() !== today.getTime()) return false;
                    break;
                case "Upcoming":
                    if (taskDate.getTime() <= today.getTime()) return false;
                    break;
                case "Overdue":
                    if (taskDate.getTime() >= today.getTime()) return false;
                    break;
                default:
                    break;
            }
        }

        // Project filter
        if (project !== "all") {
            const taskProject = task.project || task.projectName || "";
            if (taskProject.toLowerCase() !== project.toLowerCase() &&
                taskProject !== project) {
                return false;
            }
        }

        // Priority filter (task.status contains priority in this data structure)
        if (priority !== "all") {
            const taskPriority = (task.status || "").toLowerCase();
            if (taskPriority !== priority.toLowerCase()) {
                return false;
            }
        }

        // Status filter (based on column title)
        if (status !== "all" && columnTitle) {
            const statusMap = {
                "open": "TO-DO",
                "in_progress": "IN PROGRESS",
                "completed": "DONE"
            };
            const expectedColumn = statusMap[status];
            if (columnTitle !== expectedColumn) {
                return false;
            }
        }

        return true;
    }, [date, project, priority, status]);

    // Filtered kanban columns based on all filters
    const filteredKanbanColumns = useMemo(() => {
        return myKanbanColumns.map(col => ({
            ...col,
            tasks: col.tasks.filter(task => filterTask(task, col.title))
        }));
    }, [myKanbanColumns, filterTask]);

    // Table columns for the List view. "status" holds the task's priority
    // (High/Medium/Low, see TasksContext) and "section" holds the kanban
    // column it's currently in (To-Do/In Progress/Done) - labels below
    // reflect what's actually shown, not the raw field names.
    const tableColumns = [
        { key: "title", label: "Task", headerClassName: "table-header-cell Task", cellClassName: "table-cell table-title", width: "18%" },
        { key: "status", label: "Priority", headerClassName: "table-header-cell Status", cellClassName: "table-cell table-status", width: "9%" },
        { key: "section", label: "Status", headerClassName: "table-header-cell Action", cellClassName: "table-cell table-actions", width: "10%" },
        { key: "desc", label: "Description", headerClassName: "table-header-cell Description", cellClassName: "table-cell table-desc", width: "27%" },
        { key: "userDisplay", label: "Assigned", headerClassName: "table-header-cell Assigned", cellClassName: "table-cell table-user", width: "12%" },
        { key: "date", label: "Date", headerClassName: "table-header-cell Date", cellClassName: "table-cell table-date", width: "9%" },
        { key: "links", label: "Links", headerClassName: "table-header-cell Links", cellClassName: "table-cell table-links", width: "9%" },
    ];

    // Table data derived from kanban columns
    const tableData = useMemo(() => {
        return myKanbanColumns.flatMap((col) =>
            col.tasks.map((task) => ({
                ...task,
                section: col.title,
                originalTask: task,
                userDisplay: (
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <img src={task.user.avatar} alt={task.user.name} className="task-user-avatar" style={{ width: 22, height: 22 }} />
                        {task.user.name}
                    </span>
                ),
            }))
        );
    }, [myKanbanColumns]);

    // Filtered table data based on all filters
    const filteredTableData = useMemo(() => {
        return tableData.filter(task => filterTask(task, task.section));
    }, [tableData, filterTask]);

    const handleDragStart = (colTitle, task) => {
        dragInfo.current = { colTitle, task };
    };

    const handleDrop = (targetColTitle) => {
        if (!dragInfo.current) return;
        const { colTitle: srcCol, task } = dragInfo.current;
        dragInfo.current = null;
        setDragOverCol(null);
        if (srcCol === targetColTitle) return;

        updateTaskStatus(task.id, targetColTitle);
    };

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
                                onClick={openCreateModal}
                            />
                            <TaskModal
                                key={editingTask?.id ?? "create"}
                                open={showTaskModal}
                                onClose={() => setShowTaskModal(false)}
                                projects={projects}
                                teamMembers={teamMembers}
                                initialTask={editingTask}
                                onSubmit={(task) => {
                                    const matchedProject = projects.find(p => p.name === task.project);
                                    const payload = {
                                        title: task.title,
                                        description: task.description,
                                        priority: task.priority,
                                        assignee: task.assignee,
                                        tag: task.tag,
                                        dueDate: task.dueDate,
                                        status: task.status,
                                        links: task.links,
                                        project_id: matchedProject?.id || null,
                                        project: matchedProject?.name || task.project || "",
                                    };
                                    if (editingTask) {
                                        updateTask(editingTask.id, payload);
                                    } else {
                                        createTask(payload);
                                    }
                                    setShowTaskModal(false);
                                }}
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
                        </div>
                    </div>

                    <div className="Tasks-main-contents">
                        {loading ? (
                            <p>Loading tasks…</p>
                        ) : view === "kanban" ? (
                            <div className="team-activity-board">
                                {filteredKanbanColumns.map((col) => (
                                    <div
                                        className={`activity-column${dragOverCol === col.title ? " drag-over" : ""}`}
                                        key={col.title}
                                        onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.title); }}
                                        onDragLeave={() => setDragOverCol(null)}
                                        onDrop={() => handleDrop(col.title)}
                                    >
                                        <div className="column-header">
                                            <div className="column-title-icon">
                                                <span className="column-icon" style={{ color: col.color }}></span>
                                                <span className="column-title">{col.title} ({col.tasks.length})</span>
                                            </div>
                                            <div>
                                                <button className="column-add" onClick={openCreateModal}>
                                                    <PlusCircleIcon className="plusicon" />
                                                </button>
                                                <EllipsisVerticalIcon className="plusicon" />
                                            </div>
                                        </div>
                                        {col.tasks.map((task) => (
                                            <ActivityTaskCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => setSelectedTask(task)}
                                                onDragStart={() => handleDragStart(col.title, task)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="activity-list-view">
                                <EditableTable
                                    columns={tableColumns}
                                    data={filteredTableData}
                                    onRowClick={(row) => setSelectedTask(row.originalTask)}
                                    onRowAction={(row) => openEditModal(row.originalTask)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TaskDetailModal
                open={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEdit={openEditModal}
            />
        </div>
    );
}
