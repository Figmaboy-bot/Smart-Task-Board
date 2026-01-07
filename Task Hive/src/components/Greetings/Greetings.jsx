import { PlusCircleIcon } from "@heroicons/react/24/outline";
import "./Greetings.css"
import IconButton from "../../components/Buttons/Buttons";

export function Greetings () {
    return (
        <div className="Greeting">
            <h2>Welcome Back Sulaimon,</h2>

            <IconButton 
            icon={PlusCircleIcon}
            text="Add Task"
            className="Add-Task"
            />
        </div>
    );
}