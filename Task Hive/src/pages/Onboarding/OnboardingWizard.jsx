import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useProfile } from "../../context/ProfileContext"
import { useWorkspaces } from "../../context/WorkspacesContext"
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import "../Auth/AuthFlow.css"

const ROLE_OPTIONS = [
  "Product Manager",
  "Software Engineer",
  "Designer",
  "Marketing",
  "Founder / Executive",
  "Other",
]

const WORKSPACE_SIZES = ["Just Me", "2-10 people", "11-50 people", "50+"]

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, saveProfile, uploadAvatar } = useProfile()
  const { createWorkspace, inviteToWorkspace } = useWorkspaces()

  const [step, setStep] = useState("welcome") // welcome | profile | workspace | invite | ready
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const fileInputRef = useRef(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("")

  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceSize, setWorkspaceSize] = useState("")

  const [inviteEmails, setInviteEmails] = useState([""])

  useEffect(() => {
    if (profile?.first_name) setFirstName(profile.first_name)
    if (profile?.last_name) setLastName(profile.last_name)
    if (profile?.role) setRole(profile.role)
  }, [profile])

  useEffect(() => {
    if (!workspaceName && user?.email) {
      setWorkspaceName(`${user.email.split("@")[0]}'s Workspace`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const resetError = () => error && setError("")

  const handlePickAvatar = () => fileInputRef.current?.click()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleWelcomeContinue = (e) => {
    e.preventDefault()
    setStep("profile")
  }

  const handleProfileContinue = async (e) => {
    e.preventDefault()
    resetError()
    setLoading(true)
    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile)
      }
      await saveProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: role || null,
      })
      setStep("workspace")
    } catch (err) {
      setError(err.message || "Failed to save your profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleWorkspaceContinue = async (e) => {
    e.preventDefault()
    resetError()
    setLoading(true)
    try {
      await createWorkspace(workspaceName, workspaceSize || null)
      setStep("invite")
    } catch (err) {
      setError(err.message || "Failed to create your workspace. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateInviteEmail = (value, index) => {
    setInviteEmails((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  const addAnotherInvite = () => setInviteEmails((prev) => [...prev, ""])

  const removeInvite = (index) => {
    setInviteEmails((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))
  }

  const handleSendInvites = async (e) => {
    e.preventDefault()
    resetError()
    const emails = inviteEmails.map((v) => v.trim()).filter(Boolean)
    if (emails.length === 0) {
      setStep("ready")
      return
    }
    setLoading(true)
    try {
      await Promise.all(emails.map((email) => inviteToWorkspace({ email, role: "Member" })))
      setStep("ready")
    } catch (err) {
      setError(err.message || "Failed to send invitations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSkipInvites = () => {
    resetError()
    setStep("ready")
  }

  const handleGoToDashboard = async () => {
    try {
      await saveProfile({ onboarding_completed_at: new Date().toISOString() })
    } catch {
      // Non-blocking - the workspace already exists, so there's nothing to retry into.
    }
    navigate("/")
  }

  const stepNumber = { profile: 1, workspace: 2, invite: 3 }[step]

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-glow" />

      <div className="auth-flow-logo">
        <img src="/TaskHive Logo.svg" alt="TaskHive" />
      </div>

      <div className="auth-flow-card">
        {stepNumber && (
          <div className="onboarding-step-header">
            <button
              type="button"
              className="onboarding-back-link"
              onClick={() => setStep(step === "profile" ? "welcome" : step === "workspace" ? "profile" : "workspace")}
            >
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <span className="onboarding-step-count">Step {stepNumber} of 3</span>
          </div>
        )}

        {step === "welcome" && (
          <>
            <div className="auth-flow-heading">
              <h1>🎉 Welcome to TaskHive</h1>
              <p>Let's personalize your workspace in less than a minute. We'll help you get everything ready.</p>
            </div>
            <div className="auth-flow-body">
              <form onSubmit={handleWelcomeContinue} className="auth-flow-form">
                <button type="submit" className="auth-flow-primary-button">
                  <span>Continue</span>
                  <ArrowRightIcon />
                </button>
              </form>
              <p className="auth-flow-resend">Takes about 45 seconds</p>
            </div>
          </>
        )}

        {step === "profile" && (
          <>
            <div className="auth-flow-heading">
              <h1>Tell us about yourself</h1>
              <p>How should we address you?</p>
            </div>
            <div className="auth-flow-body">
              <form onSubmit={handleProfileContinue} className="auth-flow-form">
                <div className="auth-flow-field-group">
                  <label>Profile Photo</label>
                  <div className="onboarding-avatar-row">
                    <div className="onboarding-avatar-preview">
                      {avatarPreview || profile?.avatar_url ? (
                        <img src={avatarPreview || profile.avatar_url} alt="" />
                      ) : (
                        <UserIcon />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="onboarding-upload-btn"
                      onClick={handlePickAvatar}
                      disabled={loading}
                    >
                      <span>Upload Image</span>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>

                <div className="auth-flow-field-row">
                  <div className="auth-flow-field-group">
                    <label htmlFor="onboarding-first-name">First Name</label>
                    <input
                      id="onboarding-first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="auth-flow-field-group">
                    <label htmlFor="onboarding-last-name">Last Name</label>
                    <input
                      id="onboarding-last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="auth-flow-field-group">
                  <label htmlFor="onboarding-role">What's your role</label>
                  <select
                    id="onboarding-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select your role</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Saving…" : "Continue"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>
              </form>
            </div>
          </>
        )}

        {step === "workspace" && (
          <>
            <div className="auth-flow-heading">
              <h1>Create your workspace</h1>
              <p>How should we address you?</p>
            </div>
            <div className="auth-flow-body">
              <form onSubmit={handleWorkspaceContinue} className="auth-flow-form">
                <div className="auth-flow-field-group">
                  <label htmlFor="onboarding-workspace-name">Workspace Name</label>
                  <input
                    id="onboarding-workspace-name"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g. Acme Team"
                    required
                    autoFocus
                  />
                  <p className="onboarding-workspace-url">
                    Workspace URL: <span>taskhive.com/{slugify(workspaceName) || "your-workspace"}</span>
                  </p>
                </div>

                <div className="auth-flow-field-group">
                  <label>Workspace Size</label>
                  <div className="onboarding-radio-list">
                    {WORKSPACE_SIZES.map((size) => (
                      <label key={size} className="onboarding-radio-item">
                        <input
                          type="radio"
                          name="workspace-size"
                          value={size}
                          checked={workspaceSize === size}
                          onChange={(e) => setWorkspaceSize(e.target.value)}
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Creating…" : "Continue"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>
              </form>
            </div>
          </>
        )}

        {step === "invite" && (
          <>
            <div className="auth-flow-heading">
              <h1>Invite your teammates</h1>
              <p>How should we address you?</p>
            </div>
            <div className="auth-flow-body">
              <form onSubmit={handleSendInvites} className="auth-flow-form">
                <div className="auth-flow-field-group">
                  <label>Email Address</label>
                  {inviteEmails.map((emailValue, i) => (
                    <div className="onboarding-invite-row" key={i}>
                      <input
                        type="email"
                        value={emailValue}
                        onChange={(e) => updateInviteEmail(e.target.value, i)}
                        placeholder="Enter email address"
                        autoFocus={i === 0}
                      />
                      {inviteEmails.length > 1 && (
                        <button
                          type="button"
                          className="onboarding-remove-invite"
                          onClick={() => removeInvite(i)}
                          aria-label="Remove"
                        >
                          <XMarkIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" className="onboarding-add-another" onClick={addAnotherInvite}>
                  <PlusIcon />
                  <span>Add another</span>
                </button>

                {error && <p className="auth-flow-error">{error}</p>}

                <button type="submit" className="auth-flow-primary-button" disabled={loading}>
                  <span>{loading ? "Sending…" : "Send Invitations"}</span>
                  {!loading && <ArrowRightIcon />}
                </button>

                <button type="button" className="onboarding-skip-link" onClick={handleSkipInvites} disabled={loading}>
                  Skip for now
                </button>
              </form>
            </div>
          </>
        )}

        {step === "ready" && (
          <>
            <div className="auth-flow-heading">
              <h1>🚀 Workspace Ready!</h1>
              <p>Everything is set up.</p>
            </div>
            <div className="auth-flow-body">
              <button type="button" className="auth-flow-primary-button" onClick={handleGoToDashboard}>
                <span>Go to Dashboard</span>
                <ArrowRightIcon />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="auth-flow-footer">
        <span>Terms &amp; Conditions</span>
        <span>Privacy Policy</span>
      </div>
    </div>
  )
}
