import React from 'react';
import "./StatsBoard.css"

export function StatsDashboard({ tasks = [] }) {
    const stats = [
        {
            title: 'Active Tasks',
            value: String(tasks.filter(t => t.columnTitle !== "DONE").length),
            featured: false,
        },
        {
            title: 'Completed Tasks',
            value: String(tasks.filter(t => t.columnTitle === "DONE").length),
            featured: true,
        },
        {
            title: 'Pending Tasks',
            value: String(tasks.filter(t => t.columnTitle === "TO-DO").length),
            featured: true,
        }
    ];

    return (
        <div className="Task-container">
            <div className="Task-content">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`Task ${stat.featured ? "Task--featured" : ""}`}
                    >
                        <div className='Title-Value'>
                            <h3 className="Title">
                                {stat.title}
                            </h3>

                            <div className="Value">
                                {stat.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
