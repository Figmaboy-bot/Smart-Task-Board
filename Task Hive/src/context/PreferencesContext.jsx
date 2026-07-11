import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

export const DEFAULT_PREFERENCES = {
    notify_assigned: true,
    notify_due_date: true,
    notify_task_completed: false,
    notify_mentions: true,
    notify_project_updates: false,
    notify_new_team_members: true,
    delivery_push: true,
    delivery_email: false,
    delivery_in_app: true,
    default_priority: "Medium",
    hide_completed_tasks: false,
    silence_non_urgent: false,
    block_reassignment_focus: false,
    timezone: "UTC",
    date_format: "MM/DD/YYYY",
    time_format: "24-hour",
    language: "English",
};

const PreferencesContext = createContext(null);

// Real per-user settings. Guest sessions never touch Supabase, so they get a
// local-only copy that resets each session, same as every other guest-mode
// fallback in this app.
export function PreferencesProvider({ children }) {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
    const [loading, setLoading] = useState(!isGuest);

    useEffect(() => {
        if (isGuest) {
            setPreferences(DEFAULT_PREFERENCES);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        (async () => {
            const { data, error } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle();

            if (cancelled) return;

            if (error) {
                console.error("Failed to load preferences:", error);
                setPreferences(DEFAULT_PREFERENCES);
                setLoading(false);
                return;
            }

            if (data) {
                setPreferences(data);
            } else {
                // First time this user has ever hit Settings: create their
                // row with the defaults so future updates have something to
                // upsert against.
                const { data: created, error: createError } = await supabase
                    .from("user_preferences")
                    .insert({ user_id: user.id })
                    .select()
                    .single();
                if (!cancelled) {
                    if (createError) {
                        console.error("Failed to create preferences row:", createError);
                        setPreferences(DEFAULT_PREFERENCES);
                    } else {
                        setPreferences(created);
                    }
                }
            }
            setLoading(false);
        })();

        return () => { cancelled = true };
    }, [user, isGuest]);

    const updatePreferences = useCallback(async (partial) => {
        setPreferences((prev) => ({ ...prev, ...partial }));

        if (isGuest) return;

        const { error } = await supabase
            .from("user_preferences")
            .update({ ...partial, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);

        if (error) {
            console.error("Failed to save preferences:", error);
            throw error;
        }
    }, [isGuest, user]);

    return (
        <PreferencesContext.Provider value={{ preferences, loading, updatePreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const ctx = useContext(PreferencesContext);
    if (!ctx) throw new Error("usePreferences must be used within a PreferencesProvider");
    return ctx;
}
