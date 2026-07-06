import React, { useState, useRef, useMemo } from "react";
import "./TeamActivity.css";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/outline/ClipboardDocumentCheckIcon";
import ClockIcon from "@heroicons/react/24/outline/ClockIcon";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import { EllipsisVerticalIcon, ViewColumnsIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import EditableTable from "../EditableTable/EditableTable";
import ActivityTaskCard from "../ActivityTaskCard/ActivityTaskCard";
import TaskModal from "../TaskModal/TaskModal";

const COLUMN_META = [
	{ title: "TO-DO", icon: ClipboardDocumentCheckIcon, color: "#2563eb" },
	{ title: "IN PROGRESS", icon: ClockIcon, color: "#f59e42" },
	{ title: "DONE", icon: CheckBadgeIcon, color: "#22c55e" },
];

export function TeamActivity({ tasks = [], loading, projects = [], teamMembers = [], createTask, updateTaskStatus }) {
	const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
	const [view, setView] = useState("kanban");
	const [dragOverCol, setDragOverCol] = useState(null);
	const dragInfo = useRef(null);

	const columns = useMemo(() => COLUMN_META.map(meta => ({
		...meta,
		tasks: tasks.filter(t => t.columnTitle === meta.title),
	})), [tasks]);

	const handleDragStart = (colTitle, task) => {
		dragInfo.current = { colTitle, task };
	};

	const handleDrop = (targetColTitle) => {
		if (!dragInfo.current) return;
		const { colTitle: srcCol, task } = dragInfo.current;
		dragInfo.current = null;
		setDragOverCol(null);
		if (srcCol === targetColTitle) return;

		updateTaskStatus(task.id, targetColTitle);
	};

	const tableData = columns.flatMap((col) =>
		col.tasks.map((task) => ({
			...task,
			section: col.title,
		}))
	);

	const tableColumns = [
		{ key: "title", label: "Task", headerClassName: "table-header-cell Task", cellClassName: "table-cell table-title", width: "20%" },
		{ key: "status", label: "Status", headerClassName: "table-header-cell Status", cellClassName: "table-cell table-status", width: "10%" },
		{ key: "desc", label: "Description", headerClassName: "table-header-cell Description", cellClassName: "table-cell table-desc", width: "30%" },
		{ key: "user", label: "Assigned", headerClassName: "table-header-cell Assigned", cellClassName: "table-cell table-user", width: "12%" },
		{ key: "date", label: "Date", headerClassName: "table-header-cell Date", cellClassName: "table-cell table-date", width: "9%" },
		{ key: "links", label: "Links", headerClassName: "table-header-cell Links", cellClassName: "table-cell table-links", width: "9%" },
		{ key: "section", label: "Priority", headerClassName: "table-header-cell Action", cellClassName: "table-cell table-actions", width: "10%" },
	];

	const processedTableData = tableData.map((row) => ({
		...row,
		user: (
			<span style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<img src={row.user.avatar} alt={row.user.name} className="task-user-avatar" style={{ width: 22, height: 22 }} />
				{row.user.name}
			</span>
		),
	}));

	const handleAddTask = (task) => {
		const matchedProject = projects.find(p => p.name === task.project);
		createTask({
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
		});
		setIsTaskModalOpen(false);
	};

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
				{loading ? (
					<p>Loading tasks…</p>
				) : view === "kanban" ? (
					columns.map((col) => (
						<div
							className={`activity-column${dragOverCol === col.title ? " drag-over" : ""}`}
							key={col.title}
							onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.title); }}
							onDragLeave={() => setDragOverCol(null)}
							onDrop={() => handleDrop(col.title)}
						>
							<div className="column-header">
								<div className="column-title-icon">
									<span className="column-icon" style={{ color: col.color }}>
										{col.icon && React.createElement(col.icon, { style: { width: 22, height: 22 } })}
									</span>
									<span className="column-title">{col.title}</span>
								</div>
								<div className="column-header-buttons">
									<button className="column-add" onClick={() => setIsTaskModalOpen(true)}>
										<PlusCircleIcon className="plusicon" />
									</button>
									<button className="column-add"><EllipsisVerticalIcon className="plusicon" /></button>
								</div>
							</div>
							{col.tasks.map((task) => (
								<ActivityTaskCard
									key={task.id}
									task={task}
									onDragStart={() => handleDragStart(col.title, task)}
								/>
							))}
						</div>
					))
				) : (
					<div className="activity-list-view">
						<EditableTable columns={tableColumns} data={processedTableData} />
					</div>
				)}
			</div>
			<TaskModal
				open={isTaskModalOpen}
				onClose={() => setIsTaskModalOpen(false)}
				projects={projects}
				teamMembers={teamMembers}
				onSubmit={handleAddTask}
			/>
		</div>
	);
}

export default TeamActivity;
