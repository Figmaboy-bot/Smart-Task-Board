import React from 'react';
import "./StatsBoard.css"
import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export function StatsDashboard() {
    const stats = [
        {
            title: 'Active Tasks',
            value: '12',
            change: 8,
            trend: 'up',
            featured: false,
        },
        {
            title: 'Completed Tasks',
            value: '8',
            change: 20,
            trend: 'up',
            featured: true,
        },
        {
            title: 'Pending Tasks',
            value: '5',
            change: 12,
            trend: 'down',
            featured: true,
        }
    ];



    return (
        <div className="Task-container">

            <div className="Task-content">
                {stats.map((stat, index) => {

                    return (
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

                            <div className="stat-container">
                                <div>
                                {stat.trend === 'up' ? (
                                    <div className='statDetails'>
                                        <ArrowTrendingUpIcon className="ArrowUp" />
                                        <span className="statpositive">
                                            {stat.change}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className='statDetails'>
                                        <ArrowTrendingDownIcon className="ArrowDown" />
                                        <span className="statnegative">
                                            {stat.change}%
                                        </span>
                                    </div>
                                )}
                                </div>
                                <span className="stat-subtext">
                                    Compared to last week
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}