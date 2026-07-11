import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { WorkspacesProvider } from "./context/WorkspacesContext";
import { TeamMembersProvider } from "./context/TeamMembersContext";
import { TasksProvider } from "./context/TasksContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <ThemeProvider>
            <WorkspacesProvider>
              <TeamMembersProvider>
                <TasksProvider>
                  <ProjectsProvider>
                    <App />
                  </ProjectsProvider>
                </TasksProvider>
              </TeamMembersProvider>
            </WorkspacesProvider>
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
