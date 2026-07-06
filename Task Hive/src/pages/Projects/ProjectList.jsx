import React from "react";
import "./Projects.css";
import EditableTable from "../../components/EditableTable/EditableTable";

const columns = [
    { key: "name", label: "Project Name", cellClassName: "table-cell table-title", width: 30 },
    { key: "description", label: "Description", cellClassName: "table-cell", width: 30 },
    { key: "progress", label: "Progress", cellClassName: "table-cell", width: 15 },
    { key: "totalTasks", label: "Tasks", cellClassName: "table-cell", width: 10 },
    { key: "overdueTasks", label: "Overdue", cellClassName: "table-cell", width: 10 },
    { key: "due", label: "Due Date", cellClassName: "table-cell", width: 10 },
];

export default function ProjectList({ projects = [] }) {
    const data = projects.map((p) => ({ ...p, progress: `${p.progress}%` }));
    return (
        <div className="project-list-view">
            <EditableTable columns={columns} data={data} />
        </div>
    );
}
