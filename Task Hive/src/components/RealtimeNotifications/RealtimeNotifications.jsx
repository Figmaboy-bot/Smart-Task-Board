import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspacesContext";
import { usePreferences } from "../../context/PreferencesContext";
import { useTasks } from "../../hooks/useTasks";
import { useNotifications } from "../../hooks/useNotifications";
import { useToast } from "../../context/ToastContext";

const DUE_DATE_RECHECK_MS = 60_000;

// Mounted once near the app root (inside every data provider it needs, but
// renders nothing itself) so toast popups fire regardless of which page is
// currently open, not just while viewing Messages or the notification bell.
export default function RealtimeNotifications() {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { activeWorkspaceId } = useWorkspaces();
    const { preferences } = usePreferences();
    const { tasks } = useTasks();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const inAppEnabled = preferences.delivery_in_app;

    // New messages in the team channel
    useEffect(() => {
        if (isGuest || !activeWorkspaceId || !inAppEnabled) return;

        const channel = supabase
            .channel(`toast-messages-${activeWorkspaceId}`)
            .on("postgres_changes", {
                event: "INSERT", schema: "public", table: "messages",
                filter: `workspace_id=eq.${activeWorkspaceId}`,
            }, (payload) => {
                const msg = payload.new;
                if (msg.sender_id === user.id) return;
                showToast({
                    type: "info",
                    title: msg.sender_name,
                    message: msg.body,
                    onClick: () => navigate("/messages"),
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isGuest, activeWorkspaceId, user, inAppEnabled, showToast, navigate]);

    // A task gets (re)assigned to "Me"
    useEffect(() => {
        if (isGuest || !activeWorkspaceId || !inAppEnabled || !preferences.notify_assigned) return;

        const channel = supabase
            .channel(`toast-tasks-${activeWorkspaceId}`)
            .on("postgres_changes", {
                event: "*", schema: "public", table: "tasks",
                filter: `workspace_id=eq.${activeWorkspaceId}`,
            }, (payload) => {
                if (payload.eventType === "DELETE") return;
                const row = payload.new;
                if (row.assignee_name !== "Me") return;
                if (payload.eventType === "UPDATE" && payload.old?.assignee_name === "Me") return;
                showToast({
                    type: "info",
                    title: "New task assigned",
                    message: row.title,
                    onClick: () => navigate("/my-tasks"),
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isGuest, activeWorkspaceId, inAppEnabled, preferences.notify_assigned, showToast, navigate]);

    // Due-date reminders: nothing changes in the database when a deadline
    // arrives, so this is rechecked on a timer instead of a subscription.
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), DUE_DATE_RECHECK_MS);
        return () => clearInterval(interval);
    }, []);

    const dueNotifications = useNotifications(tasks, preferences, tick);
    const seenRef = useRef(new Set());
    const seededRef = useRef(false);

    useEffect(() => {
        if (isGuest || !inAppEnabled) return;

        // Seed on first run so everything already overdue when the app
        // opens doesn't all toast at once; only newly-crossed thresholds do.
        if (!seededRef.current) {
            dueNotifications.forEach((n) => seenRef.current.add(n.id + n.title));
            seededRef.current = true;
            return;
        }

        dueNotifications.forEach((n) => {
            const key = n.id + n.title;
            if (seenRef.current.has(key)) return;
            seenRef.current.add(key);
            showToast({
                type: n.type,
                title: n.title,
                message: n.desc,
                onClick: () => navigate("/my-tasks"),
            });
        });
    }, [dueNotifications, isGuest, inAppEnabled, showToast, navigate]);

    return null;
}
