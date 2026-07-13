import React, { useMemo, useState } from "react"
import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import TaskModal from "../../components/TaskModal/TaskModal"
import TaskDetailModal from "../../components/TaskDetailModal/TaskDetailModal"
import { useTasks, PRIORITY_COLOR } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import { useTeamMembers } from "../../hooks/useTeamMembers"
import { ChartBarIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import EmptyState from "../../components/EmptyState/EmptyState"
import './ReportsInsights.css'

const STATUS_COLUMNS = [
    { key: "TO-DO", label: "To-Do", color: "var(--primary-30)" },
    { key: "IN PROGRESS", label: "In Progress", color: "var(--primary-50)" },
    { key: "DONE", label: "Done", color: "var(--primary-70)" },
];

const PRIORITY_ORDER = ["High", "Medium", "Low"];

function todayIso() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Groups the long tail beyond `limit` into a single "Other" bucket so a
// project/assignee list with many entries stays within the categorical
// series-count ladder instead of growing an unbounded bar list.
function topEntries(counts, limit = 5) {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length <= limit) return entries;
    const top = entries.slice(0, limit);
    const otherCount = entries.slice(limit).reduce((sum, [, c]) => sum + c, 0);
    return [...top, ["Other", otherCount]];
}

function BarList({ items, maxValue, total }) {
    const [hovered, setHovered] = useState(null);

    if (items.length === 0) {
        return <EmptyState compact icon={ChartBarIcon} title="No data yet" />;
    }

    return (
        <div className="ri-bar-list">
            {items.map((item) => {
                const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const share = total > 0 ? Math.round((item.value / total) * 100) : 0;
                const isHovered = hovered === item.label;
                return (
                    <div
                        key={item.label}
                        className={`ri-bar-row${isHovered ? " ri-bar-row-active" : ""}`}
                        tabIndex={0}
                        onMouseEnter={() => setHovered(item.label)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(item.label)}
                        onBlur={() => setHovered(null)}
                    >
                        <div className="ri-bar-label">
                            {item.dot && <span className="ri-bar-dot" style={{ background: item.color }} />}
                            <span>{item.label}</span>
                        </div>
                        <div className="ri-bar-track">
                            <div className="ri-bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                        </div>
                        <div className="ri-bar-value">{isHovered ? `${item.value} · ${share}%` : item.value}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default function ReportsInsights() {
    const { tasks, updateTask } = useTasks();
    const { projects } = useProjects();
    const { teamMembers } = useTeamMembers();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const openEditModal = (task) => { setEditingTask(task); setSelectedTask(null); setShowTaskModal(true); };

    const stats = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter(t => t.columnTitle === "DONE").length;
        const inProgress = tasks.filter(t => t.columnTitle === "IN PROGRESS").length;
        const today = todayIso();
        const overdue = tasks
            .filter(t => t.due_date && t.due_date < today && t.columnTitle !== "DONE")
            .sort((a, b) => a.due_date.localeCompare(b.due_date));

        const byStatus = STATUS_COLUMNS.map(col => ({
            label: col.label,
            value: tasks.filter(t => t.columnTitle === col.key).length,
            color: col.color,
        }));

        const byPriority = PRIORITY_ORDER.map(p => ({
            label: p,
            value: tasks.filter(t => t.status === p).length,
            color: PRIORITY_COLOR[p],
            dot: true,
        }));

        const projectCounts = {};
        tasks.forEach(t => {
            const key = t.project || "No Project";
            projectCounts[key] = (projectCounts[key] || 0) + 1;
        });
        const byProject = topEntries(projectCounts).map(([label, value]) => ({ label, value, color: "var(--primary-50)" }));

        const assigneeCounts = {};
        tasks.forEach(t => {
            const key = t.user?.name || "Unassigned";
            assigneeCounts[key] = (assigneeCounts[key] || 0) + 1;
        });
        const byAssignee = topEntries(assigneeCounts).map(([label, value]) => ({ label, value, color: "var(--primary-50)" }));

        return {
            total, done, inProgress, overdue,
            completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
            byStatus, byPriority, byProject, byAssignee,
        };
    }, [tasks]);

    const handleSubmitTask = (task) => {
        if (!editingTask) return;
        const matchedProject = projects.find(p => p.name === task.project);
        updateTask(editingTask.id, {
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
        });
        setShowTaskModal(false);
    };

    return (
        <div className="reports-insights-page">
            <Sidebar />
            <div className="reports-insights-content">
                <Header onNotificationClick={() => { }} />
                <div className="reports-insights-container">
                    <h2>Reports &amp; Insights</h2>

                    <div className="ri-kpi-row">
                        <div className="ri-kpi-tile">
                            <span className="ri-kpi-label">Total Tasks</span>
                            <span className="ri-kpi-value">{stats.total}</span>
                        </div>
                        <div className="ri-kpi-tile">
                            <span className="ri-kpi-label">Completed</span>
                            <span className="ri-kpi-value">{stats.done}</span>
                        </div>
                        <div className="ri-kpi-tile">
                            <span className="ri-kpi-label">In Progress</span>
                            <span className="ri-kpi-value">{stats.inProgress}</span>
                        </div>
                        <div className="ri-kpi-tile">
                            <span className={`ri-kpi-label${stats.overdue.length ? " ri-kpi-label-danger" : ""}`}>Overdue</span>
                            <span className={`ri-kpi-value${stats.overdue.length ? " ri-kpi-value-danger" : ""}`}>{stats.overdue.length}</span>
                        </div>
                    </div>

                    <div className="ri-card">
                        <h3>Completion Rate</h3>
                        <div className="ri-meter">
                            <div className="ri-meter-track">
                                <div className="ri-meter-fill" style={{ width: `${stats.completionRate}%` }} />
                            </div>
                            <span className="ri-meter-value">{stats.completionRate}%</span>
                        </div>
                        <p className="ri-caption">{stats.done} of {stats.total} tasks completed</p>
                    </div>

                    <div className="ri-grid">
                        <div className="ri-card">
                            <h3>Tasks by Status</h3>
                            <BarList items={stats.byStatus} maxValue={stats.total} total={stats.total} />
                        </div>
                        <div className="ri-card">
                            <h3>Tasks by Priority</h3>
                            <BarList items={stats.byPriority} maxValue={stats.total} total={stats.total} />
                        </div>
                        <div className="ri-card">
                            <h3>Tasks by Project</h3>
                            <BarList items={stats.byProject} maxValue={Math.max(1, ...stats.byProject.map(i => i.value))} total={stats.total} />
                        </div>
                        <div className="ri-card">
                            <h3>Team Workload</h3>
                            <BarList items={stats.byAssignee} maxValue={Math.max(1, ...stats.byAssignee.map(i => i.value))} total={stats.total} />
                        </div>
                    </div>

                    <div className="ri-card">
                        <h3>Overdue Tasks</h3>
                        {stats.overdue.length === 0 ? (
                            <EmptyState compact icon={CheckCircleIcon} title="Nothing overdue" description="Nice work." />
                        ) : (
                            <div className="ri-overdue-list">
                                {stats.overdue.map(task => (
                                    <button key={task.id} type="button" className="ri-overdue-row" onClick={() => setSelectedTask(task)}>
                                        <span className="ri-overdue-title">{task.title}</span>
                                        <span className="ri-overdue-project">{task.project || "No Project"}</span>
                                        <span className="ri-overdue-assignee">{task.user?.name}</span>
                                        <span className="ri-overdue-date">{task.date}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TaskModal
                key={editingTask?.id ?? "edit"}
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
    )
}
