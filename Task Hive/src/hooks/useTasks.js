import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

// Kanban column titles as rendered <-> the `tasks.status` DB enum.
export const STATUS_TO_COLUMN = { "To-Do": "TO-DO", "In Progress": "IN PROGRESS", "Done": "DONE" };
export const COLUMN_TO_STATUS = { "TO-DO": "To-Do", "IN PROGRESS": "In Progress", "DONE": "Done" };

const PRIORITY_COLOR = { High: "#ef4444", Medium: "#fbbc05", Low: "#22c55e" };
const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };

// Demo content shown in guest mode (never touches Supabase), ported from the
// hardcoded seed data MyTasks/AllTasks used before real persistence existed.
const GUEST_TASKS = [
    { id: "guest-task-1", project_id: null, project: "Mobile App Launch", tag: "Frontend", status: "Medium", statusColor: "#fbbc05", title: "Implement login UI", desc: "Create a responsive login form for the app.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 10", due_date: "2026-01-10", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-2", project_id: null, project: "Mobile App Launch", tag: "Frontend", status: "Low", statusColor: "#22c55e", title: "Design Dashboard", desc: "Create a responsive login form for the app.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 19", due_date: "2026-01-19", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-3", project_id: null, project: "Mobile App Launch", tag: "Frontend", status: "High", statusColor: "#ef4444", title: "Build Settings Page", desc: "Create a responsive login form for the app.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 25", due_date: "2026-01-25", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-4", project_id: null, project: "Mobile App Launch", tag: "Backend", status: "Medium", statusColor: "#fbbc05", title: "Implement login UI", desc: "Create a responsive login form for the app.", user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }, date: "Jan 10", due_date: "2026-01-10", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-5", project_id: null, project: "Cloud Migration", tag: "API", status: "Medium", statusColor: "#fbbc05", title: "Implement login UI", desc: "Create a responsive login form for the app.", user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }, date: "Jan 10", due_date: "2026-01-10", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-6", project_id: null, project: "Customer Portal Upgrade", tag: "Frontend", status: "High", statusColor: "#ef4444", title: "Implement login UI", desc: "Create a responsive login form for the app.", user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }, date: "Jan 10", due_date: "2026-01-10", links: 1, rawLinks: ["https://example.com/design-spec"], columnTitle: "TO-DO" },
    { id: "guest-task-7", project_id: null, project: "Cloud Migration", tag: "API", status: "Medium", statusColor: "#fbbc05", title: "Integrate Auth API", desc: "Connect frontend login to backend authentication API.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 11", due_date: "2026-01-11", links: 2, rawLinks: ["https://example.com/api-docs", "https://example.com/auth-flow"], columnTitle: "IN PROGRESS" },
    { id: "guest-task-8", project_id: null, project: "Cloud Migration", tag: "API", status: "High", statusColor: "#ef4444", title: "Setup Database", desc: "Connect frontend login to backend authentication API.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 19", due_date: "2026-01-19", links: 2, rawLinks: ["https://example.com/api-docs", "https://example.com/auth-flow"], columnTitle: "IN PROGRESS" },
    { id: "guest-task-9", project_id: null, project: "Customer Portal Upgrade", tag: "API", status: "Low", statusColor: "#22c55e", title: "Create User Endpoints", desc: "Connect frontend login to backend authentication API.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Feb 1", due_date: "2026-02-01", links: 2, rawLinks: ["https://example.com/api-docs", "https://example.com/auth-flow"], columnTitle: "IN PROGRESS" },
    { id: "guest-task-10", project_id: null, project: "Mobile App Launch", tag: "API", status: "Medium", statusColor: "#fbbc05", title: "Integrate Auth API", desc: "Connect frontend login to backend authentication API.", user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" }, date: "Jan 11", due_date: "2026-01-11", links: 2, rawLinks: ["https://example.com/api-docs", "https://example.com/auth-flow"], columnTitle: "IN PROGRESS" },
    { id: "guest-task-11", project_id: null, project: "Cloud Migration", tag: "Frontend", status: "Low", statusColor: "#22c55e", title: "Integrate Auth API", desc: "Connect frontend login to backend authentication API.", user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" }, date: "Jan 11", due_date: "2026-01-11", links: 2, rawLinks: ["https://example.com/api-docs", "https://example.com/auth-flow"], columnTitle: "IN PROGRESS" },
    { id: "guest-task-12", project_id: null, project: "Onboarding Guide", tag: "Docs", status: "Low", statusColor: "#22c55e", title: "Write onboarding guide", desc: "Document onboarding steps for new users.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
    { id: "guest-task-13", project_id: null, project: "Onboarding Guide", tag: "Docs", status: "Medium", statusColor: "#fbbc05", title: "API Documentation", desc: "Document onboarding steps for new users.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
    { id: "guest-task-14", project_id: null, project: "Onboarding Guide", tag: "Docs", status: "High", statusColor: "#ef4444", title: "Setup Instructions", desc: "Document onboarding steps for new users.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
    { id: "guest-task-15", project_id: null, project: "Onboarding Guide", tag: "Docs", status: "High", statusColor: "#ef4444", title: "Write onboarding guide", desc: "Document onboarding steps for new users.", user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
    { id: "guest-task-16", project_id: null, project: "Mobile App Launch", tag: "Backend", status: "Low", statusColor: "#22c55e", title: "Write onboarding guide", desc: "Document onboarding steps for new users.", user: { name: "Me", avatar: "/Profile.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
    { id: "guest-task-17", project_id: null, project: "Cloud Migration", tag: "API", status: "Low", statusColor: "#22c55e", title: "Write onboarding guide", desc: "Document onboarding steps for new users.", user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }, date: "Jan 9", due_date: "2026-01-09", links: 0, rawLinks: [], columnTitle: "DONE" },
];

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
        due_date: row.due_date || null,
        links: Array.isArray(row.links) ? row.links.length : 0,
        rawLinks: Array.isArray(row.links) ? row.links : [],
        columnTitle: STATUS_TO_COLUMN[row.status] || "TO-DO",
    };
}

function buildLocalTask(input, id) {
    const priorityLabel = PRIORITY_LABEL[(input.priority || "medium").toLowerCase()] || "Medium";
    const rawLinks = Array.isArray(input.links) ? input.links : [];
    return {
        id,
        project_id: input.project_id || null,
        project: input.project || "",
        tag: input.tag || "General",
        status: priorityLabel,
        statusColor: PRIORITY_COLOR[priorityLabel],
        title: input.title || "",
        desc: input.description || "",
        user: { name: input.assignee || "Me", avatar: "/Profile.jpg" },
        date: formatDisplayDate(input.dueDate),
        due_date: input.dueDate || null,
        links: rawLinks.length,
        rawLinks,
        columnTitle: STATUS_TO_COLUMN[input.status] || "TO-DO",
    };
}

export function useTasks() {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const [tasks, setTasks] = useState(() => (isGuest ? GUEST_TASKS : []));
    const [loading, setLoading] = useState(!isGuest);

    useEffect(() => {
        if (isGuest) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
    }, [user, isGuest]);

    const createTask = useCallback(async (input) => {
        if (isGuest) {
            const localTask = buildLocalTask(input, `guest-task-${Date.now()}`);
            setTasks((prev) => [...prev, localTask]);
            return localTask;
        }

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
    }, [user, isGuest]);

    const updateTask = useCallback(async (taskId, input) => {
        if (isGuest) {
            const updated = buildLocalTask(input, taskId);
            setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
            return updated;
        }

        const { data, error } = await supabase
            .from("tasks")
            .update({
                project_id: input.project_id || null,
                title: input.title,
                description: input.description || "",
                status: input.status || "To-Do",
                priority: PRIORITY_LABEL[(input.priority || "medium").toLowerCase()] || "Medium",
                tag: input.tag || "General",
                assignee_name: input.assignee || "Me",
                due_date: input.dueDate || null,
                links: input.links || [],
                updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)
            .select("*, projects(name)")
            .single();

        if (error) throw error;
        const mapped = mapRowToTask(data);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? mapped : t)));
        return mapped;
    }, [isGuest]);

    const updateTaskStatus = useCallback(async (taskId, columnTitle) => {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, columnTitle } : t)));

        if (isGuest) return;

        const { error } = await supabase
            .from("tasks")
            .update({ status: COLUMN_TO_STATUS[columnTitle] || columnTitle, updated_at: new Date().toISOString() })
            .eq("id", taskId);

        if (error) console.error("Failed to update task status:", error);
    }, [isGuest]);

    return { tasks, loading, createTask, updateTask, updateTaskStatus };
}
