import Sidebar from "../../components/Sidebar/Sidebar"
import Header from "../../components/Header/Header"
import IconButton from "../../components/Buttons/Buttons"
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react";
import './MyTasks.css'
import { ChevronDownIcon } from "@heroicons/react/24/outline" 

export default function MyTasks() {
    const [date, setDate] = useState("All");
    const dates = ["All", "Today", "Upcoming", "Overdue"];

    return (
        <div className="my-tasks-page">
            <Sidebar />
            <div className="my-tasks-content">
                <Header onNotificationClick={() => { }} />
                <div className="my-tasks-main">
                    <div className="my-tasks-header">
                    <h2>My Tasks</h2>
                    <IconButton
                        icon={PlusCircleIcon}
                        text="Add Task"
                        className="Add-Task"
                    />
                    </div>

                    <div className="tasks-filter-container">
                        <div className="tasks-filter-time-switcher">
                            {dates.map((d) => (
                                <button
                                    key={d}
                                    className={date === d ? "active" : ""}
                                    onClick={() => setDate(d)}
                                    aria-pressed={date === d}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="tasks-filter-options">
                            <div className="custom-select-wrapper">
                                <select className="custom-select">
                                    <option value="all">All Projects</option>
                                    <option value="project1">Project 1</option>
                                    <option value="project2">Project 2</option>
                                </select>
                                <ChevronDownIcon className="custom-arrow" />
                            </div>
                            <div className="custom-select-wrapper">
                                <select className="custom-select">
                                    <option value="all">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <ChevronDownIcon className="custom-arrow" />
                            </div>
                            <div className="custom-select-wrapper">
                                <select className="custom-select">
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                                <ChevronDownIcon className="custom-arrow" />
                            </div>
                            <div className="custom-select-wrapper">
                                <select className="custom-select">
                                    <option value="all">All Assignees</option>
                                    <option value="user1">User 1</option>
                                    <option value="user2">User 2</option>
                                </select>
                                <ChevronDownIcon className="custom-arrow" />
                            </div>
                        </div>
                    </div>
                    {/* Add your My Tasks content here */}
                    {/* TODO: Filter tasks based on selected filter */}
                </div>
            </div>
        </div>
    )
}