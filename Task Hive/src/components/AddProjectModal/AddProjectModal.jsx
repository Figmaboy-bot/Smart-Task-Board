import React from "react";
import './AddProjectModal.css';
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddProjectModal({ open, onClose, onSubmit }) {

	if (!open) return null;
	return (
		<div className="task-modal-overlay">
			<div className="task-modal">
				<div className="task-modal-header">
					<h3>Add New Project</h3>
					<button className="task-modal-close" onClick={onClose}><XMarkIcon className="task-modal-close-icon" /></button>
				</div>
				<form
					onSubmit={e => {
						e.preventDefault();
						const form = e.target;
						const title = form.title.value;
						const description = form.description.value;
						const dueDate = form.dueDate.value;
						onSubmit && onSubmit({ title, description, dueDate });
						form.reset();
						onClose();
					}}
				>
					<div className="task-modal-body">
						<div className="task-modal-field">
							<label>Project Title</label>
							<input name="title" className="form-input" required placeholder="Enter Title" />
						</div>
						<div className="task-modal-field">
							<label>Description</label>
							<textarea name="description" rows={3} className="form-input" placeholder="Enter Description" />
						</div>
						<div className="task-modal-field">
							<label>Due Date</label>
							<input name="dueDate" type="date" className="form-input" />
						</div>
						<div className="create-task-button">
							<button type="button" className="task-modal-submit close-task-button" onClick={onClose}>Cancel</button>
							<button type="submit" className="task-modal-submit">Add Project</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
