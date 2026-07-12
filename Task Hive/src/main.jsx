import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { ToastProvider } from "./context/ToastContext";
import { WorkspacesProvider } from "./context/WorkspacesContext";
import { TeamMembersProvider } from "./context/TeamMembersContext";
import { TasksProvider } from "./context/TasksContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import ToastContainer from "./components/Toast/ToastContainer";
import RealtimeNotifications from "./components/RealtimeNotifications/RealtimeNotifications";
import { BrowserRouter } from "react-router-dom";

// No React.StrictMode: its intentional double-invocation of effects in dev
// collides with supabase-js's navigator-lock-based auth token handling
// (onAuthStateChange's subscription setup acquires the lock, and the
// abandoned first invocation orphans it), which can wedge every Supabase
// call in the app for several seconds while it self-recovers. StrictMode is
// already a no-op in production builds, so this only affects local dev.
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ProfileProvider>
        <PreferencesProvider>
          <ThemeProvider>
            <ToastProvider>
              <WorkspacesProvider>
                <TeamMembersProvider>
                  <TasksProvider>
                    <ProjectsProvider>
                      <ToastContainer />
                      <RealtimeNotifications />
                      <App />
                    </ProjectsProvider>
                  </TasksProvider>
                </TeamMembersProvider>
              </WorkspacesProvider>
            </ToastProvider>
          </ThemeProvider>
        </PreferencesProvider>
      </ProfileProvider>
    </AuthProvider>
  </BrowserRouter>
);
