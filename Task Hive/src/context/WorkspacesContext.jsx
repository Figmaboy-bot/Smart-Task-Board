import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

function storageKey(userId) {
    return userId ? `activeWorkspaceId:${userId}` : null;
}

function defaultNameFor(email) {
    const prefix = (email || "My").split("@")[0];
    return `${prefix}'s Workspace`;
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
    const provisioning = useRef(false);

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
            const { data, error } = await supabase
                .from("workspace_members")
                .select("role, workspaces(id, name, created_by)")
                .eq("user_id", user.id);

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

            // A signed-up user with no workspace yet (first login, or an
            // account that somehow lost membership) gets a personal
            // workspace provisioned automatically so the app is never stuck
            // with nothing to show.
            if (rows.length === 0 && !provisioning.current) {
                provisioning.current = true;
                try {
                    const name = defaultNameFor(user.email);
                    const { data: workspace, error: wsError } = await supabase
                        .from("workspaces")
                        .insert({ name, created_by: user.id })
                        .select()
                        .single();
                    if (wsError) throw wsError;

                    const { error: memberError } = await supabase
                        .from("workspace_members")
                        .insert({ workspace_id: workspace.id, user_id: user.id, role: "Owner" });
                    if (memberError) throw memberError;

                    await supabase.from("team_members").insert({
                        workspace_id: workspace.id,
                        name: defaultNameFor(user.email).replace("'s Workspace", ""),
                        email: user.email,
                        role: "Owner",
                        status: "Active",
                    });

                    rows = [{ id: workspace.id, name: workspace.name, role: "Owner" }];
                } catch (provisionError) {
                    console.error("Failed to provision a default workspace:", provisionError);
                } finally {
                    provisioning.current = false;
                }
            }

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

    const createWorkspace = useCallback(async (name) => {
        const trimmed = name.trim();
        if (!trimmed) return null;

        const { data: workspace, error } = await supabase
            .from("workspaces")
            .insert({ name: trimmed, created_by: user.id })
            .select()
            .single();
        if (error) throw error;

        const { error: memberError } = await supabase
            .from("workspace_members")
            .insert({ workspace_id: workspace.id, user_id: user.id, role: "Owner" });
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

    const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || null;

    return (
        <WorkspacesContext.Provider value={{
            workspaces,
            activeWorkspaceId,
            activeWorkspace,
            loading,
            setActiveWorkspaceId,
            createWorkspace,
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
