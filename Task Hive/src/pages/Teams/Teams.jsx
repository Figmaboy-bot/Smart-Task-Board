import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Teams.css';
import IconButton from "../../components/Buttons/Buttons";
import OutlineButton from "../../components/Buttons/Buttons";
import { PlusCircleIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import EditableTable from "../../components/EditableTable/EditableTable";

export default function Teams() {
    const [users, setUsers] = useState([
        { id: 1, img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', status: 'Active', },
        { id: 2, img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Bob Smith', email: 'bob@example.com', role: 'Designer', status: 'Suspended', },
        { id: 3, img: '/public/upcoming deadlines/ReportImage.jpg', member: 'Carol Williams', email: 'carol@example.com', role: 'Manager', status: 'Active', },
        { id: 4, img: '/public/upcoming deadlines/ReportImage.jpg', member: 'David Brown', email: 'david@example.com', role: 'Developer', status: 'Invited', }
    ]);

    const columns = [
        {
            key: "member",
            label: "Member",
            headerClassName: "table-header-cell img-member-header",
            cellClassName: "table-cell img-member",
            editable: true,
            width: "30%",
        },
        {
            key: "email",
            label: "Email",
            headerClassName: "table-header-cell email-header tb-hd-bg",
            cellClassName: "table-cell email",
            editable: true,
            width: "25%",
        },
        {
            key: "role",
            label: "Role",
            headerClassName: "table-header-cell role-header tb-hd-bg",
            cellClassName: "table-cell role",
            editable: true,
            width: "15%",
        },
        {
            key: "status",
            label: "Status",
            headerClassName: "table-header-cell status-header tb-hd-bg",
            cellClassName: "table-cell status",
            editable: true,
            width: "15%",
        },
    ];
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
                    <div>
                        <EditableTable
                            columns={columns}
                            data={users}
                            onChange={setUsers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}