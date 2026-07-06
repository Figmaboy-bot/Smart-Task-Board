
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Greetings.css";
import IconButton from "../../components/Buttons/Buttons";
import TaskModal from "../TaskModal/TaskModal";
export function Greetings({ projects = [], teamMembers = [], createTask }) {
    const [showTaskModal, setShowTaskModal] = useState(false);

    const handleAddTask = (task) => {
        const matchedProject = projects.find(p => p.name === task.project);
        createTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            assignee: task.assignee,
            tag: task.tag,
            dueDate: task.dueDate,
            status: task.status,
            links: task.links,
            project_id: matchedProject?.id || null,
            project: matchedProject?.name || task.project || "",
        });
        setShowTaskModal(false);
    };

    return (
        <div className="Greeting">
            <h2>Welcome Back,</h2>
            <IconButton
                icon={PlusCircleIcon}
                text="Add Task"
                className="Add-Task"
                onClick={() => setShowTaskModal(true)}
            />
            <TaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={handleAddTask}
            />
        </div>
    );
}
