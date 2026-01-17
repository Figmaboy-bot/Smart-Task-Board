import React from "react";
import { useState } from "react";
import './TaskModal.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Dropdown from "../Dropdown/Dropdown";

export default function TaskModal({ open, onClose, onSubmit }) {
	const [priority, setPriority] = useState(null);
	const [assignee, setAssignee] = useState(null);
	const [tag, setTag] = useState(null);
	const [status, setStatus] = useState(null);

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
		{ value: "Linda", label: "Linda" },
		{ value: "Jake", label: "Jake" },
		{ value: "Mathew", label: "Mathew" },
	];
	const tagOptions = [
		{ value: "Frontend", label: "Frontend" },
		{ value: "API", label: "API" },
		{ value: "Backend", label: "Backend" },
		{ value: "Docs", label: "Docs" },
	];

	if (!open) return null;
	return (
		<div className="task-modal-overlay">
			<div className="task-modal">
				<div className="task-modal-header">
					<h3>Add New Task</h3>
					<button className="task-modal-close" onClick={onClose}><XMarkIcon className="task-modal-close-icon" /></button>
				</div>
				<form
					onSubmit={e => {
						e.preventDefault();
						const form = e.target;
						const title = form.title.value;
						const description = form.description.value;
						const dueDate = form.dueDate.value;
						onSubmit && onSubmit({
							title,
							description,
							priority,
							assignee,
							tag,
							dueDate,
							status
						});
						onClose();
					}}
				>
					<div className="task-modal-body">
						<div className="task-modal-field">
							<label>Task Title</label>
							<input name="title" className="form-input" required placeholder="Enter Title" />
						</div>
						<div className="task-modal-field">
							<label>Description</label>
							<textarea name="description" rows={3} className="form-input" placeholder="Enter Description" />
						</div>
						<div className="task-modal-field">
							<label>Due Date</label>
							<input name="dueDate" type="date" className="form-input" required placeholder="Enter Due Date" />
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
								<label>Assignee</label>
								<Dropdown
									className="full-width-dropdown"
									options={assigneeOptions}
									value={assignee}
									onChange={setAssignee}
									placeholder="Select Assignee"
									fontSize="0.8rem"
									padding="12px 16px"
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
						<div className="create-task-button">
							<button type="button" className="task-modal-submit close-task-button" onClick={onClose}>Cancel</button>
							<button type="submit" className="task-modal-submit">Add Task</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
