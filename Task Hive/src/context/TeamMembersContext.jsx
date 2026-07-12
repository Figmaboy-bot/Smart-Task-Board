import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";
import { useWorkspaces } from "./WorkspacesContext";

// Demo content shown in guest mode (never touches Supabase), ported from the
// hardcoded seed data (src/pages/Teams/Teams.jsx) used before real persistence existed.
const GUEST_TEAM_MEMBERS = [
    { id: "guest-member-1", name: "Alice Johnson", email: "alice@example.com", role: "Developer", status: "Active", avatar_url: "/upcoming deadlines/ReportImage.jpg" },
    { id: "guest-member-2", name: "Bob Smith", email: "bob@example.com", role: "Designer", status: "Suspended", avatar_url: "/upcoming deadlines/ReportImage.jpg" },
    { id: "guest-member-3", name: "Carol Williams", email: "carol@example.com", role: "Manager", status: "Active", avatar_url: "/upcoming deadlines/ReportImage.jpg" },
    { id: "guest-member-4", name: "David Brown", email: "david@example.com", role: "Developer", status: "Invited", avatar_url: "/upcoming deadlines/ReportImage.jpg" },
];

const TeamMembersContext = createContext(null);

// Single shared instance so every page and the Header read the same live
// team-member list, instead of each mounting its own disconnected copy.
export function TeamMembersProvider({ children }) {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { activeWorkspaceId } = useWorkspaces();
    const [teamMembers, setTeamMembers] = useState(() => (isGuest ? GUEST_TEAM_MEMBERS : []));
    const [loading, setLoading] = useState(!isGuest);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        supabase
            .from("team_members")
            .select("*")
            .eq("workspace_id", activeWorkspaceId)
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load team members:", error);
                    setTeamMembers([]);
                } else {
                    setTeamMembers(data);
                }
                setLoading(false);
            });

        return () => { cancelled = true };
    }, [user, isGuest, activeWorkspaceId]);

    const createTeamMember = useCallback(async ({ member, email, role, status, img }, workspaceId) => {
        if (isGuest) {
            const localMember = {
                id: `guest-member-${Date.now()}`,
                name: member,
                email,
                role: role || "Member",
                status: status || "Invited",
                avatar_url: img || null,
            };
            setTeamMembers((prev) => [...prev, localMember]);
            return localMember;
        }

        const targetWorkspaceId = workspaceId || activeWorkspaceId;
        const { data, error } = await supabase
            .from("team_members")
            .insert({
                workspace_id: targetWorkspaceId,
                name: member,
                email,
                role: role || "Member",
                status: status || "Invited",
                avatar_url: img || null,
            })
            .select()
            .single();

        if (error) throw error;
        // Only reflect it in the visible list if it was added to the
        // workspace currently being viewed; other targeted workspaces will
        // pick it up next time their own team_members list is fetched.
        if (targetWorkspaceId === activeWorkspaceId) {
            setTeamMembers((prev) => [...prev, data]);
        }
        return data;
    }, [isGuest, activeWorkspaceId]);

    const removeTeamMember = useCallback(async (memberId) => {
        setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));

        if (isGuest) return;

        const { error } = await supabase.from("team_members").delete().eq("id", memberId);
        if (error) console.error("Failed to remove team member:", error);
    }, [isGuest]);

    return (
        <TeamMembersContext.Provider value={{ teamMembers, loading, createTeamMember, removeTeamMember }}>
            {children}
        </TeamMembersContext.Provider>
    );
}

export function useTeamMembers() {
    const ctx = useContext(TeamMembersContext);
    if (!ctx) throw new Error("useTeamMembers must be used within a TeamMembersProvider");
    return ctx;
}
