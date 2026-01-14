import React from "react";
import { useState } from "react";
import './TaskModal.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Dropdown from "../Dropdown/Dropdown";

export default function TaskModal({ open, onClose, onSubmit }) {
	const [priority, setPriority] = useState(null);
	const [assignee, setAssignee] = useState(null);
	const [dueDate, setDueDate] = useState(null);

	const priorityOptions = [
		{ value: "all", label: "All Owners" },
		{ value: "owner1", label: "Owner 1" },
		{ value: "owner2", label: "Owner 2" },
	];
	const assigneeOptions = [
		{ value: "all", label: "All Owners" },
		{ value: "owner1", label: "Owner 1" },
		{ value: "owner2", label: "Owner 2" },
	];
	const dueDateOptions = [
		{ value: "all", label: "All Owners" },
		{ value: "owner1", label: "Owner 1" },
		{ value: "owner2", label: "Owner 2" },
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
						onSubmit && onSubmit({ title, description });
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
						<div className="priority-due-date-assignee">
							<div className="task-modal-field">
								<label>Priority</label>
								<Dropdown
									options={priorityOptions}
									value={priority}
									onChange={setPriority}
									placeholder="All Priorities"
								/>
							</div>
							<div className="task-modal-field">
								<label>Due Date</label>
								<Dropdown
									options={dueDateOptions}
									value={dueDate}
									onChange={setDueDate}
									placeholder="All Due Dates"
								/>
							</div>
						</div>
						<div className="task-modal-field">
							<label>Assignee</label>
							<Dropdown
								options={assigneeOptions}
								value={assignee}
								onChange={setAssignee}
								placeholder="All Assignees"
							/>
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
