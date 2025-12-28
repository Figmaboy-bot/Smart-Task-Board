import { PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Greetings.css"

export function Greetings () {
    return (
        <div className="Greeting">
            <h2>Welcome Back Sulaimon,</h2>

            <button 
            className="Add-Task">
                <PlusCircleIcon className="Add-Task-Icon" />
                Add Task
            </button>
        </div>
    );
}