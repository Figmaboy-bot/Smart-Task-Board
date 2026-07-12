import {
    ClipboardDocumentListIcon,
    FolderIcon,
    UserGroupIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import "./DashboardSearchResults.css";

function ResultGroup({ title, icon: Icon, empty, children }) {
    return (
        <div className="search-results-group">
            <div className="search-results-group-header">
                {Icon && <Icon className="search-results-group-icon" />}
                <h3>{title}</h3>
            </div>
            {empty ? <p className="search-results-empty">No matches.</p> : children}
        </div>
    );
}

export default function DashboardSearchResults({ query, results, onSelectTask, onSelectProject, onSelectMember }) {
    const { tasks, projects, members } = results;
    const totalCount = tasks.length + projects.length + members.length;

    return (
        <div className="dashboard-search-results">
            <h2 className="search-results-heading">
                {totalCount > 0
                    ? `Results for "${query}"`
                    : `No results for "${query}"`}
            </h2>

            <ResultGroup title="Tasks" icon={ClipboardDocumentListIcon} empty={tasks.length === 0}>
                <div className="search-results-list">
                    {tasks.map((task) => (
                        <button key={task.id} className="search-result-item" onClick={() => onSelectTask(task)}>
                            <div className="search-result-main">
                                <span className="search-result-title">{task.title}</span>
                                <span className="search-result-meta">
                                    {task.project || "No Project"} • {task.user?.name || "Unassigned"}
                                </span>
                            </div>
                            <span className="search-result-badge" style={{ color: task.statusColor, backgroundColor: `${task.statusColor}1a` }}>
                                {task.status}
                            </span>
                        </button>
                    ))}
                </div>
            </ResultGroup>

            <ResultGroup title="Projects" icon={FolderIcon} empty={projects.length === 0}>
                <div className="search-results-list">
                    {projects.map((project) => (
                        <button key={project.id} className="search-result-item" onClick={() => onSelectProject(project)}>
                            <div className="search-result-main">
                                <span className="search-result-title">{project.name}</span>
                                <span className="search-result-meta">
                                    {project.totalTasks} task{project.totalTasks === 1 ? "" : "s"} • {project.progress}% complete
                                </span>
                            </div>
                            {project.due && (
                                <span className="search-result-badge neutral">
                                    <CalendarIcon className="search-result-badge-icon" />
                                    {project.due}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </ResultGroup>

            <ResultGroup title="Team Members" icon={UserGroupIcon} empty={members.length === 0}>
                <div className="search-results-list">
                    {members.map((member) => (
                        <button key={member.id} className="search-result-item" onClick={() => onSelectMember(member)}>
                            <img
                                src={member.avatar_url || "/Icons/default-profile.svg"}
                                alt={member.name}
                                className="search-result-avatar"
                            />
                            <div className="search-result-main">
                                <span className="search-result-title">{member.name}</span>
                                <span className="search-result-meta">{member.email}</span>
                            </div>
                            <span className="search-result-badge neutral">{member.role}</span>
                        </button>
                    ))}
                </div>
            </ResultGroup>
        </div>
    );
}
