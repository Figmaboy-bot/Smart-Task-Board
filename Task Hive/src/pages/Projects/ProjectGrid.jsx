import React, { useState } from "react";
import "./Projects.css";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";
import { projectsData } from "../../data/projectsData";

export default function ProjectGrid() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="project-grid-view">
            {projectsData.map((project, idx) => (
                <ProjectCard 
                    key={project.id || idx} 
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
