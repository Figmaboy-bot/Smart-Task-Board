import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeamActivity from "../../components/TeamActivity/TeamActivity";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Dashboard.css';
import { Greetings } from "../../components/Greetings/Greetings";
import { StatsDashboard } from "../../components/StatsBoard/Statsboard";
import { UpcomingDeadlines } from "../../components/UpcomingDeadlines/UpcomingDealines";
import DashboardSearchResults from "../../components/DashboardSearchResults/DashboardSearchResults";
import TaskModal from "../../components/TaskModal/TaskModal";
import TaskDetailModal from "../../components/TaskDetailModal/TaskDetailModal";
import ProjectDetailModal from "../../components/ProjectDetailModal/ProjectDetailModal";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useTeamMembers } from "../../hooks/useTeamMembers";

const MAX_RESULTS_PER_GROUP = 6;

function Dashboard() {
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask, updateTaskStatus } = useTasks();
  const { projects, deleteProject } = useProjects();
  const { teamMembers } = useTeamMembers();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const openEditModal = (task) => { setEditingTask(task); setSelectedTask(null); setShowTaskModal(true); };

  const query = search.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!query) return null;

    const matchedTasks = tasks
      .filter((t) => `${t.title || ""} ${t.desc || ""} ${t.project || ""} ${t.tag || ""}`.toLowerCase().includes(query))
      .slice(0, MAX_RESULTS_PER_GROUP);

    const matchedProjects = projects
      .filter((p) => `${p.name || ""} ${p.description || ""}`.toLowerCase().includes(query))
      .slice(0, MAX_RESULTS_PER_GROUP);

    const matchedMembers = teamMembers
      .filter((m) => `${m.name || ""} ${m.email || ""} ${m.role || ""}`.toLowerCase().includes(query))
      .slice(0, MAX_RESULTS_PER_GROUP);

    return { tasks: matchedTasks, projects: matchedProjects, members: matchedMembers };
  }, [query, tasks, projects, teamMembers]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header searchValue={search} onSearchChange={setSearch} />
        {searchResults ? (
          <DashboardSearchResults
            query={search.trim()}
            results={searchResults}
            onSelectTask={setSelectedTask}
            onSelectProject={setSelectedProject}
            onSelectMember={() => navigate("/teams")}
          />
        ) : (
          <>
            <Greetings projects={projects} teamMembers={teamMembers} createTask={createTask} />
            <StatsDashboard tasks={tasks} />
            <div className="upcoming-deadline-container">
              <UpcomingDeadlines tasks={tasks} />
            </div>
            <TeamActivity
              tasks={tasks}
              loading={tasksLoading}
              projects={projects}
              teamMembers={teamMembers}
              createTask={createTask}
              updateTaskStatus={updateTaskStatus}
            />
          </>
        )}
      </div>

      <TaskModal
        key={editingTask?.id ?? "create"}
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projects={projects}
        teamMembers={teamMembers}
        initialTask={editingTask}
        onSubmit={(task) => {
          const matchedProject = projects.find((p) => p.name === task.project);
          const payload = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            assignee: task.assignee,
            tag: task.tag,
            dueDate: task.dueDate,
            status: task.status,
            links: task.links,
            project_id: matchedProject?.id || null,
            project: matchedProject?.name || task.project || "",
          };
          if (editingTask) {
            updateTask(editingTask.id, payload);
          } else {
            createTask(payload);
          }
          setShowTaskModal(false);
        }}
      />

      <TaskDetailModal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onEdit={openEditModal}
        onDelete={(task) => { deleteTask(task.id); setSelectedTask(null); }}
      />

      <ProjectDetailModal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        onDelete={(project) => { deleteProject(project.id); setSelectedProject(null); }}
      />
    </div>
  );
}

export default Dashboard
