
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import OutlineButton from "../../components/Buttons/Buttons";
import IconButton from "../../components/Buttons/Buttons";
import { PlusCircleIcon, FunnelIcon, TableCellsIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import AddProjectModal from "../../components/AddProjectModal/AddProjectModal";
import './Projects.css';

export default function Projects() {

    const [showAddProjectModal, setShowAddProjectModal] = useState(false);

    const [owner, setOwner] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [status, setStatus] = useState(null);
    const [view, setView] = useState("grid");

    const ownerOptions = [
        { value: "all", label: "All Owners" },
        { value: "owner1", label: "Owner 1" },
        { value: "owner2", label: "Owner 2" },
    ];

    const dueDateOptions = [
        { value: "all", label: "All Due date" },
        { value: "today", label: "Today" },
        { value: "Tomorrow", label: "Tomorrow" },
        { value: "This week", label: "This week" },
        { value: "Next week", label: "Next week" },
        { value: "This Month", label: "This Month" },
        { value: "Next Month", label: "Next Month" },
        { value: "This Month", label: "This Month" },
    ];

    const statusOptions = [
        { value: "all", label: "All Statuses" },
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
    ];


    return (
        <div className="projects-page">
            <Sidebar />
            <div className="projects-content">
                <Header onNotificationClick={() => { }} />
                <div className="project-top-content">
                    <h2>Projects Page</h2>
                    <div className="top-buttons">
                        <OutlineButton
                            icon={FunnelIcon}
                            text="Filter"
                            className="Outline-Button Add-Task"
                        />
                        <IconButton
                            icon={PlusCircleIcon}
                            text="Add Project"
                            className="Add-Task"
                            onClick={() => setShowAddProjectModal(true)}
                        />

                        <AddProjectModal open={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} />

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
                    <div className="tasks-filter-options">
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
                    {view === "grid" ? <ProjectGrid /> : <ProjectList />}
                </div>
            </div>
        </div>
    );
}