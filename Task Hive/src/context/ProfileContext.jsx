import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

const DEFAULT_PIC = "/Profile.jpg";

function storageKey(user) {
    return user ? `profilePic:${user.id}` : null;
}

export function ProfileProvider({ children }) {
    const { user } = useAuth();
    const isGuest = !user || user.isGuest;
    const key = storageKey(user);
    // Session-only cache of pics set via updateProfilePic, keyed by user id,
    // so switching users doesn't require re-reading localStorage in an effect.
    const [overrides, setOverrides] = useState({});
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (isGuest) {
            setProfile(null);
            return;
        }
        let cancelled = false;
        supabase
            .from("profiles")
            .select("first_name, last_name, role, avatar_url, onboarding_completed_at")
            .eq("id", user.id)
            .maybeSingle()
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) {
                    console.error("Failed to load profile:", error);
                    return;
                }
                setProfile(data);
            });
        return () => { cancelled = true };
    }, [isGuest, user?.id]);

    const profilePic = (key && (overrides[key] ?? localStorage.getItem(key))) || profile?.avatar_url || DEFAULT_PIC;

    const updateProfilePic = (dataUrl) => {
        if (!key) return;
        localStorage.setItem(key, dataUrl);
        setOverrides((prev) => ({ ...prev, [key]: dataUrl }));
    };

    const saveProfile = async (fields) => {
        const { data, error } = await supabase
            .from("profiles")
            .upsert({ id: user.id, ...fields, updated_at: new Date().toISOString() })
            .select("first_name, last_name, role, avatar_url, onboarding_completed_at")
            .single();
        if (error) throw error;
        setProfile(data);
        return data;
    };

    const uploadAvatar = async (file) => {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        // Cache-bust so the browser doesn't keep showing a stale image after re-uploading to the same path.
        const avatar_url = `${publicUrl}?t=${Date.now()}`;
        await saveProfile({ avatar_url });
        return avatar_url;
    };

    return (
        <ProfileContext.Provider value={{ profilePic, updateProfilePic, profile, saveProfile, uploadAvatar }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => useContext(ProfileContext);
