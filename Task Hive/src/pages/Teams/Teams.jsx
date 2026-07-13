import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Teams.css';
import IconButton from "../../components/Buttons/Buttons";
import OutlineButton from "../../components/Buttons/Buttons";
import AddTeamModal from "../../components/AddTeamModal/AddTeamModal";
import AlertModal from "../../components/AlertModal/AlertModal";
import Dropdown from "../../components/Dropdown/Dropdown";
import { PlusCircleIcon, FunnelIcon, UserGroupIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspacesContext";

import EditableTable from "../../components/EditableTable/EditableTable";

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Invited", label: "Invited" },
    { value: "Suspended", label: "Suspended" },
];

export default function Teams() {

    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { teamMembers, loading, createTeamMember, removeTeamMember } = useTeamMembers();
    const { workspaces, activeWorkspaceId, inviteToWorkspace, members, removeMember } = useWorkspaces();
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [selfRemoveAlertOpen, setSelfRemoveAlertOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [roleFilter, setRoleFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);

    const roleOptions = useMemo(() => {
        const roles = [...new Set(teamMembers.map((m) => m.role).filter(Boolean))];
        return [{ value: "all", label: "All Roles" }, ...roles.map((r) => ({ value: r, label: r }))];
    }, [teamMembers]);

    const rows = useMemo(() => {
        const query = search.trim().toLowerCase();
        return teamMembers
            .filter((m) => !roleFilter || roleFilter === "all" || m.role === roleFilter)
            .filter((m) => !statusFilter || statusFilter === "all" || m.status === statusFilter)
            .filter((m) => !query || `${m.name || ""} ${m.email || ""} ${m.role || ""}`.toLowerCase().includes(query))
            .map((m) => ({
                ...m,
                member: m.name,
                img: m.avatar_url || "/Icons/default-profile.svg",
            }));
    }, [teamMembers, search, roleFilter, statusFilter]);

    const filtersActive = Boolean(search.trim()) || (roleFilter && roleFilter !== "all") || (statusFilter && statusFilter !== "all");

    const handleRemoveMember = (row) => {
        if (row.email && row.email === user?.email) {
            setSelfRemoveAlertOpen(true);
            return;
        }
        if (!window.confirm(`Remove ${row.name || row.email} from the team?`)) return;

        removeTeamMember(row.id);

        // team_members is a display roster separate from workspace_members
        // (the table that actually gates access) - remove both so someone
        // taken off the roster also loses real workspace access.
        if (!isGuest && row.email) {
            const accessRow = members.find((m) => m.email === row.email);
            if (accessRow) removeMember(accessRow.id).catch((err) => console.error("Failed to revoke workspace access:", err));
        }
    };

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
                <Header onNotificationClick={() => { }} searchValue={search} onSearchChange={setSearch} />
                <div className="teams-main">
                    <div className="team-top-content">
                        <h2>Teams Page</h2>
                        <div className="top-buttons">
                            <div className="filter-popover-anchor">
                                <OutlineButton
                                    icon={FunnelIcon}
                                    text="Filter"
                                    className={`Outline-Button Add-Task${showFilters ? " active" : ""}`}
                                    onClick={() => setShowFilters((v) => !v)}
                                />
                                {showFilters && (
                                    <div className="team-filter-popover">
                                        <Dropdown
                                            options={roleOptions}
                                            value={roleFilter}
                                            onChange={setRoleFilter}
                                            placeholder="All Roles"
                                            className="custom-select"
                                        />
                                        <Dropdown
                                            options={STATUS_OPTIONS}
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            placeholder="All Statuses"
                                            className="custom-select"
                                        />
                                    </div>
                                )}
                            </div>
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
                            <EditableTable
                                columns={columns}
                                data={rows}
                                onRowAction={handleRemoveMember}
                                emptyIcon={filtersActive ? MagnifyingGlassIcon : UserGroupIcon}
                                emptyTitle={filtersActive ? "No members match your filters" : "No team members yet"}
                                emptyDescription={filtersActive ? "Try adjusting your search or filters." : "Add your first team member to get started."}
                            />
                        )}
                    </div>
                </div>
                <AddTeamModal
                    open={showAddTeamModal}
                    onClose={() => setShowAddTeamModal(false)}
                    workspaces={isGuest ? [] : workspaces}
                    activeWorkspaceId={activeWorkspaceId}
                    onSubmit={(newTeam) => {
                        const targetWorkspaceIds = isGuest || !newTeam.workspaceIds?.length
                            ? [undefined]
                            : newTeam.workspaceIds;

                        targetWorkspaceIds.forEach((workspaceId) => {
                            createTeamMember(newTeam, workspaceId);
                            if (!isGuest && newTeam.email) {
                                inviteToWorkspace({ email: newTeam.email, role: "Member" }, workspaceId).catch((err) => {
                                    console.error("Failed to invite team member:", err);
                                });
                            }
                        });
                        setShowAddTeamModal(false);
                    }}
                />
                <AlertModal
                    open={selfRemoveAlertOpen}
                    title="Can't remove yourself"
                    message="You can't remove yourself from the team."
                    onClose={() => setSelfRemoveAlertOpen(false)}
                />
            </div>
        </div>
    );
}
