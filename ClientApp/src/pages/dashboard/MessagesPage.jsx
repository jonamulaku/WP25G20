import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Mail, User, Calendar, Filter, X, CheckCircle2, Archive, MessageSquare, Send, Reply } from "lucide-react";
import { messagesAPI, authAPI } from "../../services/api";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("contact"); // "contact", "team", or "client"
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replying, setReplying] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0
    });

    useEffect(() => {
        fetchMessages();
    }, [statusFilter, activeTab, pagination.pageNumber]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const filter = {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                type: activeTab === "contact" ? "ContactForm" : activeTab === "team" ? "TeamToAdmin" : "ClientToAdmin",
                status: statusFilter !== "all" ? statusFilter : undefined,
                searchTerm: searchTerm || undefined
            };
            const response = await messagesAPI.getAll(filter);
            setMessages(response.items || []);
            setPagination(prev => ({
                ...prev,
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0
            }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('Failed to fetch messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, pageNumber: 1 }));
        // fetchMessages will be called automatically by useEffect when pagination.pageNumber changes
        // But we need to trigger it manually here since searchTerm changed
        fetchMessages();
    };

    const handleViewMessage = async (message) => {
        // Fetch full message with replies
        try {
            const fullMessage = await messagesAPI.getById(message.id);
            setSelectedMessage(fullMessage);
            setShowDetailModal(true);
            
            // Mark as read if unread
            if (fullMessage.status === "Unread") {
                try {
                    await messagesAPI.update(fullMessage.id, { status: "Read" });
                    // Update local state
                    setMessages(prev => prev.map(m => 
                        m.id === fullMessage.id ? { ...m, status: "Read", readAt: new Date().toISOString() } : m
                    ));
                    setSelectedMessage({ ...fullMessage, status: "Read", readAt: new Date().toISOString() });
                } catch (error) {
                    console.error('Error marking message as read:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching message details:', error);
            // Fallback to using the message from list
            setSelectedMessage(message);
            setShowDetailModal(true);
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim() || !selectedMessage) return;
        
        // Validate that we have a recipient for team/client messages
        if ((activeTab === "team" || activeTab === "client") && !selectedMessage.senderUserId) {
            alert('Cannot reply: No recipient user found for this message.');
            return;
        }
        
        try {
            setReplying(true);
            
            // For TeamToAdmin/ClientToAdmin messages, the recipient of the reply should be the sender of the original message
            // The admin's userId will be automatically extracted from the JWT token in the backend
            const replyData = {
                subject: `Re: ${selectedMessage.subject}`,
                content: replyContent,
                type: activeTab === "team" ? "AdminToTeam" : activeTab === "client" ? "AdminToClient" : "AdminToClient",
                parentMessageId: selectedMessage.id,
                recipientUserId: selectedMessage.senderUserId // The team member/client who sent the original message
            };
            
            const reply = await messagesAPI.create(replyData);
            
            // Update the original message status to Replied
            await messagesAPI.update(selectedMessage.id, { status: "Replied" });
            
            // Refresh messages and selected message
            await fetchMessages();
            const updatedMessage = await messagesAPI.getById(selectedMessage.id);
            setSelectedMessage(updatedMessage);
            setReplyContent("");
            
            const recipientType = activeTab === "team" ? "team member" : "client";
            alert(`Reply sent successfully! The ${recipientType} will see your reply.`);
        } catch (error) {
            console.error('Error sending reply:', error);
            const errorMessage = error.message || 'Failed to send reply. Please try again.';
            alert(errorMessage);
        } finally {
            setReplying(false);
        }
    };

    const handleMarkAsRead = async (message) => {
        try {
            await messagesAPI.update(message.id, { status: "Read" });
            setMessages(prev => prev.map(m => 
                m.id === message.id ? { ...m, status: "Read", readAt: new Date().toISOString() } : m
            ));
            if (selectedMessage?.id === message.id) {
                setSelectedMessage({ ...selectedMessage, status: "Read", readAt: new Date().toISOString() });
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
            alert('Failed to mark message as read. Please try again.');
        }
    };

    const handleArchive = async (message) => {
        try {
            await messagesAPI.update(message.id, { status: "Archived" });
            setMessages(prev => prev.map(m => 
                m.id === message.id ? { ...m, status: "Archived" } : m
            ));
            if (selectedMessage?.id === message.id) {
                setSelectedMessage({ ...selectedMessage, status: "Archived" });
            }
        } catch (error) {
            console.error('Error archiving message:', error);
            alert('Failed to archive message. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) {
            return;
        }
        try {
            await messagesAPI.delete(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) {
                setShowDetailModal(false);
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message. Please try again.');
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

    const getStatusBadge = (status) => {
        const badges = {
            Unread: "bg-blue-500/20 text-blue-400 border-blue-500/30",
            Read: "bg-slate-500/20 text-slate-400 border-slate-500/30",
            Replied: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            Archived: "bg-amber-500/20 text-amber-400 border-amber-500/30"
        };
        return badges[status] || badges.Read;
    };

    // Messages are already filtered by the API
    const filteredMessages = messages;

    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                    <p className="text-slate-400">View and manage messages from contact form, team members, and clients</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setActiveTab("contact");
                            setPagination(prev => ({ ...prev, pageNumber: 1 }));
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === "contact"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                        }`}
                    >
                        Contact Form Messages
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("team");
                            setPagination(prev => ({ ...prev, pageNumber: 1 }));
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === "team"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                        }`}
                    >
                        Team Messages
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("client");
                            setPagination(prev => ({ ...prev, pageNumber: 1 }));
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === "client"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                        }`}
                    >
                        Client Messages
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search messages by subject, content, sender name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPagination(prev => ({ ...prev, pageNumber: 1 }));
                            }}
                            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                            <option value="all">All Status</option>
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                        >
                            <Search size={18} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageSquare className="mx-auto text-slate-500 mb-4" size={48} />
                        <p className="text-slate-400 text-lg">No messages found</p>
                        <p className="text-slate-500 text-sm mt-2">
                            {activeTab === "contact" 
                                ? "Messages from the contact form will appear here"
                                : activeTab === "team"
                                ? "Messages from team members will appear here"
                                : "Messages from clients (approvals, inquiries, etc.) will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700/50">
                        {filteredMessages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`p-6 hover:bg-slate-700/20 transition-colors cursor-pointer ${
                                    message.status === "Unread" ? "bg-slate-700/10 border-l-4 border-l-blue-500" : ""
                                }`}
                                onClick={() => handleViewMessage(message)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-white font-semibold text-lg truncate">
                                                {message.subject}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(message.status)}`}>
                                                {message.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                                            {message.content}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <User size={14} />
                                                <span>{message.senderName || message.senderUserName || message.teamMemberName || "Unknown"}</span>
                                            </div>
                                            {message.senderEmail && (
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} />
                                                    <span>{message.senderEmail}</span>
                                                </div>
                                            )}
                                            {message.replyCount > 0 && (
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <Reply size={14} />
                                                    <span>{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                <span>{formatDate(message.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        {message.status === "Unread" && (
                                            <button
                                                onClick={() => handleMarkAsRead(message)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                title="Mark as Read"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                        )}
                                        {message.status !== "Archived" && (
                                            <button
                                                onClick={() => handleArchive(message)}
                                                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                title="Archive"
                                            >
                                                <Archive size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
                    <div className="text-slate-400 text-sm">
                        Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} to {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} messages
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))}
                            disabled={pagination.pageNumber === 1}
                            className="px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <span className="text-slate-400 text-sm px-4">
                            Page {pagination.pageNumber} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))}
                            disabled={pagination.pageNumber >= pagination.totalPages}
                            className="px-4 py-2 bg-slate-700/50 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            {showDetailModal && selectedMessage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Message Details</h2>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedMessage(null);
                                }}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Header Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-400 text-sm font-medium">Subject</label>
                                    <h3 className="text-white text-xl font-semibold mt-1">{selectedMessage.subject}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedMessage.status)}`}>
                                        {selectedMessage.status}
                                    </span>
                                    <span className="text-slate-500 text-sm">
                                        {formatDate(selectedMessage.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Sender Info */}
                            <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                                <h4 className="text-slate-300 font-semibold mb-3">
                                    {activeTab === "team" ? "Team Member Information" : activeTab === "client" ? "Client Information" : "Sender Information"}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-400 text-sm">Name</label>
                                        <p className="text-white mt-1">
                                            {selectedMessage.senderName || selectedMessage.senderUserName || selectedMessage.teamMemberName || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm">Email</label>
                                        <p className="text-white mt-1">{selectedMessage.senderEmail || "N/A"}</p>
                                    </div>
                                    {(activeTab === "team" || activeTab === "client") && selectedMessage.teamMemberName && (
                                        <div>
                                            <label className="text-slate-400 text-sm">Role</label>
                                            <p className="text-white mt-1">{selectedMessage.teamMemberName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div>
                                <label className="text-slate-400 text-sm font-medium">Message</label>
                                <div className="mt-2 p-4 bg-slate-700/30 rounded-xl text-white whitespace-pre-wrap">
                                    {selectedMessage.content}
                                </div>
                            </div>

                            {/* Replies Thread */}
                            {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                                <div>
                                    <label className="text-slate-400 text-sm font-medium mb-2 block">Replies</label>
                                    <div className="space-y-3">
                                        {selectedMessage.replies.map((reply) => (
                                            <div key={reply.id} className="p-4 bg-slate-700/20 rounded-xl border-l-4 border-l-emerald-500">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium text-sm">
                                                        {reply.senderUserName || "Admin"}
                                                    </span>
                                                    <span className="text-slate-400 text-xs">
                                                        {formatDate(reply.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 text-sm whitespace-pre-wrap">
                                                    {reply.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reply Section (only for team/client messages that have a senderUserId) */}
                            {(activeTab === "team" || activeTab === "client") && selectedMessage.senderUserId && (
                                <div className="border-t border-slate-700/50 pt-4">
                                    <label className="text-slate-400 text-sm font-medium mb-2 block">Reply</label>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Type your reply..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                    />
                                    <button
                                        onClick={handleReply}
                                        disabled={!replyContent.trim() || replying}
                                        className="mt-3 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={18} />
                                        {replying ? "Sending..." : "Send Reply"}
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
                                {selectedMessage.status === "Unread" && (
                                    <button
                                        onClick={() => handleMarkAsRead(selectedMessage)}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Mark as Read
                                    </button>
                                )}
                                {selectedMessage.status !== "Archived" && (
                                    <button
                                        onClick={() => handleArchive(selectedMessage)}
                                        className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all flex items-center gap-2"
                                    >
                                        <Archive size={18} />
                                        Archive
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
