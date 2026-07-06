import { useCallback, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useTeamMembers() {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(!user?.isGuest);

    useEffect(() => {
        if (!user || user.isGuest) {
            setTeamMembers([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
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
    }, [user]);

    const createTeamMember = useCallback(async ({ member, email, role, status, img }) => {
        if (!user || user.isGuest) return null;

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
    }, [user]);

    return { teamMembers, loading, createTeamMember };
}
