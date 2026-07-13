import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useWorkspaces } from "../../context/WorkspacesContext";
import { usePreferences } from "../../context/PreferencesContext";
import { useTasks } from "../../hooks/useTasks";
import { useMessages } from "../../hooks/useMessages";
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
    const { messages } = useMessages();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const inAppEnabled = preferences.delivery_in_app;

    // New messages in the team channel. Reads off the single shared
    // MessagesContext subscription (see src/context/MessagesContext.jsx)
    // instead of opening a second, duplicate `messages` INSERT channel for
    // the same workspace - this component and the Messages page both watch
    // the same list rather than each maintaining their own realtime channel.
    const seenMessageIdsRef = useRef(new Set());
    const messagesSeededRef = useRef(false);

    useEffect(() => {
        // Switching workspaces means the message list is for a different
        // channel entirely - reseed instead of toasting its whole history.
        messagesSeededRef.current = false;
        seenMessageIdsRef.current = new Set();
    }, [activeWorkspaceId]);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId || !inAppEnabled) return;

        if (!messagesSeededRef.current) {
            messages.forEach((msg) => seenMessageIdsRef.current.add(msg.id));
            messagesSeededRef.current = true;
            return;
        }

        messages.forEach((msg) => {
            if (seenMessageIdsRef.current.has(msg.id)) return;
            seenMessageIdsRef.current.add(msg.id);
            if (msg.sender_id === user.id) return;
            showToast({
                type: "info",
                title: msg.sender_name,
                message: msg.body,
                onClick: () => navigate("/messages"),
            });
        });
    }, [messages, isGuest, activeWorkspaceId, user, inAppEnabled, showToast, navigate]);

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
