import React, { useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";

export default function ProjectGrid({ projects = [] }) {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="project-grid-view">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    {...project}
                    onClick={() => setSelectedProject(project)}
                />
            ))}
            
            <ProjectDetailModal
                open={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
            />
        </div>
    );
}
