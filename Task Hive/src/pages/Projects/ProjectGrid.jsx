import React from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";

const sampleProjects = [
    {
        name: "Website Redesign",
        description: "Revamp the company website for a modern look and better UX.",
        progress: 72,
        totalTasks: 12,
        overdueTasks: 3,
        team: [
            "https://randomuser.me/api/portraits/men/32.jpg",
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/45.jpg"
        ],
        due: "Mar 24"
    },
    {
        name: "Mobile App Launch",
        description: "Prepare and launch the new mobile application.",
        progress: 55,
        totalTasks: 20,
        overdueTasks: 1,
        team: [
            "https://randomuser.me/api/portraits/women/65.jpg",
            "https://randomuser.me/api/portraits/men/12.jpg"
        ],
        due: "Apr 10"
    },
    {
        name: "Q2 Marketing Campaign",
        description: "Plan and execute the Q2 marketing campaign for new products.",
        progress: 90,
        totalTasks: 15,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/men/23.jpg",
            "https://randomuser.me/api/portraits/women/34.jpg",
            "https://randomuser.me/api/portraits/men/56.jpg",
            "https://randomuser.me/api/portraits/women/78.jpg"
        ],
        due: "May 2"
    },
    {
        name: "Customer Portal Upgrade",
        description: "Enhance the customer portal with new features and improved security.",
        progress: 40,
        totalTasks: 10,
        overdueTasks: 2,
        team: [
            "https://randomuser.me/api/portraits/men/11.jpg",
            "https://randomuser.me/api/portraits/women/22.jpg"
        ],
        due: "Feb 15"
    },
    {
        name: "Internal Tools Automation",
        description: "Automate internal tools to increase productivity across teams.",
        progress: 65,
        totalTasks: 8,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/men/33.jpg"
        ],
        due: "Mar 5"
    },
    {
        name: "SEO Optimization",
        description: "Improve website SEO to boost organic traffic and search rankings.",
        progress: 80,
        totalTasks: 7,
        overdueTasks: 1,
        team: [
            "https://randomuser.me/api/portraits/women/55.jpg",
            "https://randomuser.me/api/portraits/men/66.jpg"
        ],
        due: "Feb 28"
    },
    {
        name: "Cloud Migration",
        description: "Migrate infrastructure to the cloud for better scalability.",
        progress: 30,
        totalTasks: 18,
        overdueTasks: 4,
        team: [
            "https://randomuser.me/api/portraits/men/77.jpg",
            "https://randomuser.me/api/portraits/women/88.jpg"
        ],
        due: "Apr 20"
    },
    {
        name: "Employee Onboarding Revamp",
        description: "Redesign the onboarding process for new employees.",
        progress: 50,
        totalTasks: 6,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/women/99.jpg"
        ],
        due: "Mar 18"
    },
    {
        name: "Data Analytics Dashboard",
        description: "Develop a dashboard for real-time data analytics and reporting.",
        progress: 60,
        totalTasks: 14,
        overdueTasks: 2,
        team: [
            "https://randomuser.me/api/portraits/men/21.jpg",
            "https://randomuser.me/api/portraits/women/31.jpg"
        ],
        due: "May 10"
    },
    {
        name: "Brand Refresh",
        description: "Update company branding and marketing materials.",
        progress: 25,
        totalTasks: 9,
        overdueTasks: 1,
        team: [
            "https://randomuser.me/api/portraits/men/41.jpg"
        ],
        due: "Jun 1"
    },
    {
        name: "Partner Integration",
        description: "Integrate with new business partners' platforms.",
        progress: 45,
        totalTasks: 11,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/women/51.jpg",
            "https://randomuser.me/api/portraits/men/61.jpg"
        ],
        due: "Apr 5"
    },
    {
        name: "Support Chatbot",
        description: "Launch an AI-powered chatbot for customer support.",
        progress: 70,
        totalTasks: 13,
        overdueTasks: 2,
        team: [
            "https://randomuser.me/api/portraits/men/71.jpg",
            "https://randomuser.me/api/portraits/women/81.jpg"
        ],
        due: "Mar 30"
    },
    {
        name: "Compliance Audit",
        description: "Prepare for the annual compliance and security audit.",
        progress: 35,
        totalTasks: 5,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/men/91.jpg"
        ],
        due: "Feb 22"
    },
    {
        name: "API Gateway Enhancement",
        description: "Upgrade the API gateway for better performance and monitoring.",
        progress: 55,
        totalTasks: 10,
        overdueTasks: 1,
        team: [
            "https://randomuser.me/api/portraits/women/13.jpg",
            "https://randomuser.me/api/portraits/men/14.jpg"
        ],
        due: "Mar 12"
    },
    {
        name: "Knowledge Base Expansion",
        description: "Expand the internal knowledge base with new documentation.",
        progress: 20,
        totalTasks: 6,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/women/15.jpg"
        ],
        due: "May 25"
    }
];

export default function ProjectGrid() {
    return (
        <div className="project-grid-view">
            {sampleProjects.map((project, idx) => (
                <ProjectCard key={idx} {...project} />
            ))}
        </div>
    );
}
