import React from "react";
import { useState } from "react";
import './AddTeamModal.css';
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import Dropdown from "../Dropdown/Dropdown";
import IconButton from "../Buttons/Buttons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddTeamModal({ open, onClose, onSubmit, workspaces = [], activeWorkspaceId }) {
	const [profilePic, setProfilePic] = useState("/Icons/default-profile.svg");
	const [status, setStatus] = useState(null);
	const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState([]);
	const [allWorkspaces, setAllWorkspaces] = useState(false);
	const [errors, setErrors] = useState({});

	React.useEffect(() => {
		if (open) {
			setSelectedWorkspaceIds(activeWorkspaceId ? [activeWorkspaceId] : []);
			setAllWorkspaces(false);
			setErrors({});
		}
	}, [open, activeWorkspaceId]);

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
					<button className="task-modal-close" onClick={onClose}><XMarkIcon className="task-modal-close-icon" /></button>
				</div>
				<form
					noValidate
					onSubmit={e => {
						e.preventDefault();
						const form = e.target;
						const member = form.title.value;
						const email = form.email.value;
						const role = form.role.value;
						const nextErrors = {};
						if (!member.trim()) nextErrors.title = "Please enter the member's name.";
						if (!email.trim()) nextErrors.email = "Please enter an email address.";
						else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
						if (!role.trim()) nextErrors.role = "Please enter a role.";
						if (Object.keys(nextErrors).length > 0) {
							setErrors(nextErrors);
							return;
						}
						setErrors({});
						// status is from state
						// profilePic is from state
						onSubmit && onSubmit({
							member,
							email,
							role,
							status,
							img: profilePic,
							workspaceIds
						});
						onClose();
					}}
				>
					<div className="task-modal-body">

						<div className="task-profile-picture">
							<label>Profile Picture</label>
							<div className="placeholder-img-change">
								<div className="profile-picture-preview">
									{profilePic === "/Icons/default-profile.svg" || !profilePic ? (
										<svg
											className="profile-img-preview"
											width="48"
											height="48"
											viewBox="0 0 32 32"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clipPath="url(#clip0_1586_9905)">
												<path
													d="M28.8672 27.5C28.7794 27.652 28.6531 27.7783 28.5011 27.8661C28.349 27.9538 28.1765 28 28.0009 28H4.00093C3.82548 27.9998 3.65316 27.9535 3.50129 27.8656C3.34941 27.7778 3.22332 27.6515 3.13567 27.4995C3.04802 27.3475 3.00191 27.1752 3.00195 26.9997C3.002 26.8243 3.0482 26.6519 3.13593 26.5C5.03968 23.2087 7.97343 20.8487 11.3972 19.73C9.70364 18.7218 8.38786 17.1856 7.65191 15.3572C6.91596 13.5289 6.80053 11.5095 7.32335 9.60918C7.84617 7.70887 8.97833 6.03272 10.546 4.83814C12.1136 3.64355 14.03 2.99658 16.0009 2.99658C17.9718 2.99658 19.8883 3.64355 21.4559 4.83814C23.0235 6.03272 24.1557 7.70887 24.6785 9.60918C25.2013 11.5095 25.0859 13.5289 24.3499 15.3572C23.614 17.1856 22.2982 18.7218 20.6047 19.73C24.0284 20.8487 26.9622 23.2087 28.8659 26.5C28.9539 26.6519 29.0003 26.8243 29.0005 26.9998C29.0007 27.1754 28.9548 27.3479 28.8672 27.5Z"
													fill="currentColor"
												/>
											</g>
											<defs>
												<clipPath id="clip0_1586_9905">
													<rect width="32" height="32" fill="white" />
												</clipPath>
											</defs>
										</svg>
									) : (
										<img
											src={profilePic}
											alt="Profile Preview"
											className="profile-img-preview"
										/>
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									id="profile-pic-input"
									style={{ display: "none" }}
									onChange={e => {
										if (e.target.files && e.target.files[0]) {
											const reader = new FileReader();
											reader.onload = ev => setProfilePic(ev.target.result);
											reader.readAsDataURL(e.target.files[0]);
										}
									}}
								/>
								<IconButton
									type="button"
									className="change-pic-btn"
									onClick={() => document.getElementById("profile-pic-input").click()}
									text="Change Picture"
									icon={PencilIcon}
								/>
							</div>
						</div>

						<div className="task-modal-field">
							<label>Member Name</label>
							<input name="title" className="form-input" required placeholder="Enter member name" />
							{errors.title && <p className="form-field-error">{errors.title}</p>}
						</div>
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
							<button type="button" className="task-modal-submit close-task-button" onClick={onClose}>Cancel</button>
							<button type="submit" className="task-modal-submit" disabled={!canSubmit}>Add team member</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
