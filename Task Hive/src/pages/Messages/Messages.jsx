import React, { useEffect, useRef, useState } from "react";
import TaskModal from "../../components/TaskModal/TaskModal";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { PlusIcon, ChatBubbleLeftRightIcon, PaperClipIcon, XMarkIcon, DocumentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useMessages } from "../../hooks/useMessages";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { usePreferences } from "../../context/PreferencesContext";
import EmptyState from "../../components/EmptyState/EmptyState";
import './Messages.css';

function formatTime(isoString, { timezone, time_format } = {}) {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: time_format !== "24-hour",
        timeZone: timezone || undefined,
    });
}

function ChatAttachment({ url, name, type }) {
    if (!url) return null;
    if (type?.startsWith("image/")) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="chat-attachment-image-link">
                <img src={url} alt={name || "attachment"} className="chat-attachment-image" />
            </a>
        );
    }
    if (type?.startsWith("audio/")) {
        return <audio controls src={url} className="chat-attachment-audio" />;
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="chat-attachment-file">
            <DocumentIcon className="chat-attachment-file-icon" />
            <span className="chat-attachment-file-name">{name || "Attachment"}</span>
            <ArrowDownTrayIcon className="chat-attachment-file-download" />
        </a>
    );
}

export default function Messages() {
    const { messages, loading, sendMessage, uploadAttachment, currentUserId } = useMessages();
    const { createTask } = useTasks();
    const { projects } = useProjects();
    const { teamMembers } = useTeamMembers();
    const { preferences } = usePreferences();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [draft, setDraft] = useState("");
    const [pendingAttachments, setPendingAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [attachError, setAttachError] = useState("");
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end" });
    }, [messages]);

    const handleSend = () => {
        if (!draft.trim() && pendingAttachments.length === 0) return;
        sendMessage(draft, pendingAttachments);
        setDraft("");
        setPendingAttachments([]);
    };

    const handleFilePick = async (e) => {
        const files = [...(e.target.files || [])];
        e.target.value = "";
        if (files.length === 0) return;
        setAttachError("");
        setUploading(true);
        try {
            const uploaded = await Promise.all(files.map((file) => uploadAttachment(file)));
            setPendingAttachments((prev) => [...prev, ...uploaded]);
        } catch (err) {
            setAttachError(err.message || "Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    const removePendingAttachment = (index) => {
        setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
    };

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
        setShowTaskModal(false);
    };

    return (
        <div className="messages-page">
            <Sidebar />
            <div className="messages-content">
                <Header onNotificationClick={() => { }} />
                <div className="messages-view">
                    <div className="chat-area">
                        <div className="chat-header">
                            <div className="chat-header-title">
                                Team Channel <span className="chat-header-status">● {teamMembers.length} member{teamMembers.length === 1 ? "" : "s"}</span>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {loading ? (
                                <p style={{ color: "var(--grey-50)" }}>Loading messages…</p>
                            ) : messages.length === 0 ? (
                                <EmptyState
                                    icon={ChatBubbleLeftRightIcon}
                                    title="No messages yet"
                                    description="Say hello to get the conversation started."
                                />
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUserId;
                                    return (
                                        <div key={msg.id} className={`chat-message${isMe ? " chat-message-me" : " chat-message-them"}`}>
                                            <div className={`chat-message-bubble${isMe ? " chat-message-bubble-me" : " chat-message-bubble-them"}`}>
                                                {!isMe && <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{msg.sender_name}</div>}
                                                {msg.attachments?.map((att, i) => (
                                                    <ChatAttachment key={att.url || i} url={att.url} name={att.name} type={att.type} />
                                                ))}
                                                {msg.body}
                                                <div className={`chat-message-time${isMe ? " chat-message-time-me" : " chat-message-time-them"}`}>{formatTime(msg.created_at, preferences)}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-bar">
                            {attachError && <p className="chat-attach-error">{attachError}</p>}
                            {pendingAttachments.length > 0 && (
                                <div className="chat-pending-attachments">
                                    {pendingAttachments.map((att, i) => (
                                        <div className="chat-pending-attachment" key={att.url || i}>
                                            <DocumentIcon className="chat-pending-attachment-icon" />
                                            <span className="chat-pending-attachment-name">{att.name}</span>
                                            <button
                                                type="button"
                                                className="chat-pending-attachment-remove"
                                                onClick={() => removePendingAttachment(i)}
                                                aria-label="Remove attachment"
                                            >
                                                <XMarkIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="chat-input-top">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Message the team..."
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                                />
                                <button className="chat-send-btn" onClick={handleSend} disabled={uploading}>Send</button>
                            </div>
                            <div className="chat-input-bottom">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.zip"
                                    onChange={handleFilePick}
                                />
                                <button
                                    type="button"
                                    className="chat-form-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    <PaperClipIcon className="chat-input-bottom-left-icon" aria-hidden="true" />
                                    {uploading ? "Uploading…" : "Attach"}
                                </button>
                                <button className="chat-form-btn" onClick={() => setShowTaskModal(true)}>
                                    <PlusIcon className="chat-input-bottom-left-icon" aria-hidden="true" /> Create task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                projects={projects}
                teamMembers={teamMembers}
                onSubmit={handleAddTask}
            />
        </div>
    );
}
