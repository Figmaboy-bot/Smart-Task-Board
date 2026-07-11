import React from "react";
import { useState } from "react";
import './TaskModal.css';
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Dropdown from "../Dropdown/Dropdown";
import { COLUMN_TO_STATUS } from "../../hooks/useTasks";
import { usePreferences } from "../../context/PreferencesContext";

export default function TaskModal({ open, onClose, onSubmit, projects = [], teamMembers = [], initialTask = null }) {
	const isEditing = !!initialTask;
	const { preferences } = usePreferences();
	const [project, setProject] = useState(initialTask?.project || null);
	const [priority, setPriority] = useState(initialTask?.status?.toLowerCase() || (isEditing ? null : preferences.default_priority?.toLowerCase()) || null);
	const [assignee, setAssignee] = useState(initialTask?.user?.name || null);
	const [tag, setTag] = useState(initialTask?.tag || null);
	const [status, setStatus] = useState(initialTask ? (COLUMN_TO_STATUS[initialTask.columnTitle] || null) : null);
	const [links, setLinks] = useState(initialTask?.rawLinks?.length ? initialTask.rawLinks : ['']);

	// Convert projects prop to dropdown options
	const projectOptions = projects.length > 0
		? projects.map(p => ({ value: p.name || p, label: p.name || p }))
		: [
			{ value: "Project A", label: "Project A" },
			{ value: "Project B", label: "Project B" },
			{ value: "Project C", label: "Project C" },
		];

	const statusOptions = [
		{ value: "To-Do", label: "To-Do" },
		{ value: "In Progress", label: "In Progress" },
		{ value: "Done", label: "Done" },
	];
	const priorityOptions = [
		{ value: "high", label: "High" },
		{ value: "medium", label: "Medium" },
		{ value: "low", label: "Low" },
	];
	const assigneeOptions = [
		{ value: "Me", label: "Me" },
		...teamMembers.map(m => ({ value: m.name, label: m.name })),
	];
	const tagOptions = [
		{ value: "Frontend", label: "Frontend" },
		{ value: "API", label: "API" },
		{ value: "Backend", label: "Backend" },
		{ value: "Docs", label: "Docs" },
	];

	const addLinkField = () => {
		setLinks([...links, '']);
	};

	const updateLink = (index, value) => {
		const newLinks = [...links];
		newLinks[index] = value;
		setLinks(newLinks);
	};

	const removeLink = (index) => {
		if (links.length > 1) {
			const newLinks = links.filter((_, i) => i !== index);
			setLinks(newLinks);
		}
	};

	if (!open) return null;
	return (
		<div className="task-modal-overlay">
			<div className="task-modal">
				<div className="task-modal-header">
					<h3>{isEditing ? "Edit Task" : "Add New Task"}</h3>
					<button className="task-modal-close" onClick={onClose}><XMarkIcon className="task-modal-close-icon" /></button>
				</div>
				<form
					onSubmit={e => {
						e.preventDefault();
						const form = e.target;
						const title = form.title.value;
						const description = form.description.value;
						const dueDate = form.dueDate.value;
						// Filter out empty links
						const validLinks = links.filter(link => link.trim() !== '');
						const submittedTask = {
							title,
							description,
							priority: priority || "medium",
							assignee: assignee || "Me",
							tag: tag || "General",
							dueDate,
							status: status || "To-Do",
							project,
							links: validLinks,
							linksCount: validLinks.length
						};
						// Reset form fields
						form.reset();
						setPriority(null);
						setAssignee(null);
						setTag(null);
						setStatus(null);
						setLinks(['']);
						// Call onSubmit last - parent will handle closing
						if (onSubmit) {
							onSubmit(submittedTask);
						}
					}}
				>
					<div className="task-modal-body">
						<div className="task-modal-field">
							<label>Task Title</label>
							<input name="title" className="form-input" required placeholder="Enter Title" defaultValue={initialTask?.title || ""} />
						</div>
						<div className="task-modal-field">
							<label>Description</label>
							<textarea name="description" rows={3} className="form-input" placeholder="Enter Description" defaultValue={initialTask?.desc || ""} />
						</div>
						<div className="priority-due-date-assignee">
							<div className="task-modal-field">
								<label>Due Date</label>
								<input name="dueDate" type="date" className="form-input" required placeholder="Enter Due Date" defaultValue={initialTask?.due_date || ""} />
							</div>
							<div className="task-modal-field">
								<label>Project</label>
								<Dropdown
									className="full-width-dropdown"
									options={projectOptions}
									value={project}
									onChange={setProject}
									placeholder="Select Project"
									fontSize="0.8rem"
									padding="12px 16px"
								/>
							</div>
						</div>
						<div className="priority-due-date-assignee">
							<div className="task-modal-field">
								<label>Priority</label>
								<Dropdown
									className="full-width-dropdown"
									options={priorityOptions}
									value={priority}
									onChange={setPriority}
									placeholder="Select Priority"
									fontSize="0.8rem"
									padding="12px 16px"
								/>
							</div>
							<div className="task-modal-field">
								<label>Status</label>
								<Dropdown
									className="full-width-dropdown"
									options={statusOptions}
									value={status}
									onChange={setStatus}
									placeholder="Select Status"
									fontSize="0.8rem"
									padding="12px 16px"
								/>
							</div>
						</div>
						<div className="priority-due-date-assignee">
							<div className="task-modal-field">
								<label>Assignee{preferences.block_reassignment_focus ? " (locked during focus)" : ""}</label>
								<Dropdown
									className="full-width-dropdown"
									options={assigneeOptions}
									value={assignee}
									onChange={setAssignee}
									placeholder="Select Assignee"
									fontSize="0.8rem"
									padding="12px 16px"
									disabled={preferences.block_reassignment_focus}
								/>
							</div>
							<div className="task-modal-field">
								<label>Tag</label>
								<Dropdown
									className="full-width-dropdown"
									options={tagOptions}
									value={tag}
									onChange={setTag}
									placeholder="Select Tag"
									fontSize="0.8rem"
									padding="12px 16px"
								/>
							</div>
						</div>
						<div className="task-modal-field">
							<div className="add-links-header">
								<label>Links ({links.filter(l => l.trim() !== '').length})</label>
								<button type="button" className="add-link-btn" onClick={addLinkField}>
									<PlusCircleIcon className="add-link-icon" /> Add link
								</button>
							</div>
							{links.map((link, index) => (
								<div key={index} className="link-input-row">
									<input
										className="form-input"
										placeholder="Add Link"
										value={link}
										onChange={(e) => updateLink(index, e.target.value)}
									/>
									{links.length > 1 && (
										<button
											type="button"
											className="remove-link-btn"
											onClick={() => removeLink(index)}
										>
											<XMarkIcon className="remove-link-icon" />
										</button>
									)}
								</div>
							))}
						</div>
						<div className="create-task-button">
							<button type="button" className="task-modal-submit close-task-button" onClick={onClose}>Cancel</button>
							<button type="submit" className="task-modal-submit">{isEditing ? "Save Changes" : "Add Task"}</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
