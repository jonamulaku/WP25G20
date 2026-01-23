import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    MessageSquare,
    Bell,
    Send
} from "lucide-react";
import { tasksAPI, messagesAPI } from "../../services/api";

export default function Communication() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [notifications, setNotifications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Messages to/from admin
    const [messagesToAdmin, setMessagesToAdmin] = useState([]);
    const [adminReplies, setAdminReplies] = useState([]);
    const [newMessageSubject, setNewMessageSubject] = useState("");
    const [newMessageContent, setNewMessageContent] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        fetchData();
        fetchMessages();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            if (!userInfo || !userInfo.id) {
                console.warn("User info not available");
                setLoading(false);
                return;
            }
            
            const tasksResponse = await tasksAPI.getMyTasks({ pageSize: 1000 });
            const userTasks = tasksResponse.items || [];
            setTasks(userTasks);

            // Generate notifications from recent task updates
            const recentTasks = userTasks
                .filter(t => t.updatedAt || t.createdAt)
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                .slice(0, 10);
            
            const notifications = recentTasks.map((task, index) => ({
                id: `notif-${task.id}-${index}`,
                message: task.status === 'Completed' 
                    ? `Task "${task.title}" was completed`
                    : task.status === 'InProgress'
                    ? `Task "${task.title}" is now in progress`
                    : `Task "${task.title}" was updated`,
                read: false,
                createdAt: task.updatedAt || task.createdAt || new Date().toISOString()
            }));

            setNotifications(notifications);
        } catch (error) {
            console.error("Error fetching communication data:", error);
            setTasks([]);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const fetchMessages = async () => {
        try {
            if (!userInfo || !userInfo.id) return;
            
            // Fetch messages sent to admin (only from current user)
            // The API automatically filters by userId, so we'll get messages where senderUserId = current user
            const sentResponse = await messagesAPI.getAll({ 
                type: "TeamToAdmin",
                pageSize: 100 
            });
            // Filter to only show messages from current user (double-check)
            const myMessages = (sentResponse.items || []).filter(
                msg => msg.senderUserId === userInfo.id
            );
            // Sort by creation date, newest first
            myMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessagesToAdmin(myMessages);
            
            // Fetch replies from admin (AdminToTeam messages)
            // The API should automatically filter by userId to show messages where recipientUserId = current user
            // The API now includes replies (messages with ParentMessageId) for team members
            const repliesResponse = await messagesAPI.getAll({ 
                type: "AdminToTeam",
                pageSize: 100 
            });
            // Get all my message IDs for additional filtering
            const myMessageIds = myMessages.map(m => m.id);
            // Filter replies where:
            // 1. I am the recipient (recipientUserId matches my ID) - this should be handled by API
            // 2. OR it's a reply to one of my messages (parentMessageId matches one of my message IDs)
            const myReplies = (repliesResponse.items || []).filter(
                msg => msg.recipientUserId === userInfo.id || 
                       (msg.parentMessageId && myMessageIds.includes(msg.parentMessageId))
            );
            // Sort by creation date, newest first
            myReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAdminReplies(myReplies);
            
            console.log('Fetched AdminToTeam messages:', repliesResponse.items?.length || 0);
            console.log('Filtered replies for current user:', myReplies.length);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessageToAdmin = async () => {
        if (!newMessageSubject.trim() || !newMessageContent.trim()) {
            alert('Please fill in both subject and message');
            return;
        }
        
        try {
            setSendingMessage(true);
            await messagesAPI.create({
                subject: newMessageSubject,
                content: newMessageContent,
                type: "TeamToAdmin",
                senderUserId: userInfo.id,
                teamMemberId: teamMemberInfo?.id
            });
            
            setNewMessageSubject("");
            setNewMessageContent("");
            await fetchMessages();
            alert('Message sent to admin successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading communication...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Communication</h1>
                <p className="text-slate-400">Message admin and view notifications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Message Admin & Notifications */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Message Admin Section */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Message Admin
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-slate-300 text-sm mb-2 block">Subject</label>
                                <input
                                    type="text"
                                    value={newMessageSubject}
                                    onChange={(e) => setNewMessageSubject(e.target.value)}
                                    placeholder="Message subject..."
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-slate-300 text-sm mb-2 block">Message</label>
                                <textarea
                                    value={newMessageContent}
                                    onChange={(e) => setNewMessageContent(e.target.value)}
                                    placeholder="Type your message to admin..."
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleSendMessageToAdmin}
                                disabled={!newMessageSubject.trim() || !newMessageContent.trim() || sendingMessage}
                                className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                                {sendingMessage ? "Sending..." : "Send to Admin"}
                            </button>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Bell size={20} />
                                Notifications
                            </h2>
                            {unreadCount > 0 && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className="mx-auto text-slate-500 mb-2" size={24} />
                                    <p className="text-slate-400 text-sm">No notifications</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                                            notification.read
                                                ? 'bg-slate-700/30 hover:bg-slate-700/50'
                                                : 'bg-blue-900/30 border border-blue-700/50 hover:bg-blue-900/40'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Bell
                                                size={18}
                                                className={`mt-0.5 flex-shrink-0 ${notification.read ? 'text-slate-400' : 'text-blue-500'}`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${notification.read ? 'text-slate-300' : 'text-white font-medium'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {formatTimeAgo(new Date(notification.createdAt))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Conversations */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Conversations
                        </h2>
                        
                        {messagesToAdmin.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="mx-auto text-slate-500 mb-4" size={48} />
                                <p className="text-slate-400 mb-2">No conversations yet</p>
                                <p className="text-slate-500 text-sm">Send a message to admin to start a conversation</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                                {messagesToAdmin.map((message) => {
                                    // Find replies for this message
                                    const messageReplies = adminReplies.filter(r => r.parentMessageId === message.id);
                                    return (
                                        <div key={message.id} className="border border-slate-700/50 rounded-xl p-5 bg-slate-700/20 hover:bg-slate-700/30 transition-colors">
                                            {/* Original Message */}
                                            <div className="mb-4 pb-4 border-b border-slate-700/50">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-semibold text-sm">You</span>
                                                        <span className="text-slate-400 text-xs">•</span>
                                                        <span className="text-slate-400 text-xs">
                                                            {formatDate(message.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-200 text-sm font-medium mb-2">{message.subject}</p>
                                                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                            </div>
                                            
                                            {/* Replies */}
                                            {messageReplies.length > 0 ? (
                                                <div className="space-y-3">
                                                    {messageReplies.map((reply) => (
                                                        <div key={reply.id} className="pl-4 border-l-4 border-l-emerald-500 bg-slate-700/40 rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-emerald-400 font-semibold text-sm">Admin</span>
                                                                    <span className="text-slate-400 text-xs">•</span>
                                                                    <span className="text-slate-400 text-xs">
                                                                        {formatDate(reply.createdAt)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-3">
                                                    <p className="text-slate-500 text-xs italic">Waiting for admin reply...</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
}
