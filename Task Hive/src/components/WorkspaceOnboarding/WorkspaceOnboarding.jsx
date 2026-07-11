import { useState } from "react";
import { useWorkspaces } from "../../context/WorkspacesContext";
import "./WorkspaceOnboarding.css";

export default function WorkspaceOnboarding() {
    const { createWorkspace } = useWorkspaces();
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || submitting) return;
        setSubmitting(true);
        setError("");
        try {
            await createWorkspace(name);
        } catch (err) {
            setError(err.message || "Failed to create workspace.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="workspace-onboarding-page">
            <form className="workspace-onboarding-card" onSubmit={handleSubmit}>
                <h2>Create your workspace</h2>
                <p>You're not a member of any workspace yet. Create one to get started.</p>
                <input
                    type="text"
                    className="workspace-onboarding-input"
                    placeholder="e.g. Acme Team"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                {error && <p className="workspace-onboarding-error">{error}</p>}
                <button type="submit" className="workspace-onboarding-btn" disabled={submitting || !name.trim()}>
                    {submitting ? "Creating…" : "Create Workspace"}
                </button>
            </form>
        </div>
    );
}
