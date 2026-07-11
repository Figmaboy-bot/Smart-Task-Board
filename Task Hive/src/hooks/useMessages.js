import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useWorkspaces } from "../context/WorkspacesContext";

// Demo content shown in guest mode (never touches Supabase). Guest sessions
// are solo and local-only, so this just gives new visitors something to see
// rather than a blank channel.
const GUEST_MESSAGES = [
    { id: "guest-message-1", sender_id: "system", sender_name: "Task Hive", body: "Welcome to the team channel! Messages you send here are local to this guest session.", created_at: "2026-01-01T09:00:00.000Z" },
];

function senderNameFromEmail(email) {
    if (!email) return "Someone";
    return email.split("@")[0];
}

export function useMessages() {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const { activeWorkspaceId } = useWorkspaces();
    const [messages, setMessages] = useState(() => (isGuest ? GUEST_MESSAGES : []));
    const [loading, setLoading] = useState(!isGuest);

    useEffect(() => {
        if (isGuest || !activeWorkspaceId) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        supabase
            .from("messages")
            .select("*")
            .eq("workspace_id", activeWorkspaceId)
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load messages:", error);
                    setMessages([]);
                } else {
                    setMessages(data);
                }
                setLoading(false);
            });

        const channel = supabase
            .channel(`messages-channel-${activeWorkspaceId}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `workspace_id=eq.${activeWorkspaceId}`,
            }, (payload) => {
                setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
            })
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [user, isGuest, activeWorkspaceId]);

    const sendMessage = useCallback(async (body) => {
        const trimmed = body.trim();
        if (!trimmed) return null;

        if (isGuest) {
            const localMessage = {
                id: `guest-message-${Date.now()}`,
                sender_id: "guest",
                sender_name: "You",
                body: trimmed,
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, localMessage]);
            return localMessage;
        }

        const { data, error } = await supabase
            .from("messages")
            .insert({
                workspace_id: activeWorkspaceId,
                sender_id: user.id,
                sender_name: senderNameFromEmail(user.email),
                body: trimmed,
            })
            .select()
            .single();

        if (error) throw error;
        // The realtime subscription will also deliver this INSERT; de-dupe
        // there by id rather than appending it twice.
        setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
        return data;
    }, [user, isGuest, activeWorkspaceId]);

    return { messages, loading, sendMessage, currentUserId: user?.id || "guest" };
}
