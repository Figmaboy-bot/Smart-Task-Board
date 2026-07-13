import React from "react";
import { useState } from "react";
import './AddTeamModal.css';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Dropdown from "../Dropdown/Dropdown";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddTeamModal({ open, onClose, onSubmit, workspaces = [], activeWorkspaceId }) {
	const [status, setStatus] = useState(null);
	const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState([]);
	const [allWorkspaces, setAllWorkspaces] = useState(false);
	const [errors, setErrors] = useState({});

	React.useEffect(() => {
		if (open) {
			setSelectedWorkspaceIds(activeWorkspaceId ? [activeWorkspaceId] : []);
			setAllWorkspaces(false);
		}
	}, [open, activeWorkspaceId]);

	const handleClose = () => {
		setErrors({});
		onClose();
	};

	const toggleWorkspace = (id) => {
		setSelectedWorkspaceIds((prev) => (
			prev.includes(id) ? prev.filter((wsId) => wsId !== id) : [...prev, id]
		));
	};

	const statusOptions = [
		{ value: "Invited", label: "Invited" },
		{ value: "Active", label: "Active" },
		{ value: "Suspended", label: "Suspended" },
	];

	const showWorkspacePicker = workspaces.length > 0;
	const workspaceIds = allWorkspaces ? workspaces.map((w) => w.id) : selectedWorkspaceIds;
	const canSubmit = !showWorkspacePicker || workspaceIds.length > 0;

	if (!open) return null;
	return (
		<div className="task-modal-overlay">
			<div className="task-modal">
				<div className="task-modal-header">
					<h3>Add New Team Member</h3>
					<button className="task-modal-close" onClick={handleClose}><XMarkIcon className="task-modal-close-icon" /></button>
				</div>
				<form
					noValidate
					onSubmit={e => {
						e.preventDefault();
						const form = e.target;
						const email = form.email.value;
						const role = form.role.value;
						const nextErrors = {};
						if (!email.trim()) nextErrors.email = "Please enter an email address.";
						else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
						if (!role.trim()) nextErrors.role = "Please enter a role.";
						if (Object.keys(nextErrors).length > 0) {
							setErrors(nextErrors);
							return;
						}
						setErrors({});
						// The invitee sets their own name and picture when they complete
						// their own onboarding (see OnboardingWizard's profile step) - a
						// sync trigger then fills this team_members row in from their
						// profile. Until then it shows an email-derived placeholder name,
						// same as invites sent from the onboarding wizard itself.
						onSubmit && onSubmit({
							member: email.trim().split("@")[0],
							email,
							role,
							status,
							img: null,
							workspaceIds
						});
						onClose();
					}}
				>
					<div className="task-modal-body">
						<div className="task-modal-field">
							<label>Email</label>
							<input name="email" type="email" required className="form-input" placeholder="Enter Email" />
							{errors.email && <p className="form-field-error">{errors.email}</p>}
						</div>
						<div className="priority-due-date-assignee">
							<div className="task-modal-field">
								<label>Role</label>
								<input name="role" type="text" required className="form-input" placeholder="Enter Role" />
								{errors.role && <p className="form-field-error">{errors.role}</p>}
							</div>
							<div className="task-modal-field">
								<label>Status</label>
								<Dropdown
									options={statusOptions}
									value={status}
									onChange={setStatus}
									placeholder="All Statuses"
								/>
							</div>
						</div>
						{showWorkspacePicker && (
							<div className="task-modal-field">
								<label>Add to Workspace(s)</label>
								<div className="workspace-picker-list">
									<label className="workspace-picker-option workspace-picker-all">
										<input
											type="checkbox"
											checked={allWorkspaces}
											onChange={(e) => setAllWorkspaces(e.target.checked)}
										/>
										<span>All Workspaces</span>
									</label>
									{workspaces.map((ws) => (
										<label key={ws.id} className="workspace-picker-option">
											<input
												type="checkbox"
												checked={allWorkspaces || selectedWorkspaceIds.includes(ws.id)}
												disabled={allWorkspaces}
												onChange={() => toggleWorkspace(ws.id)}
											/>
											<span>{ws.name}</span>
										</label>
									))}
								</div>
							</div>
						)}
						<div className="create-task-button">
							<button type="button" className="task-modal-submit close-task-button" onClick={handleClose}>Cancel</button>
							<button type="submit" className="task-modal-submit" disabled={!canSubmit}>Add team member</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
