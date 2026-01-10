import React from "react";

import EditableTable from "../../components/EditableTable/EditableTable";

const columns = [
    { key: "name", label: "Project Name", width: 30 },
    { key: "description", label: "Description", width: 30 },
    { key: "progress", label: "Progress", width: 15 },
    { key: "tasks", label: "Tasks", width: 10 },
    { key: "overdue", label: "Overdue", width: 10 },
    { key: "due", label: "Due Date", width: 10 },
];

const data = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Revamp the company website for a modern look and better UX.",
        progress: "72%",
        tasks: 12,
        overdue: 3,
        due: "Mar 24"
    },
    {
        id: 2,
        name: "Mobile App Launch",
        description: "Prepare and launch the new mobile application.",
        progress: "55%",
        tasks: 20,
        overdue: 1,
        due: "Apr 10"
    },
    {
        id: 3,
        name: "Q2 Marketing Campaign",
        description: "Plan and execute the Q2 marketing campaign for new products.",
        progress: "90%",
        tasks: 15,
        overdue: 0,
        due: "May 2"
    }
];

export default function ProjectList() {
    return (
        <div className="project-list-view">
            <EditableTable columns={columns} data={data} />
        </div>
    );
}
