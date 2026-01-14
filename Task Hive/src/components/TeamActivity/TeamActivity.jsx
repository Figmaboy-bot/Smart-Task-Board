import React from "react";
import "./TeamActivity.css";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import LinkIcon from "@heroicons/react/24/outline/LinkIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { EllipsisVerticalIcon,ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import EditableTable from "../EditableTable/EditableTable";
import ActivityTaskCard from "../ActivityTaskCard/ActivityTaskCard";
import TaskModal from "../TaskModal/TaskModal";

const kanbanColumns = [
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

	const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

	const [view, setView] = React.useState("kanban");
	// Flatten all tasks for the table view
	const tableData = kanbanColumns.flatMap((col) =>
		col.tasks.map((task, j) => ({
			...task,
			section: col.title,
			id: `${col.title}-${j}`,
		}))
	);

	// Define columns for EditableTable
	const tableColumns = [
		{ key: "title", label: "Task", headerClassName: "table-header-cell Task", cellClassName: "table-cell table-title", width: "20%" },
		{ key: "status", label: "Status", headerClassName: "table-header-cell Status", cellClassName: "table-cell table-status", width: "10%" },
		{ key: "desc", label: "Description", headerClassName: "table-header-cell Description", cellClassName: "table-cell table-desc", width: "30%" },
		{ key: "user", label: "Assigned", headerClassName: "table-header-cell Assigned", cellClassName: "table-cell table-user", width: "12%" },
		{ key: "date", label: "Date", headerClassName: "table-header-cell Date", cellClassName: "table-cell table-date", width: "9%" },
		{ key: "links", label: "Links", headerClassName: "table-header-cell Links", cellClassName: "table-cell table-links", width: "9%" },
		{ key: "section", label: "Priority", headerClassName: "table-header-cell Action", cellClassName: "table-cell table-actions", width: "10%" },
	];

	// Map user cell to show avatar and name
	const processedTableData = tableData.map((row) => ({
		...row,
		user: (
			<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<img src={row.user.avatar} alt={row.user.name} className="task-user-avatar" style={{ width: 22, height: 22 }} />
				{row.user.name}
			</span>
		),
	}));

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
					kanbanColumns.map((col) => (
						<div className="activity-column" key={col.title}>
							<div className="column-header">
								<div className="column-title-icon">
									<span className="column-icon" style={{ color: col.color }}>
										{col.icon && React.createElement(col.icon, { style: { width: 22, height: 22 } })}
									</span>
									<span className="column-title">{col.title}</span>
								</div>
								<div className="column-header-buttons">
									<button
										className="column-add"
										onClick={() => setIsTaskModalOpen(true)}
									>
										<PlusCircleIcon className="plusicon" />
									</button>
									<button className="column-add"><EllipsisVerticalIcon className="plusicon" /></button>
								</div>
							</div>
							{col.tasks.map((task, j) => (
								<ActivityTaskCard key={j} task={task} />
							))}
						</div>
					))
				) : (
					<div className="activity-list-view">
						<EditableTable columns={tableColumns} data={processedTableData} />
					</div>
				)}
			</div>
				{/* Render TaskModal only once, always, and control with open prop */}
				<TaskModal open={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
		</div>
	);
}

export default TeamActivity;
