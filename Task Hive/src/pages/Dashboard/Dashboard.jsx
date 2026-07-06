import TeamActivity from "../../components/TeamActivity/TeamActivity";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import './Dashboard.css';
import { Greetings } from "../../components/Greetings/Greetings";
import { StatsDashboard } from "../../components/StatsBoard/Statsboard";
import { UpcomingDeadlines } from "../../components/UpcomingDeadlines/UpcomingDealines";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useTeamMembers } from "../../hooks/useTeamMembers";

function Dashboard() {
  const { tasks, loading: tasksLoading, createTask, updateTaskStatus } = useTasks();
  const { projects } = useProjects();
  const { teamMembers } = useTeamMembers();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <Greetings />
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
      </div>
    </div>
  );
}

export default Dashboard
