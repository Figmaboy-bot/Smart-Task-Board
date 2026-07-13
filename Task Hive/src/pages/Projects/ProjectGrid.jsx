import React, { useState } from "react";
import "./Projects.css";
import { FolderPlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";
import EmptyState from "../../components/EmptyState/EmptyState";
import { useProjects } from "../../hooks/useProjects";

export default function ProjectGrid({ projects = [], filtersActive = false }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const { deleteProject } = useProjects();

    if (projects.length === 0) {
        return (
            <EmptyState
                icon={filtersActive ? MagnifyingGlassIcon : FolderPlusIcon}
                title={filtersActive ? "No projects match your filters" : "No projects yet"}
                description={filtersActive ? "Try adjusting your search or filters." : "Create your first project to get started."}
            />
        );
    }

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
