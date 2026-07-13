
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import OutlineButton from "../../components/Buttons/Buttons";
import IconButton from "../../components/Buttons/Buttons";
import { PlusCircleIcon, FunnelIcon, TableCellsIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import AddProjectModal from "../../components/AddProjectModal/AddProjectModal";
import { useProjects } from "../../hooks/useProjects";
import { useWorkspaces } from "../../context/WorkspacesContext";
import './Projects.css';

// today..+N-day windows, used by the Due Date filter below.
function isWithinRange(dateStr, startOffsetDays, endOffsetDays) {
    if (!dateStr) return false;
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() + startOffsetDays);
    const end = new Date(today);
    end.setDate(end.getDate() + endOffsetDays);
    return d >= start && d <= end;
}

function isSameMonth(dateStr, monthOffset) {
    if (!dateStr) return false;
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return false;
    const target = new Date();
    target.setDate(1);
    target.setMonth(target.getMonth() + monthOffset);
    return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
}

export default function Projects() {

    const { projects, loading, createProject } = useProjects();
    const { members } = useWorkspaces();
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(true);

    const [owner, setOwner] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [status, setStatus] = useState(null);
    const [view, setView] = useState("grid");

    const ownerOptions = useMemo(() => [
        { value: "all", label: "All Owners" },
        ...members.map((m) => ({ value: m.user_id, label: m.email })),
    ], [members]);

    const dueDateOptions = [
        { value: "all", label: "All Due date" },
        { value: "today", label: "Today" },
        { value: "this-week", label: "This week" },
        { value: "next-week", label: "Next week" },
        { value: "this-month", label: "This month" },
        { value: "next-month", label: "Next month" },
    ];

    const statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "Not Started", label: "Not Started" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
    ];

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        return projects.filter((p) => {
            if (query && !`${p.name || ""} ${p.description || ""}`.toLowerCase().includes(query)) return false;
            if (owner && owner !== "all" && p.createdBy !== owner) return false;
            if (status && status !== "all" && p.status !== status) return false;
            if (dueDate && dueDate !== "all") {
                switch (dueDate) {
                    case "today":
                        if (!isWithinRange(p.dueDateRaw, 0, 0)) return false;
                        break;
                    case "this-week":
                        if (!isWithinRange(p.dueDateRaw, 0, 6 - new Date().getDay())) return false;
                        break;
                    case "next-week": {
                        const start = 7 - new Date().getDay();
                        if (!isWithinRange(p.dueDateRaw, start, start + 6)) return false;
                        break;
                    }
                    case "this-month":
                        if (!isSameMonth(p.dueDateRaw, 0)) return false;
                        break;
                    case "next-month":
                        if (!isSameMonth(p.dueDateRaw, 1)) return false;
                        break;
                    default:
                        break;
                }
            }
            return true;
        });
    }, [projects, search, owner, status, dueDate]);

    const filtersActive = Boolean(search.trim()) || (owner && owner !== "all") || (status && status !== "all") || (dueDate && dueDate !== "all");


    return (
        <div className="projects-page">
            <Sidebar />
            <div className="projects-content">
                <Header onNotificationClick={() => { }} searchValue={search} onSearchChange={setSearch} />
                <div className="project-top-content">
                    <h2>Projects Page</h2>
                    <div className="top-buttons">
                        <OutlineButton
                            icon={FunnelIcon}
                            text="Filter"
                            className={`Outline-Button Add-Task${showFilters ? " active" : ""}`}
                            onClick={() => setShowFilters((v) => !v)}
                        />
                        <IconButton
                            icon={PlusCircleIcon}
                            text="Add Project"
                            className="Add-Task"
                            onClick={() => setShowAddProjectModal(true)}
                        />

                        <AddProjectModal
                            open={showAddProjectModal}
                            onClose={() => setShowAddProjectModal(false)}
                            onSubmit={createProject}
                        />

                    </div>
                </div>
                <div className="tasks-filter-container">
                    <div className="view-switcher">
                        <button
                            className={view === "grid" ? "active" : ""}
                            onClick={() => setView("grid")}
                        >
                            <ViewColumnsIcon className="view-icon" />
                            Grid View
                        </button>
                        <button
                            className={view === "list" ? "active" : ""}
                            onClick={() => setView("list")}
                        >
                            <TableCellsIcon className="view-icon" />
                            List View
                        </button>
                    </div>
                    <div className="tasks-filter-options" style={{ display: showFilters ? undefined : "none" }}>
                        <Dropdown
                            options={ownerOptions}
                            value={owner}
                            onChange={setOwner}
                            placeholder="All Owners"
                            className="custom-select"
                        />
                        <Dropdown
                            options={dueDateOptions}
                            value={dueDate}
                            onChange={setDueDate}
                            placeholder="All Dates"
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
                {/* Render view based on switcher */}
                <div className="projects-view-container">
                    {loading ? (
                        <p>Loading projects…</p>
                    ) : view === "grid" ? (
                        <ProjectGrid projects={filteredProjects} filtersActive={filtersActive} />
                    ) : (
                        <ProjectList projects={filteredProjects} filtersActive={filtersActive} />
                    )}
                </div>
            </div>
        </div>
    );
}