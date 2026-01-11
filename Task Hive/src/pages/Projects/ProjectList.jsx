import React from "react";
import "./Projects.css";
import EditableTable from "../../components/EditableTable/EditableTable";

const columns = [
    { key: "name", label: "Project Name", cellClassName: "table-cell table-title", width: 30 },
    { key: "description", label: "Description", cellClassName: "table-cell", width: 30 },
    { key: "progress", label: "Progress", cellClassName: "table-cell", width: 15 },
    { key: "tasks", label: "Tasks", cellClassName: "table-cell", width: 10 },
    { key: "overdue", label: "Overdue", cellClassName: "table-cell", width: 10 },
    { key: "due", label: "Due Date", cellClassName: "table-cell", width: 10 },
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
    },
    {
        id: 4,
        name: "Customer Portal Upgrade",
        description: "Enhance the customer portal with new features and improved security.",
        progress: "40%",
        tasks: 10,
        overdue: 2,
        due: "Feb 15"
    },
    {
        id: 5,
        name: "Internal Tools Automation",
        description: "Automate internal tools to increase productivity across teams.",
        progress: "65%",
        tasks: 8,
        overdue: 0,
        due: "Mar 5"
    },
    {
        id: 6,
        name: "SEO Optimization",
        description: "Improve website SEO to boost organic traffic and search rankings.",
        progress: "80%",
        tasks: 7,
        overdue: 1,
        due: "Feb 28"
    },
    {
        id: 7,
        name: "Cloud Migration",
        description: "Migrate infrastructure to the cloud for better scalability.",
        progress: "30%",
        tasks: 18,
        overdue: 4,
        due: "Apr 20"
    },
    {
        id: 8,
        name: "Employee Onboarding Revamp",
        description: "Redesign the onboarding process for new employees.",
        progress: "50%",
        tasks: 6,
        overdue: 0,
        due: "Mar 18"
    },
    {
        id: 9,
        name: "Data Analytics Dashboard",
        description: "Develop a dashboard for real-time data analytics and reporting.",
        progress: "60%",
        tasks: 14,
        overdue: 2,
        due: "May 10"
    },
    {
        id: 10,
        name: "Brand Refresh",
        description: "Update company branding and marketing materials.",
        progress: "25%",
        tasks: 9,
        overdue: 1,
        due: "Jun 1"
    },
    {
        id: 11,
        name: "Partner Integration",
        description: "Integrate with new business partners' platforms.",
        progress: "45%",
        tasks: 11,
        overdue: 0,
        due: "Apr 5"
    },
    {
        id: 12,
        name: "Support Chatbot",
        description: "Launch an AI-powered chatbot for customer support.",
        progress: "70%",
        tasks: 13,
        overdue: 2,
        due: "Mar 30"
    },
    {
        id: 13,
        name: "Compliance Audit",
        description: "Prepare for the annual compliance and security audit.",
        progress: "35%",
        tasks: 5,
        overdue: 0,
        due: "Feb 22"
    },
    {
        id: 14,
        name: "API Gateway Enhancement",
        description: "Upgrade the API gateway for better performance and monitoring.",
        progress: "55%",
        tasks: 10,
        overdue: 1,
        due: "Mar 12"
    },
    {
        id: 15,
        name: "Knowledge Base Expansion",
        description: "Expand the internal knowledge base with new documentation.",
        progress: "20%",
        tasks: 6,
        overdue: 0,
        due: "May 25"
    }
];
export default function ProjectList() {
    return (
        <div className="project-list-view">
            <EditableTable columns={columns} data={data} />
        </div>
    );
}
