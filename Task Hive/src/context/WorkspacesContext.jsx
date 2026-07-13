import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

function storageKey(userId) {
    return userId ? `activeWorkspaceId:${userId}` : null;
}

const WorkspacesContext = createContext(null);

// Real multi-tenant workspaces: every other data context reads
// activeWorkspaceId from here and scopes its queries/inserts to it. Guest
// sessions never touch Supabase, so they get no workspace concept at all.
export function WorkspacesProvider({ children }) {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspaceId, setActiveWorkspaceIdState] = useState(null);
    const [loading, setLoading] = useState(!isGuest);

    const setActiveWorkspaceId = useCallback((id) => {
        setActiveWorkspaceIdState(id);
        const key = storageKey(user?.id);
        if (key) localStorage.setItem(key, id);
    }, [user]);

    useEffect(() => {
        if (isGuest) {
            setWorkspaces([]);
            setActiveWorkspaceIdState(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        (async () => {
            // On a cold page load this can race supabase-js's own auth-token
            // lock while it's still being acquired by other mount-time calls
            // (preferences, MFA check, ...), which rejects with a transient
            // lock-contention error instead of a real API response. Left
            // unguarded, that falsely looked like "you have zero workspaces"
            // and could nudge an existing user into creating a duplicate one.
            let data, error;
            for (let attempt = 0; attempt < 3; attempt++) {
                ({ data, error } = await supabase
                    .from("workspace_members")
                    .select("role, workspaces(id, name, created_by)")
                    .eq("user_id", user.id));
                if (!error || !/lock/i.test(error.message || "")) break;
                await new Promise((resolve) => setTimeout(resolve, 600));
            }

            if (cancelled) return;

            if (error) {
                console.error("Failed to load workspaces:", error);
                setWorkspaces([]);
                setLoading(false);
                return;
            }

            let rows = (data || [])
                .filter((r) => r.workspaces)
                .map((r) => ({ id: r.workspaces.id, name: r.workspaces.name, role: r.role }));

            // Accept any pending invites addressed to this email before
            // deciding whether to auto-provision a new workspace, so an
            // invited teammate joins the workspace they were invited to
            // instead of getting a fresh empty one.
            const { data: invites, error: invitesError } = await supabase
                .from("workspace_invites")
                .select("id, workspace_id, role, workspaces(name)")
                .eq("email", user.email)
                .is("accepted_at", null);

            if (!invitesError && invites?.length) {
                for (const invite of invites) {
                    try {
                        const { error: joinError } = await supabase
                            .from("workspace_members")
                            .insert({ workspace_id: invite.workspace_id, user_id: user.id, email: user.email, role: invite.role });
                        if (joinError) throw joinError;

                        await supabase
                            .from("workspace_invites")
                            .update({ accepted_at: new Date().toISOString() })
                            .eq("id", invite.id);

                        await supabase
                            .from("team_members")
                            .update({ status: "Active" })
                            .eq("workspace_id", invite.workspace_id)
                            .eq("email", user.email);

                        if (invite.workspaces && !rows.some((w) => w.id === invite.workspace_id)) {
                            rows = [...rows, { id: invite.workspace_id, name: invite.workspaces.name, role: invite.role }];
                        }
                    } catch (acceptError) {
                        console.error("Failed to accept workspace invite:", acceptError);
                    }
                }
            }

            // A signed-up user with no workspace yet gets the onboarding
            // wizard (see OnboardingWizard / ProtectedRoute) instead of a
            // workspace provisioned silently here - it's the wizard's own
            // "Create your workspace" step that creates the first one.

            if (cancelled) return;

            setWorkspaces(rows);
            const key = storageKey(user.id);
            const stored = key ? localStorage.getItem(key) : null;
            const validStored = rows.find((w) => w.id === stored);
            setActiveWorkspaceIdState(validStored ? stored : (rows[0]?.id || null));
            setLoading(false);
        })();

        return () => { cancelled = true };
    }, [user, isGuest]);

    const createWorkspace = useCallback(async (name, size) => {
        const trimmed = name.trim();
        if (!trimmed) return null;

        const { data: workspace, error } = await supabase
            .from("workspaces")
            .insert({ name: trimmed, created_by: user.id, size: size || null })
            .select()
            .single();
        if (error) throw error;

        const { error: memberError } = await supabase
            .from("workspace_members")
            .insert({ workspace_id: workspace.id, user_id: user.id, email: user.email, role: "Owner" });
        if (memberError) throw memberError;

        await supabase.from("team_members").insert({
            workspace_id: workspace.id,
            name: (user.email || "Me").split("@")[0],
            email: user.email,
            role: "Owner",
            status: "Active",
        });

        const newRow = { id: workspace.id, name: workspace.name, role: "Owner" };
        setWorkspaces((prev) => [...prev, newRow]);
        setActiveWorkspaceId(workspace.id);
        return newRow;
    }, [user, setActiveWorkspaceId]);

    const [members, setMembers] = useState([]);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId) {
            setMembers([]);
            setPendingInvites([]);
            return;
        }

        let cancelled = false;
        setMembersLoading(true);

        (async () => {
            const [membersRes, invitesRes] = await Promise.all([
                supabase
                    .from("workspace_members")
                    .select("id, user_id, email, role")
                    .eq("workspace_id", activeWorkspaceId)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("workspace_invites")
                    .select("id, email, role, created_at")
                    .eq("workspace_id", activeWorkspaceId)
                    .is("accepted_at", null)
                    .order("created_at", { ascending: true }),
            ]);

            if (cancelled) return;

            if (membersRes.error) {
                console.error("Failed to load workspace members:", membersRes.error);
                setMembers([]);
            } else {
                setMembers(membersRes.data);
            }

            if (invitesRes.error) {
                console.error("Failed to load pending invites:", invitesRes.error);
                setPendingInvites([]);
            } else {
                setPendingInvites(invitesRes.data);
            }

            setMembersLoading(false);
        })();

        return () => { cancelled = true };
    }, [isGuest, activeWorkspaceId]);

    const removeMember = useCallback(async (memberRowId) => {
        const { error } = await supabase.from("workspace_members").delete().eq("id", memberRowId);
        if (error) throw error;
        setMembers((prev) => prev.filter((m) => m.id !== memberRowId));
    }, []);

    const cancelInvite = useCallback(async (inviteId) => {
        const { error } = await supabase.from("workspace_invites").delete().eq("id", inviteId);
        if (error) throw error;
        setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    }, []);

    const [inviteLinks, setInviteLinks] = useState([]);
    const [inviteLinksLoading, setInviteLinksLoading] = useState(false);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId) {
            setInviteLinks([]);
            return;
        }

        let cancelled = false;
        setInviteLinksLoading(true);

        supabase
            .from("workspace_invite_links")
            .select("id, token, role, use_count, max_uses, revoked, created_at")
            .eq("workspace_id", activeWorkspaceId)
            .eq("revoked", false)
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load invite links:", error);
                    setInviteLinks([]);
                } else {
                    setInviteLinks(data);
                }
                setInviteLinksLoading(false);
            });

        return () => { cancelled = true };
    }, [isGuest, activeWorkspaceId]);

    const createInviteLink = useCallback(async (role = "Member") => {
        if (!activeWorkspaceId) return null;
        const { data, error } = await supabase
            .from("workspace_invite_links")
            .insert({
                workspace_id: activeWorkspaceId,
                role: role === "Owner" ? "Owner" : "Member",
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        setInviteLinks((prev) => [...prev, data]);
        return data;
    }, [activeWorkspaceId, user]);

    const revokeInviteLink = useCallback(async (linkId) => {
        const { error } = await supabase.from("workspace_invite_links").update({ revoked: true }).eq("id", linkId);
        if (error) throw error;
        setInviteLinks((prev) => prev.filter((l) => l.id !== linkId));
    }, []);

    const redeemInviteLink = useCallback(async (token) => {
        // On a cold page load (someone opening a shared link in a fresh
        // tab), this call can race supabase-js's own auth-token lock while
        // it's still being acquired by the session/MFA checks that fire on
        // mount, which rejects with a lock-contention error rather than a
        // real API response. That's transient, so retry a couple of times
        // instead of surfacing a false "invalid link" to the user.
        let data, error;
        for (let attempt = 0; attempt < 3; attempt++) {
            ({ data, error } = await supabase.rpc("redeem_invite_link", { _token: token }));
            if (!error || !/lock/i.test(error.message || "")) break;
            await new Promise((resolve) => setTimeout(resolve, 600));
        }
        if (error) throw error;
        const row = data?.[0];
        if (!row) throw new Error("This invite link is invalid or has expired.");

        const joined = { id: row.out_workspace_id, name: row.out_workspace_name, role: "Member" };
        setWorkspaces((prev) => (prev.some((w) => w.id === joined.id) ? prev : [...prev, joined]));
        setActiveWorkspaceId(joined.id);
        return joined;
    }, [setActiveWorkspaceId]);

    const inviteToWorkspace = useCallback(async ({ email, role }, workspaceId) => {
        const targetWorkspaceId = workspaceId || activeWorkspaceId;
        if (!targetWorkspaceId) return null;
        const { data, error } = await supabase
            .from("workspace_invites")
            .insert({
                workspace_id: targetWorkspaceId,
                email: email.trim().toLowerCase(),
                role: role === "Owner" ? "Owner" : "Member",
                invited_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        if (targetWorkspaceId === activeWorkspaceId) {
            setPendingInvites((prev) => [...prev, data]);
        }
        return data;
    }, [user, activeWorkspaceId]);

    const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || null;

    return (
        <WorkspacesContext.Provider value={{
            workspaces,
            activeWorkspaceId,
            activeWorkspace,
            loading,
            setActiveWorkspaceId,
            createWorkspace,
            inviteToWorkspace,
            members,
            pendingInvites,
            membersLoading,
            removeMember,
            cancelInvite,
            inviteLinks,
            inviteLinksLoading,
            createInviteLink,
            revokeInviteLink,
            redeemInviteLink,
        }}>
            {children}
        </WorkspacesContext.Provider>
    );
}

export function useWorkspaces() {
    const ctx = useContext(WorkspacesContext);
    if (!ctx) throw new Error("useWorkspaces must be used within a WorkspacesProvider");
    return ctx;
}
