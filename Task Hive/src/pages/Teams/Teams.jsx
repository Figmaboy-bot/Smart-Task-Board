import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Teams.css';
import IconButton from "../../components/Buttons/Buttons";
import OutlineButton from "../../components/Buttons/Buttons";
import AddTeamModal from "../../components/AddTeamModal/AddTeamModal";
import { PlusCircleIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspacesContext";

import EditableTable from "../../components/EditableTable/EditableTable";

export default function Teams() {

    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { teamMembers, loading, createTeamMember } = useTeamMembers();
    const { inviteToWorkspace } = useWorkspaces();
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);

    const rows = useMemo(() => teamMembers.map((m) => ({
        ...m,
        member: m.name,
        img: m.avatar_url || "/Icons/default-profile.svg",
    })), [teamMembers]);

    const columns = [
        {
            key: "member",
            label: "Member",
            headerClassName: "table-header-cell img-member-header",
            cellClassName: "table-cell img-member",
            width: "30%",
        },
        {
            key: "email",
            label: "Email",
            headerClassName: "table-header-cell email-header tb-hd-bg",
            cellClassName: "table-cell email",
            width: "25%",
        },
        {
            key: "role",
            label: "Role",
            headerClassName: "table-header-cell role-header tb-hd-bg",
            cellClassName: "table-cell role",
            width: "15%",
        },
        {
            key: "status",
            label: "Status",
            headerClassName: "table-header-cell status-header tb-hd-bg",
            cellClassName: "table-cell status",
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
                            <OutlineButton
                                icon={FunnelIcon}
                                text="Filter"
                                className="Outline-Button Add-Task"
                            />
                            <IconButton
                                icon={PlusCircleIcon}
                                text="Add Team"
                                className="Add-Task"
                                onClick={() => setShowAddTeamModal(true)}
                            />
                        </div>
                    </div>
                    <div>
                        {loading ? (
                            <p>Loading team members…</p>
                        ) : (
                            <EditableTable columns={columns} data={rows} />
                        )}
                    </div>
                </div>
                <AddTeamModal open={showAddTeamModal} onClose={() => setShowAddTeamModal(false)} onSubmit={(newTeam) => {
                    createTeamMember(newTeam);
                    if (!isGuest && newTeam.email) {
                        inviteToWorkspace({ email: newTeam.email, role: "Member" }).catch((err) => {
                            console.error("Failed to invite team member:", err);
                        });
                    }
                    setShowAddTeamModal(false);
                }} />
            </div>
        </div>
    );
}
