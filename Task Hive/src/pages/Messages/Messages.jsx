import React, { useEffect, useRef, useState } from "react";
import TaskModal from "../../components/TaskModal/TaskModal";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMessages } from "../../hooks/useMessages";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import { usePreferences } from "../../context/PreferencesContext";
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

export default function Messages() {
    const { messages, loading, sendMessage, currentUserId } = useMessages();
    const { createTask } = useTasks();
    const { projects } = useProjects();
    const { teamMembers } = useTeamMembers();
    const { preferences } = usePreferences();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [draft, setDraft] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end" });
    }, [messages]);

    const handleSend = () => {
        if (!draft.trim()) return;
        sendMessage(draft);
        setDraft("");
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
                                <p style={{ color: "var(--grey-50)" }}>No messages yet. Say hello.</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === currentUserId;
                                    return (
                                        <div key={msg.id} className={`chat-message${isMe ? " chat-message-me" : " chat-message-them"}`}>
                                            <div className={`chat-message-bubble${isMe ? " chat-message-bubble-me" : " chat-message-bubble-them"}`}>
                                                {!isMe && <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{msg.sender_name}</div>}
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
                            <div className="chat-input-top">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Message the team..."
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                                />
                                <button className="chat-send-btn" onClick={handleSend}>Send</button>
                            </div>
                            <div className="chat-input-bottom">
                                <div />
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
