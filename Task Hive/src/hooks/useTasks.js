import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

// Kanban column titles as rendered <-> the `tasks.status` DB enum.
export const STATUS_TO_COLUMN = { "To-Do": "TO-DO", "In Progress": "IN PROGRESS", "Done": "DONE" };
export const COLUMN_TO_STATUS = { "TO-DO": "To-Do", "IN PROGRESS": "In Progress", "DONE": "Done" };

const PRIORITY_COLOR = { High: "#ef4444", Medium: "#fbbc05", Low: "#22c55e" };
const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

function formatDisplayDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(`${isoDate}T00:00:00`);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function mapRowToTask(row) {
    return {
        id: row.id,
        project_id: row.project_id,
        project: row.projects?.name || "",
        tag: row.tag || "General",
        status: row.priority,
        statusColor: PRIORITY_COLOR[row.priority] || PRIORITY_COLOR.Medium,
        title: row.title,
        desc: row.description || "",
        user: { name: row.assignee_name || "Unassigned", avatar: "/Profile.jpg" },
        date: formatDisplayDate(row.due_date),
        links: Array.isArray(row.links) ? row.links.length : 0,
        columnTitle: STATUS_TO_COLUMN[row.status] || "TO-DO",
    };
}

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(!user?.isGuest);

    useEffect(() => {
        if (!user || user.isGuest) {
            setTasks([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        supabase
            .from("tasks")
            .select("*, projects(name)")
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load tasks:", error);
                    setTasks([]);
                } else {
                    setTasks(data.map(mapRowToTask));
                }
                setLoading(false);
            });

        return () => { cancelled = true };
    }, [user]);

    const createTask = useCallback(async (input) => {
        if (!user || user.isGuest) return null;

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                project_id: input.project_id || null,
                title: input.title,
                description: input.description || "",
                status: input.status || "To-Do",
                priority: PRIORITY_LABEL[(input.priority || "medium").toLowerCase()] || "Medium",
                tag: input.tag || "General",
                assignee_name: input.assignee || "Me",
                due_date: input.dueDate || null,
                links: input.links || [],
                created_by: user.id,
            })
            .select("*, projects(name)")
            .single();

        if (error) throw error;
        const mapped = mapRowToTask(data);
        setTasks((prev) => [...prev, mapped]);
        return mapped;
    }, [user]);

    const updateTaskStatus = useCallback(async (taskId, columnTitle) => {
        if (!user || user.isGuest) return;

        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, columnTitle } : t)));

        const { error } = await supabase
            .from("tasks")
            .update({ status: COLUMN_TO_STATUS[columnTitle] || columnTitle, updated_at: new Date().toISOString() })
            .eq("id", taskId);

        if (error) console.error("Failed to update task status:", error);
    }, [user]);

    return { tasks, loading, createTask, updateTaskStatus };
}
