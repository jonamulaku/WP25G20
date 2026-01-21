import { useState } from "react";
import { Search, Send, Paperclip, AtSign, CheckCircle2, Smile, MessageSquare, Filter } from "lucide-react";

export default function Messages() {
    const [selectedConversation, setSelectedConversation] = useState(0);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [campaignFilter, setCampaignFilter] = useState("all");

    const conversations = [
        {
            id: 0,
            name: "General Channel",
            type: "general",
            lastMessage: "Thanks for the update on the campaign progress.",
            lastMessageTime: "2 hours ago",
            unread: 2,
            messages: [
                { id: 1, sender: "Agency Team", content: "Hello! Just wanted to update you on the campaign progress.", timestamp: "2025-01-17T10:00:00", type: "text", read: true },
                { id: 2, sender: "You", content: "Thanks for the update!", timestamp: "2025-01-17T10:15:00", type: "text", read: true },
                { id: 3, sender: "Agency Team", content: "We've completed the design phase. Ready for your review.", timestamp: "2025-01-17T12:00:00", type: "text", read: true },
                { id: 4, sender: "Agency Team", content: "New approval item added: Social Media Post - Instagram", timestamp: "2025-01-17T14:00:00", type: "system", read: false },
                { id: 5, sender: "Agency Team", content: "Please review when you have a moment.", timestamp: "2025-01-17T14:05:00", type: "text", read: false }
            ]
        },
        {
            id: 1,
            name: "Q1 Social Media Campaign",
            type: "campaign",
            campaign: "Q1 Social Media Campaign",
            lastMessage: "The new creative assets are ready for review.",
            lastMessageTime: "1 day ago",
            unread: 0,
            messages: [
                { id: 1, sender: "Agency Team", content: "Hi! We're starting work on the Q1 Social Media Campaign.", timestamp: "2025-01-10T09:00:00", type: "text", read: true },
                { id: 2, sender: "You", content: "Great! Looking forward to seeing the creative concepts.", timestamp: "2025-01-10T09:30:00", type: "text", read: true },
                { id: 3, sender: "Agency Team", content: "The new creative assets are ready for review.", timestamp: "2025-01-16T15:00:00", type: "text", read: true }
            ]
        },
        {
            id: 2,
            name: "Brand Awareness Campaign",
            type: "campaign",
            campaign: "Brand Awareness Campaign",
            lastMessage: "Campaign performance report attached.",
            lastMessageTime: "3 days ago",
            unread: 0,
            messages: [
                { id: 1, sender: "Agency Team", content: "Campaign performance report attached.", timestamp: "2025-01-14T11:00:00", type: "file", fileName: "campaign-report.pdf", read: true }
            ]
        }
    ];

    const currentConversation = conversations[selectedConversation];
    const filteredConversations = conversations.filter(conv => {
        const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCampaign = campaignFilter === "all" || (campaignFilter === "campaign" && conv.type === "campaign") || (campaignFilter === "general" && conv.type === "general");
        return matchesSearch && matchesCampaign;
    });

    const sendMessage = () => {
        if (!message.trim()) return;
        
        // TODO: Implement API call to send message
        const newMessage = {
            id: currentConversation.messages.length + 1,
            sender: "You",
            content: message,
            timestamp: new Date().toISOString(),
            type: "text",
            read: false
        };
        
        // In a real app, this would be handled by state management or API
        setMessage("");
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(hours / 24);

        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                <p className="text-slate-400">Communicate with your agency team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
                {/* Conversations List */}
                <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
                    {/* Search and Filter */}
                    <div className="p-4 border-b border-slate-700/50 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                            />
                        </div>
                        <select
                            value={campaignFilter}
                            onChange={(e) => setCampaignFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="campaign">Campaigns</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation.id)}
                                className={`w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-all ${
                                    selectedConversation === conversation.id ? "bg-emerald-600/20 border-emerald-500/30" : ""
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-white font-semibold text-sm">{conversation.name}</h3>
                                    {conversation.unread > 0 && (
                                        <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5">
                                            {conversation.unread}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-xs truncate mb-1">{conversation.lastMessage}</p>
                                <p className="text-slate-500 text-xs">{conversation.lastMessageTime}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-700/50">
                        <h2 className="text-lg font-bold text-white">{currentConversation.name}</h2>
                        {currentConversation.type === "campaign" && (
                            <p className="text-slate-400 text-sm">{currentConversation.campaign}</p>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {currentConversation.messages.map((msg) => {
                            const isYou = msg.sender === "You";
                            const isSystem = msg.type === "system";
                            
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isYou ? "justify-end" : "justify-start"} ${isSystem ? "justify-center" : ""}`}
                                >
                                    <div className={`max-w-[70%] ${isSystem ? "w-full" : ""}`}>
                                        {!isSystem && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-medium ${isYou ? "text-emerald-400" : "text-blue-400"}`}>
                                                    {msg.sender}
                                                </span>
                                                <span className="text-slate-500 text-xs">{formatTimestamp(msg.timestamp)}</span>
                                                {isYou && msg.read && (
                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                )}
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-2xl p-4 ${
                                                isSystem
                                                    ? "bg-slate-700/30 text-slate-400 text-center text-sm"
                                                    : isYou
                                                    ? "bg-emerald-600/20 text-white border border-emerald-500/30"
                                                    : "bg-slate-700/50 text-white"
                                            }`}
                                        >
                                            {msg.type === "file" ? (
                                                <div className="flex items-center gap-2">
                                                    <Paperclip size={16} />
                                                    <span>{msg.fileName}</span>
                                                </div>
                                            ) : (
                                                <p>{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-slate-700/50">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 bg-slate-700/50 rounded-xl p-2 border border-slate-600/50">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                                    className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none max-h-32"
                                    rows={2}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                                        title="Attach file"
                                    >
                                        <Paperclip size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                                        title="Mention @admin"
                                    >
                                        <AtSign size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all"
                                        title="Add reaction"
                                    >
                                        <Smile size={18} />
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send size={20} />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
