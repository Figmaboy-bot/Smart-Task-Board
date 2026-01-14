
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Greetings.css";
import IconButton from "../../components/Buttons/Buttons";
import TaskModal from "../TaskModal/TaskModal";

export function Greetings () {
    const [showTaskModal, setShowTaskModal] = useState(false);
    return (
        <div className="Greeting">
            <h2>Welcome Back Sulaimon,</h2>
            <IconButton 
                icon={PlusCircleIcon}
                text="Add Task"
                className="Add-Task"
                onClick={() => setShowTaskModal(true)}
            />
            <TaskModal open={showTaskModal} onClose={() => setShowTaskModal(false)} />
        </div>
    );
}