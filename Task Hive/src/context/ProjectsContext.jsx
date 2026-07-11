import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";
import { useTasks } from "./TasksContext";
import { useTeamMembers } from "./TeamMembersContext";
import { useWorkspaces } from "./WorkspacesContext";

// Demo content shown in guest mode (never touches Supabase), ported from the
// hardcoded seed data (src/data/projectsData.js) used before real persistence existed.
const GUEST_PROJECT_ROWS = [
    { id: "guest-project-1", name: "Website Redesign", description: "Revamp the company website for a modern look and better UX.", due_date: null, due: "Mar 24" },
    { id: "guest-project-2", name: "Mobile App Launch", description: "Prepare and launch the new mobile application.", due_date: null, due: "Apr 10" },
    { id: "guest-project-3", name: "Q2 Marketing Campaign", description: "Plan and execute the Q2 marketing campaign for new products.", due_date: null, due: "May 2" },
    { id: "guest-project-4", name: "Customer Portal Upgrade", description: "Enhance the customer portal with new features and improved security.", due_date: null, due: "Feb 15" },
    { id: "guest-project-5", name: "Cloud Migration", description: "Migrate infrastructure to the cloud for better scalability.", due_date: null, due: "Apr 20" },
];

function formatDisplayDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(`${isoDate}T00:00:00`);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const ProjectsContext = createContext(null);

// Single shared instance so every page reads and mutates the same live
// project list, instead of each mounting its own disconnected copy.
export function ProjectsProvider({ children }) {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { activeWorkspaceId } = useWorkspaces();
    const { tasks } = useTasks();
    const { teamMembers } = useTeamMembers();
    const [projects, setProjects] = useState(() => (isGuest ? GUEST_PROJECT_ROWS : []));
    const [loading, setLoading] = useState(!isGuest);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        supabase
            .from("projects")
            .select("*")
            .eq("workspace_id", activeWorkspaceId)
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load projects:", error);
                    setProjects([]);
                } else {
                    setProjects(data);
                }
                setLoading(false);
            });

        return () => { cancelled = true };
    }, [user, isGuest, activeWorkspaceId]);

    const createProject = useCallback(async ({ title, description, dueDate }) => {
        if (isGuest) {
            const localProject = {
                id: `guest-project-${Date.now()}`,
                name: title,
                description: description || "",
                due_date: dueDate || null,
            };
            setProjects((prev) => [...prev, localProject]);
            return localProject;
        }

        const { data, error } = await supabase
            .from("projects")
            .insert({
                workspace_id: activeWorkspaceId,
                name: title,
                description: description || "",
                due_date: dueDate || null,
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        setProjects((prev) => [...prev, data]);
        return data;
    }, [user, isGuest, activeWorkspaceId]);

    const projectsWithStats = useMemo(() => {
        const avatarByName = new Map(teamMembers.map((m) => [m.name, m.avatar_url]));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return projects.map((p) => {
            const projectTasks = tasks.filter((t) => t.project === p.name);
            const totalTasks = projectTasks.length;
            const doneTasks = projectTasks.filter((t) => t.columnTitle === "DONE").length;
            const overdueTasks = projectTasks.filter((t) => {
                if (t.columnTitle === "DONE" || !t.date) return false;
                const d = new Date(`${t.date}, ${today.getFullYear()}`);
                return !isNaN(d.getTime()) && d < today;
            }).length;

            const team = [...new Set(projectTasks.map((t) => t.user.name))]
                .map((name) => avatarByName.get(name) || "/Profile.jpg");

            return {
                id: p.id,
                name: p.name,
                description: p.description || "",
                due: p.due || formatDisplayDate(p.due_date),
                progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
                totalTasks,
                overdueTasks,
                team,
            };
        });
    }, [projects, tasks, teamMembers]);

    return (
        <ProjectsContext.Provider value={{ projects: projectsWithStats, loading, createProject }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const ctx = useContext(ProjectsContext);
    if (!ctx) throw new Error("useProjects must be used within a ProjectsProvider");
    return ctx;
}
