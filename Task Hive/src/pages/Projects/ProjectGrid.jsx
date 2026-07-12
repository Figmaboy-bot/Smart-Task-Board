import React, { useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectGrid({ projects = [] }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const { deleteProject } = useProjects();

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
                onDelete={(project) => { deleteProject(project.id); setSelectedProject(null); }}
            />
        </div>
    );
}
