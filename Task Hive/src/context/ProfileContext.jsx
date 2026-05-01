import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profilePic, setProfilePic] = useState(
        () => localStorage.getItem("profilePic") || "/Profile.jpg"
    );

    const updateProfilePic = (dataUrl) => {
        setProfilePic(dataUrl);
        localStorage.setItem("profilePic", dataUrl);
    };

    return (
        <ProfileContext.Provider value={{ profilePic, updateProfilePic }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfile = () => useContext(ProfileContext);
