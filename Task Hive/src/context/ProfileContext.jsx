import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

const DEFAULT_PIC = "/Profile.jpg";

function storageKey(user) {
    return user ? `profilePic:${user.id}` : null;
}

export function ProfileProvider({ children }) {
    const { user } = useAuth();
    const key = storageKey(user);
    // Session-only cache of pics set via updateProfilePic, keyed by user id,
    // so switching users doesn't require re-reading localStorage in an effect.
    const [overrides, setOverrides] = useState({});

    const profilePic = (key && (overrides[key] ?? localStorage.getItem(key))) || DEFAULT_PIC;

    const updateProfilePic = (dataUrl) => {
        if (!key) return;
        localStorage.setItem(key, dataUrl);
        setOverrides((prev) => ({ ...prev, [key]: dataUrl }));
    };

    return (
        <ProfileContext.Provider value={{ profilePic, updateProfilePic }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => useContext(ProfileContext);
