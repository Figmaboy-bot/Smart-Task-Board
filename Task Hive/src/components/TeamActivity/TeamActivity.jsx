import React from "react";
import "./TeamActivity.css";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import LinkIcon from "@heroicons/react/24/outline/LinkIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { EllipsisVerticalIcon,ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline";

const columns = [
	{
		title: "TO-DO",
		icon: ClipboardDocumentCheckIcon,
		color: "#2563eb",
		tasks: [
			{
				tag: "API",
				status: "Medium",
				statusColor: "#fbbc05",
				title: "Fix API Authentication Bug",
				desc: "The Login System Is Experiencing Authentication Issues, Preventing Some Users From Accessing Their Accounts.",
				user: { name: "Linda", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
				date: "Mar 31",
				links: 2,
			},
			{
				tag: "API",
				status: "Medium",
				statusColor: "#fbbc05",
				title: "Fix API Authentication Bug",
				desc: "He Login System Is Experiencing Authentication Issues, Preventing Some Users From Accessing Their Accounts.",
				user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
				date: "Mar 31",
				links: 2,
			},
		],
	},
	{
		title: "IN PROGRESS",
		icon: ClockIcon,
		color: "#f59e42",
		tasks: [
			{
				tag: "API",
				status: "High",
				statusColor: "#ef4444",
				title: "Design Homepage UI",
				desc: "Develop A Visually Appealing And User-Friendly Homepage Layout That Aligns With The Brand's Identity.",
				user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
				date: "Mar 31",
				links: 2,
			},
			{
				tag: "API",
				status: "High",
				statusColor: "#ef4444",
				title: "Fix API Authentication Bug",
				desc: "He Login System Is Experiencing Authentication Issues, Preventing Some Users From Accessing Their Accounts.",
				user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
				date: "Mar 31",
				links: 2,
			},
		],
	},
	{
		title: "DONE",
		icon: CheckBadgeIcon,
		color: "#22c55e",
		tasks: [
			{
				tag: "API",
				status: "Low",
				statusColor: "#22c55e",
				title: "Prepare Q2 Report",
				desc: "Gather Key Performance Metrics And Compile Insights Into A Well-Structured Q2 Report.",
				user: { name: "Mathew", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
				date: "Mar 31",
				links: 2,
			},
			{
				tag: "API",
				status: "Low",
				statusColor: "#22c55e",
				title: "Fix API Authentication Bug",
				desc: "He Login System Is Experiencing Authentication Issues, Preventing Some Users From Accessing Their Accounts.",
				user: { name: "Jake", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
				date: "Mar 31",
				links: 2,
			},
		],
	},
];


export function TeamActivity() {
	const [view, setView] = React.useState("kanban");
	return (
		<div className="team-activity-container">
			<div className="team-activity-header">
				<h2>Team Activity</h2>
				<div className="view-switcher">
					<button
						className={view === "kanban" ? "active" : ""}
						onClick={() => setView("kanban")}
						aria-pressed={view === "kanban"}
					>
                        <ViewColumnsIcon className="view-icon" />
						Kanban
					</button>
					<button
						className={view === "list" ? "active" : ""}
						onClick={() => setView("list")}
						aria-pressed={view === "list"}
					>
                        <TableCellsIcon className="view-icon" />
						List
					</button>
				</div>
			</div>
			<div className="team-activity-board">
				{view === "kanban" ? (
					columns.map((col, i) => (
						<div className="activity-column" key={col.title}>
							<div className="column-header">
								<div className="column-title-icon">
									<span className="column-icon" style={{ color: col.color }}>
										{col.icon && React.createElement(col.icon, { style: { width: 22, height: 22 } })}
									</span>
									<span className="column-title">{col.title}</span>
								</div>
								<div className="column-header-buttons">
									<button className="column-add"><PlusCircleIcon className="plusicon" /></button>
									<button className="column-add"><EllipsisVerticalIcon className="plusicon" /></button>
								</div>
							</div>
							{col.tasks.map((task, j) => (
								<div className="activity-task-card" key={j}>
									<div className="task-card-top">
										<div className="task-tags-row">
											<span className="task-tag">{task.tag}</span>
											<div className="statusanddot">
												<span className="task-status-dot" style={{ background: task.statusColor }}></span>
												<span className="task-status-label">{task.status}</span>
											</div>
										</div>
										<div>
											<div className="task-name">{task.title}</div>
											<div className="task-description">{task.desc}</div>
										</div>
									</div>
									<div className="task-footer-row">
										<div className="task-footer-user">
											<img src={task.user.avatar} alt={task.user.name} className="task-user-avatar" />
											<span className="task-user-name">{task.user.name}</span>
										</div>
										<div className="task-footer-date">
											<CalendarIcon className="task-footer-icon" />
											<span className="task-user-name">{task.date}</span>
										</div>
										<div className="task-footer-links">
											<LinkIcon className="task-footer-icon" />
											<span className="task-user-name">{task.links}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					))
				) : (
					<div className="activity-list-view">
						<table className="activity-table">
							<thead className="thead">
								<tr className="Tableheader">
									<th className="Task">Task</th>
									<th className="Status">Status</th>
									<th className="Description">Description</th>
									<th className="Assigned">Assigned</th>
									<th className="Date">Date</th>
									<th className="Links">Links</th>
									<th className="Action">Action</th>
								</tr>
							</thead>
							<tbody className="tbody">
								{columns.flatMap((col) =>
									col.tasks.map((task, j) => (
										<tr key={col.title + j}>
											<td className="table-title">{task.title}</td>
											<td>
												<span className="task-status-dot" style={{ background: task.statusColor, display: 'inline-block', marginRight: 6 }}></span>
												{task.status}
											</td>
											<td className="table-desc">{task.desc}</td>
											<td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
												<img src={task.user.avatar} alt={task.user.name} className="task-user-avatar" style={{ width: 22, height: 22 }} />
												{task.user.name}
											</td>
											<td>
												<CalendarIcon className="task-footer-icon" style={{ width: 18, height: 18, marginRight: 4 }} />
												{task.date}
											</td>
											<td>
												<LinkIcon className="task-footer-icon" style={{ width: 18, height: 18, marginRight: 4 }} />
												{task.links}
											</td>
											<td>{col.title}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

export default TeamActivity;
