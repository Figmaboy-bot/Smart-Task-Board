import React from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";

const sampleProjects = [
    {
        color: "#4F8CFF",
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
        color: "#FFB347",
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
        color: "#6be1ff",
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
