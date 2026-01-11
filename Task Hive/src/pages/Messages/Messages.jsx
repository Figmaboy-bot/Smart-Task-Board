import React, { useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { FaceSmileIcon, PaperClipIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import './Messages.css';

export default function Messages() {
    // Dummy data for chat list and messages
    const chats = [
        { id: 1, name: "Mr. Rosemary Koss", lastMessage: "Can someone review the landing page task? @You", unread: 1, avatar: "https://randomuser.me/api/portraits/men/32.jpg", time: "09:12" },
        { id: 2, name: "Cora Goyette", lastMessage: "Hi, i want to ask something...", unread: 1, active: true, avatar: "https://randomuser.me/api/portraits/women/44.jpg", time: "10:45" },
        { id: 3, name: "Mrs. Darin O'Keefe", lastMessage: "Hi, i want to ask something...", unread: 3, avatar: "https://randomuser.me/api/portraits/men/65.jpg", time: "11:30" },
        { id: 4, name: "Irene Dicki", lastMessage: "Hi, i want to ask something...", unread: 1, avatar: "https://randomuser.me/api/portraits/women/68.jpg", time: "12:01" },
    ];


    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('Newest');

    const sortOptions = [
        { value: 'Newest', label: 'Newest' },
        { value: 'Oldest', label: 'Oldest' },
        { value: 'Unread', label: 'Unread' }
    ];

    const filterOptions = [
        { value: 'All', label: 'All' },
        { value: 'Unread', label: 'Unread' },
        { value: 'Mentions', label: 'Mentions' },
        { value: 'Tasks', label: 'Tasks' }
    ];


    // Filter chats based on selected filter (dummy logic for now)
    let filteredChats = chats.filter(chat => {
        if (filter === 'All') return true;
        if (filter === 'Unread') return chat.unread > 0;
        // For demo, Mentions and Tasks just return all
        return true;
    });

    // Sort chats based on selected sort option
    if (sort === 'Newest') {
        filteredChats = [...filteredChats].sort((a, b) => b.id - a.id);
    } else if (sort === 'Oldest') {
        filteredChats = [...filteredChats].sort((a, b) => a.id - b.id);
    } else if (sort === 'Unread') {
        filteredChats = [...filteredChats].sort((a, b) => (b.unread || 0) - (a.unread || 0));
    }

    const messages = [
        { id: 1, from: "me", text: "Thank you. Please enter the amount and date of the transaction (e.g., $100, December 21th).", time: "13.34" },
        { id: 2, from: "them", text: "$50, November 30th.", time: "13.34" },
        { id: 3, from: "me", text: "Thank you! It seems there might be a delay in processing the transaction. What would you like to do next?", time: "13.34" },
        { id: 4, from: "me", text: "Retry Checking the Balance", time: "13.34", isButton: true },
        { id: 5, from: "me", text: "Speak to a Representative", time: "13.34", isButton: true },
        { id: 6, from: "them", text: "Speak to a Representative", time: "13.34" },
        { id: 7, from: "system", text: "Chat got taken over by customer service" },
        { id: 8, from: "agent", text: "Hi, this is Alex from Customer Support. I see you’re having an issue with your top-up. Could you confirm if the $50 transaction on November 30th is showing in your bank statement or pending?", time: "13.34" },
    ];

    // Find the active chat
    const activeChat = chats.find(chat => chat.active) || chats[0];

    return (
        <div className="messages-page">
            <Sidebar />
            <div className="messages-content">
                <Header onNotificationClick={() => { }} />
                <div className="messages-view">
                    {/* Chat List */}
                    <div className="chat-list">
                        <div className="chat-list-title">John Doe</div>
                        <div className="chat-list-controls" style={{ gap: 8, display: 'flex', alignItems: 'center' }}>
                            <Dropdown
                                options={filterOptions}
                                value={filter}
                                onChange={setFilter}
                                placeholder="Filter"
                                className="chat-list-filter-dropdown"
                            />
                            <Dropdown
                                options={sortOptions}
                                value={sort}
                                onChange={setSort}
                                placeholder="Sort"
                                className="chat-list-filter-dropdown"
                            />
                        </div>
                        <div className="chat-list-scroll">
                            {filteredChats.map(chat => (
                                <div key={chat.id} className={`chat-list-item${chat.active ? ' active' : ''}`}>
                                    <div className="chat-avatar">
                                        <img src={chat.avatar} alt={chat.name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                                    </div>
                                    <div className="chat-list-item-content">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div className="chat-list-item-name">{chat.name}</div>
                                            <div className="chat-list-item-time" style={{ fontSize: 12, color: '#bfc9d9', marginLeft: 8, minWidth: 40, textAlign: 'right' }}>{chat.time}</div>
                                        </div>
                                        <div className="chat-last-message-unread">
                                        <div className="chat-list-item-last-message">{chat.lastMessage}</div>
                                        {chat.unread > 0 && <div className="chat-list-item-unread">{chat.unread}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Chat Area */}
                    <div className="chat-area">
                        {/* Chat Header */}
                        <div className="chat-header">
                            <div className="chat-avatar chat-avatar-lg">
                                <img src={activeChat.avatar} alt={activeChat.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            </div>
                            <div className="chat-header-title">
                                {activeChat.name} <span className="chat-header-status">● Online</span>
                            </div>
                            <button className="chat-header-btn chat-header-btn-pause">|| Pause</button>
                            <button className="chat-header-btn chat-header-btn-close">✕ Close</button>
                        </div>
                        {/* Chat Messages */}
                        <div className="chat-messages">
                            {messages.map((msg, idx) => {
                                if (msg.from === 'me') {
                                    if (msg.isButton) {
                                        return null; // Render buttons below
                                    }
                                    return (
                                        <div key={msg.id} className="chat-message chat-message-me">
                                            <div className="chat-message-bubble chat-message-bubble-me">
                                                {msg.text}
                                                <div className="chat-message-time chat-message-time-me">{msg.time}</div>
                                            </div>
                                        </div>
                                    );
                                } else if (msg.from === 'them') {
                                    return (
                                        <div key={msg.id} className="chat-message chat-message-them">
                                            <div className="chat-message-bubble chat-message-bubble-them">
                                                {msg.text}
                                                <div className="chat-message-time chat-message-time-them">{msg.time}</div>
                                            </div>
                                        </div>
                                    );
                                } else if (msg.from === 'agent') {
                                    return (
                                        <div key={msg.id} className="chat-message chat-message-agent">
                                            <div className="chat-message-bubble chat-message-bubble-me">
                                                {msg.text}
                                                <div className="chat-message-time chat-message-time-me">{msg.time}</div>
                                            </div>
                                        </div>
                                    );
                                } else if (msg.from === 'system') {
                                    return (
                                        <div key={msg.id} className="chat-message-system">{msg.text}</div>
                                    );
                                }
                                return null;
                            })}
                            {/* Render buttons for options */}
                            <div className="chat-options">
                                <button className="chat-option-btn">Retry Checking the Balance</button>
                                <button className="chat-option-btn">Speak to a Representative</button>
                            </div>
                        </div>
                        {/* Chat Input */}
                        <div className="chat-input-bar">
                            <div className="chat-input-top">
                                <input type="text" className="chat-input" placeholder="Type '/' to use command" />
                                <button className="chat-send-btn">Send</button>
                            </div>
                            <div className="chat-input-bottom">
                                <div className="emoji-attachment">
                                    <button className="chat-attach-btn" title="Attach"><PaperClipIcon className="chat-input-bottom-icon" aria-hidden="true" /></button>
                                    <button className="chat-attach-btn" title="Photo"><PhotoIcon className="chat-input-bottom-icon" aria-hidden="true" /></button>
                                    <button className="chat-emoji-btn" title="Emoji"><FaceSmileIcon className="chat-input-bottom-icon" aria-hidden="true" /></button>
                                </div>
                                <button className="chat-form-btn"> <PlusIcon className="chat-input-bottom-left-icon" aria-hidden="true" /> Create task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}