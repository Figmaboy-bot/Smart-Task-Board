import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "./useTasks";
import { useTeamMembers } from "./useTeamMembers";

function formatDisplayDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(`${isoDate}T00:00:00`);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function useProjects() {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { tasks } = useTasks();
    const { teamMembers } = useTeamMembers();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isGuest) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        supabase
            .from("projects")
            .select("*")
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
    }, [user, isGuest]);

    const createProject = useCallback(async ({ title, description, dueDate }) => {
        if (isGuest) return null;

        const { data, error } = await supabase
            .from("projects")
            .insert({
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
    }, [user, isGuest]);

    const projectsWithStats = useMemo(() => {
        const avatarByName = new Map(teamMembers.map((m) => [m.name, m.avatar_url]));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return projects.map((p) => {
            const projectTasks = tasks.filter((t) => t.project_id === p.id);
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
                due: formatDisplayDate(p.due_date),
                progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
                totalTasks,
                overdueTasks,
                team,
            };
        });
    }, [projects, tasks, teamMembers]);

    return {
        projects: isGuest ? [] : projectsWithStats,
        loading: isGuest ? false : loading,
        createProject,
    };
}
