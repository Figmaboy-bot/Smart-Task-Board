import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useTeamMembers() {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isGuest) return;

        let cancelled = false;
        // Kicking off a fetch is a deliberate direct setState, not a sync loop.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        supabase
            .from("team_members")
            .select("*")
            .order("created_at", { ascending: true })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load team members:", error);
                    setTeamMembers([]);
                } else {
                    setTeamMembers(data);
                }
                setLoading(false);
            });

        return () => { cancelled = true };
    }, [user, isGuest]);

    const createTeamMember = useCallback(async ({ member, email, role, status, img }) => {
        if (isGuest) return null;

        const { data, error } = await supabase
            .from("team_members")
            .insert({
                name: member,
                email,
                role: role || "Member",
                status: status || "Invited",
                avatar_url: img || null,
            })
            .select()
            .single();

        if (error) throw error;
        setTeamMembers((prev) => [...prev, data]);
        return data;
    }, [isGuest]);

    return {
        teamMembers: isGuest ? [] : teamMembers,
        loading: isGuest ? false : loading,
        createTeamMember,
    };
}
