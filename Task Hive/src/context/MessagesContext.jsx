import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";
import { useWorkspaces } from "./WorkspacesContext";

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

const MessagesContext = createContext(null);

// Single shared instance (and single realtime channel) so every consumer -
// the Messages page's live list and RealtimeNotifications' new-message
// toast - reads the same data instead of each opening its own duplicate
// `messages` INSERT subscription against the same workspace.
export function MessagesProvider({ children }) {
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

    // attachments is an array of the shape returned by uploadAttachment:
    // { url, name, type, size }.
    const sendMessage = useCallback(async (body, attachments) => {
        const trimmed = body.trim();
        const files = attachments?.length ? attachments : [];
        if (!trimmed && files.length === 0) return null;

        if (isGuest) {
            const localMessage = {
                id: `guest-message-${Date.now()}`,
                sender_id: "guest",
                sender_name: "You",
                body: trimmed,
                created_at: new Date().toISOString(),
                attachments: files,
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
                attachments: files,
            })
            .select()
            .single();

        if (error) throw error;
        // The realtime subscription will also deliver this INSERT; de-dupe
        // there by id rather than appending it twice.
        setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
        return data;
    }, [user, isGuest, activeWorkspaceId]);

    // Guest sessions never touch Supabase storage, so the file just gets a
    // local blob URL - good enough to preview/play within the session.
    const uploadAttachment = useCallback(async (file) => {
        if (isGuest) {
            return { url: URL.createObjectURL(file), name: file.name, type: file.type, size: file.size };
        }

        const path = `${activeWorkspaceId}/${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("message-attachments")
            .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("message-attachments").getPublicUrl(path);
        return { url: publicUrl, name: file.name, type: file.type, size: file.size };
    }, [isGuest, activeWorkspaceId]);

    return (
        <MessagesContext.Provider value={{ messages, loading, sendMessage, uploadAttachment, currentUserId: user?.id || "guest" }}>
            {children}
        </MessagesContext.Provider>
    );
}

export function useMessages() {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error("useMessages must be used within a MessagesProvider");
    return ctx;
}
