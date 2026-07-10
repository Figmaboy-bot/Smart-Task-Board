import React, { useMemo, useState } from "react"
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import IconButton, { OutlineButton } from "../../components/Buttons/Buttons";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import TaskModal from "../../components/TaskModal/TaskModal";
import TaskDetailModal from "../../components/TaskDetailModal/TaskDetailModal";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import "./Calendar.css";

const DAYS_BEFORE_TODAY = 7;
const TOTAL_DAYS = 35;
const VISIBLE_DAYS = 5;

function toIsoDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function buildDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - DAYS_BEFORE_TODAY);

    return Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return {
            label: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            date: String(d.getDate()).padStart(2, "0"),
            iso: toIsoDate(d),
            isToday: d.getTime() === today.getTime(),
        };
    });
}

export default function Calendar() {
    const { tasks, createTask, updateTask } = useTasks();
    const { projects } = useProjects();
    const { teamMembers } = useTeamMembers();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const openCreateModal = () => { setEditingTask(null); setShowTaskModal(true); };
    const openEditModal = (task) => { setEditingTask(task); setSelectedTask(null); setShowTaskModal(true); };

    const days = useMemo(() => buildDays(), []);
    const [startIdx, setStartIdx] = useState(() => Math.max(0, DAYS_BEFORE_TODAY - 1));
    const visibleDays = days.slice(startIdx, startIdx + VISIBLE_DAYS);

    const tasksByDay = useMemo(() => {
        const map = new Map();
        for (const task of tasks) {
            if (!task.due_date) continue;
            if (!map.has(task.due_date)) map.set(task.due_date, []);
            map.get(task.due_date).push(task);
        }
        return map;
    }, [tasks]);

    const handlePrev = () => {
        setStartIdx(idx => Math.max(0, idx - 1));
    };
    const handleNext = () => {
        setStartIdx(idx => Math.min(days.length - VISIBLE_DAYS, idx + 1));
    };

    const handleSubmitTask = (task) => {
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
                            <IconButton
                                icon={PlusCircleIcon}
                                text="Add Task"
                                className="Add-Task"
                                onClick={openCreateModal}
                            />
                        </div>
                    </div>
                    <div className="calendar-grid">
                        <div className="calendar-header-row">
                            <div className="calendar-time-col empty-col">
                                <button className="calendar-arrow-btn" onClick={handlePrev} disabled={startIdx === 0} aria-label="Previous days">
                                    <ChevronLeftIcon style={{ width: 20, height: 20 }} />
                                </button>
                                <button className="calendar-arrow-btn" onClick={handleNext} disabled={startIdx === days.length - VISIBLE_DAYS} aria-label="Next days">
                                    <ChevronRightIcon style={{ width: 20, height: 20 }} />
                                </button>
                            </div>
                            {visibleDays.map((d, i) => (
                                <div key={i} className={`calendar-day-col${d.isToday ? " calendar-day-col-today" : ""}`}>
                                    <div className="calendar-day-col-inner">
                                        <span className="calendar-day-label">{d.label}</span>
                                        <span className="calendar-date-label">{d.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="calendar-body-row">
                            <div className="calendar-time-col empty-col" />
                            {visibleDays.map((d, j) => {
                                const dayTasks = tasksByDay.get(d.iso) || [];
                                const slotClass = `calendar-slot${j === 0 ? ' first-slot' : ''}${j === visibleDays.length - 1 ? ' last-slot' : ''}`;
                                return (
                                    <div key={j} className={slotClass}>
                                        <div className="calendar-slot-inner">
                                            {dayTasks.length === 0 ? (
                                                <div className="calendar-day-empty">No tasks</div>
                                            ) : dayTasks.map((task) => (
                                                <button
                                                    key={task.id}
                                                    type="button"
                                                    className="calendar-event-card"
                                                    style={{ borderLeft: `3px solid ${task.statusColor}` }}
                                                    onClick={() => setSelectedTask(task)}
                                                >
                                                    <div className="calendar-event-title">{task.title}</div>
                                                    <div className="calendar-event-time">{task.project || "No project"}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                key={editingTask?.id ?? "create"}
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                projects={projects}
                teamMembers={teamMembers}
                initialTask={editingTask}
                onSubmit={handleSubmitTask}
            />

            <TaskDetailModal
                open={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEdit={openEditModal}
            />
        </div>
    );
}
