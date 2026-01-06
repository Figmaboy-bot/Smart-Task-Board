import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Teams.css';
import { IconButton, OutlineButton } from "../../components/Buttons/Buttons";
import { PlusCircleIcon, FunnelIcon, EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Teams() {
    const [users] = useState([
        { img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', status: 'Active', },
        { img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Bob Smith', email: 'bob@example.com', role: 'Designer', status: 'Suspended', },
        { img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Carol Williams', email: 'carol@example.com', role: 'Manager', status: 'Active', },
        { img: '/public/upcoming deadlines/ReportImage.jpg', member: 'David Brown', email: 'david@example.com', role: 'Developer', status: 'Invited', }
    ]);
    return (
        <div className="teams-page">
            <Sidebar />
            <div className="teams-content">
                <Header onNotificationClick={() => { }} />
                <div className="teams-main">
                    <div className="team-top-content">
                        <h2>Teams Page</h2>
                        <div className="top-buttons">
                            <IconButton
                                icon={PlusCircleIcon}
                                text="Add Team"
                                className="Add-Task"
                            />
                            <OutlineButton
                                icon={FunnelIcon}
                                text="Filter"
                                className="Manage-Teams"
                            />
                        </div>
                    </div>
                    <div className="users-table">
                        <table className="users-table-element">
                            <thead>
                                <tr>
                                    <th className="table-header-cell checkbox-header">
                                        <div className="header-radius-left">
                                            <input type="checkbox" className="table-checkbox" />
                                        </div>
                                    </th>
                                    <th className="table-header-cell img-member-header">
                                        <div className="header-main">Member</div>
                                    </th>
                                    <th className="table-header-cell email-header tb-hd-bg">
                                        <div className="header-main">Email</div>
                                    </th>
                                    <th className="table-header-cell role-header tb-hd-bg">
                                        <div className="header-main">Role</div>
                                    </th>
                                    <th className="table-header-cell status-header tb-hd-bg">
                                        <div className="header-main">Status</div>
                                    </th>
                                    <th className="table-header-cell actions-header">
                                        <div className="header-radius-right">Actions</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                                        <td className="table-cell checkbox-cell">
                                            <input type="checkbox" className="table-checkbox" />
                                        </td>
                                        <td className="table-cell img-member"><img src={user.img} alt={user.member} /> {user.member}</td>
                                        <td className="table-cell email">{user.email}</td>
                                        <td className="table-cell role">{user.role}</td>
                                        <td className="table-cell status">
                                            <span className={`status-cell ${user.status.toLowerCase()}`}>
                                                <span className={`status-circle ${user.status.toLowerCase()}`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="table-cell actions">
                                            <button className="action-button"><EllipsisHorizontalCircleIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}