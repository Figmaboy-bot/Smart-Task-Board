import React from "react";
import "./Buttons.css"

export default function IconButton({ icon: Icon, text, className = "", ...props }) {
    return (
        <button className={`Add-Task ${className}`} {...props}>
            {Icon && <Icon className="Add-Task-Icon" />}
            {text}
        </button>
    );
}

export function OutlineButton({ icon: Icon, text, className = "", ...props }) {
    return (
        <button className={`Outline-Button ${className}`} {...props}>
            {Icon && <Icon className="Outline-Button-Icon" />}
            {text}
        </button>
    );
}

export function SecondaryButton({ icon: Icon, text, className = "", ...props }) {
    return (
        <button className={`Secondary-Button ${className}`} {...props}>
            {Icon && <Icon className="Secondary-Button-Icon" />}
            {text}
        </button>
    );
}
