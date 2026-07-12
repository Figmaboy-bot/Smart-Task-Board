import React from "react";
import { XMarkIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useTasks } from "../../hooks/useTasks";
import "./ProjectTasksModal.css";

const COLUMN_TO_TASK_STATUS = { "TO-DO": "todo", "IN PROGRESS": "in-progress", "DONE": "completed" };

export default function ProjectTasksModal({ open, onClose, project }) {
    const { tasks } = useTasks();

    if (!open || !project) return null;

    // task.status here is actually the task's priority (see TasksContext) and
    // task.columnTitle is its kanban column - mapped to the local shape this
    // modal already renders (status: todo/in-progress/completed).
    const projectTasks = tasks
        .filter((t) => t.project === project.name)
        .map((t) => ({
            id: t.id,
            title: t.title,
            status: COLUMN_TO_TASK_STATUS[t.columnTitle] || "todo",
            priority: (t.status || "Medium").toLowerCase(),
            assignee: t.user?.name || "Unassigned",
            dueDate: t.date || "Not set",
        }));

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed": return <CheckCircleIcon className="task-status-icon completed" />;
            case "in-progress": return <ClockIcon className="task-status-icon in-progress" />;
            case "todo": return <ExclamationCircleIcon className="task-status-icon todo" />;
            default: return <ExclamationCircleIcon className="task-status-icon todo" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "completed": return "Completed";
            case "in-progress": return "In Progress";
            case "todo": return "To Do";
            default: return "To Do";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "high": return "priority-high";
            case "medium": return "priority-medium";
            case "low": return "priority-low";
            default: return "priority-medium";
        }
    };

    const completedCount = projectTasks.filter(t => t.status === "completed").length;
    const inProgressCount = projectTasks.filter(t => t.status === "in-progress").length;
    const todoCount = projectTasks.filter(t => t.status === "todo").length;

    return (
        <div className="project-tasks-overlay" onClick={onClose}>
            <div className="project-tasks-modal" onClick={(e) => e.stopPropagation()}>
                <div className="project-tasks-header">
                    <div>
                        <h2>{project.name || project.title} - Tasks</h2>
                        <div className="tasks-summary">
                            <span className="summary-item completed">{completedCount} Completed</span>
                            <span className="summary-item in-progress">{inProgressCount} In Progress</span>
                            <span className="summary-item todo">{todoCount} To Do</span>
                        </div>
                    </div>
                    <button className="project-tasks-close" onClick={onClose}>
                        <XMarkIcon className="close-icon" />
                    </button>
                </div>

                <div className="project-tasks-body">
                    {projectTasks.length > 0 ? (
                        <div className="tasks-list">
                            {projectTasks.map((task) => (
                                <div key={task.id} className={`task-item ${task.status}`}>
                                    <div className="task-item-left">
                                        {getStatusIcon(task.status)}
                                        <div className="task-item-info">
                                            <span className="task-item-title">{task.title}</span>
                                            <span className="task-item-meta">
                                                Assigned to {task.assignee} • Due {task.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="task-item-right">
                                        <span className={`task-priority-badge ${getPriorityClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className={`task-status-badge ${task.status}`}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-tasks">
                            <p>No tasks found for this project.</p>
                        </div>
                    )}
                </div>

                <div className="project-tasks-footer">
                    <button className="project-tasks-btn secondary" onClick={onClose}>Close</button>
                    <button className="project-tasks-btn primary">Add Task</button>
                </div>
            </div>
        </div>
    );
}
