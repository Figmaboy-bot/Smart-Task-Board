import React, { useState } from "react";
import "./Projects.css";
import { FolderPlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EditableTable from "../../components/EditableTable/EditableTable";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";
import { useProjects } from "../../hooks/useProjects";

const columns = [
    { key: "name", label: "Project Name", cellClassName: "table-cell table-title", width: 30 },
    { key: "description", label: "Description", cellClassName: "table-cell", width: 30 },
    { key: "progress", label: "Progress", cellClassName: "table-cell", width: 15 },
    { key: "totalTasks", label: "Tasks", cellClassName: "table-cell", width: 10 },
    { key: "overdueTasks", label: "Overdue", cellClassName: "table-cell", width: 10 },
    { key: "due", label: "Due Date", cellClassName: "table-cell", width: 10 },
];

export default function ProjectList({ projects = [], filtersActive = false }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const { deleteProject } = useProjects();
    const data = projects.map((p) => ({ ...p, progress: `${p.progress}%`, originalProject: p }));

    return (
        <div className="project-list-view">
            <EditableTable
                columns={columns}
                data={data}
                onRowClick={(row) => setSelectedProject(row.originalProject)}
                onBulkDelete={(ids) => {
                    if (!window.confirm(`Delete ${ids.length} project${ids.length === 1 ? "" : "s"}? Tasks in them will be kept but unlinked. This can't be undone.`)) return;
                    ids.forEach((id) => deleteProject(id));
                }}
                emptyIcon={filtersActive ? MagnifyingGlassIcon : FolderPlusIcon}
                emptyTitle={filtersActive ? "No projects match your filters" : "No projects yet"}
                emptyDescription={filtersActive ? "Try adjusting your search or filters." : "Create your first project to get started."}
            />

            <ProjectDetailModal
                open={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
                onDelete={(project) => { deleteProject(project.id); setSelectedProject(null); }}
            />
        </div>
    );
}
