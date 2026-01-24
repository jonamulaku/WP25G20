import { useState, useEffect } from "react";
import { Search, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { messagesAPI, campaignsAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function Messages() {
    const { userInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch campaigns
            const campaignsResponse = await campaignsAPI.getAll({ pageSize: 1000 });
            const campaignsData = campaignsResponse.items || [];
            setCampaigns(campaignsData);
            
            // Fetch all messages for this client (no type filter to get both ClientToAdmin and AdminToClient)
            // Also fetch AdminToClient messages specifically to ensure replies are included
            const allMessagesResponse = await messagesAPI.getAll({ 
                pageSize: 1000 
            });
            const adminToClientResponse = await messagesAPI.getAll({ 
                type: "AdminToClient",
                pageSize: 1000 
            });
            
            // Combine all messages and remove duplicates
            const allFetchedMessages = [
                ...(allMessagesResponse.items || []),
                ...(adminToClientResponse.items || [])
            ];
            
            // Remove duplicates by ID
            const uniqueMessages = Array.from(
                new Map(allFetchedMessages.map(msg => [msg.id, msg])).values()
            );
            
            // Filter messages for this client - messages where they are sender/recipient or belong to their campaigns
            const clientCampaignIds = campaignsData.map(c => c.id);
            const allMessages = uniqueMessages.filter(msg => {
                // Messages where client is sender or recipient
                if (msg.senderUserId === userInfo?.id || msg.recipientUserId === userInfo?.id) {
                    return true;
                }
                // AdminToClient messages (replies from admin)
                if (msg.type === "AdminToClient") {
                    // Include if it's a reply to a message the client sent
                    if (msg.parentMessageId) {
                        // We'll check this when building threads
                        return true;
                    }
                    // Or if client is the recipient
                    if (msg.recipientUserId === userInfo?.id) {
                        return true;
                    }
                }
                // Messages related to client's campaigns
                if (msg.relatedEntityType === "Campaign" && clientCampaignIds.includes(msg.relatedEntityId)) {
                    return true;
                }
                // Messages with clientId matching one of the campaigns
                const campaign = campaignsData.find(c => c.clientId === msg.clientId);
                return !!campaign;
            });
            
            setMessages(allMessages);
            
            // Debug logging
            console.log('Total messages fetched:', allMessages.length);
            console.log('ClientToAdmin messages:', allMessages.filter(m => m.type === 'ClientToAdmin').length);
            console.log('AdminToClient messages:', allMessages.filter(m => m.type === 'AdminToClient').length);
            console.log('Messages with replies:', allMessages.filter(m => m.replies && m.replies.length > 0).length);
            allMessages.filter(m => m.replies && m.replies.length > 0).forEach(m => {
                console.log(`Message ${m.id} has ${m.replies.length} replies:`, m.replies.map(r => ({ id: r.id, type: r.type, content: r.content.substring(0, 50) })));
            });
            
            // Auto-select first campaign with messages if none selected
            if (!selectedCampaignId && campaignsData.length > 0) {
                const campaignWithMessages = campaignsData.find(campaign => 
                    allMessages.some(msg => msg.relatedEntityId === campaign.id || 
                        (msg.relatedEntityType === "Campaign" && msg.clientId === campaign.clientId))
                );
                if (campaignWithMessages) {
                    setSelectedCampaignId(campaignWithMessages.id);
                } else if (campaignsData.length > 0) {
                    setSelectedCampaignId(campaignsData[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCampaignMessages = (campaignId) => {
        if (!campaignId) return [];
        
        // Get all messages related to this campaign (directly or through tasks)
        const campaignMessages = messages.filter(msg => {
            // Direct campaign messages
            if (msg.relatedEntityType === "Campaign" && msg.relatedEntityId === campaignId) {
                return true;
            }
            // Task messages for this campaign's tasks
            if (msg.relatedEntityType === "Task") {
                const campaign = campaigns.find(c => c.id === campaignId);
                if (campaign) {
                    // We'd need to check if task belongs to campaign, but for now just check clientId
                    return msg.clientId === campaign.clientId;
                }
            }
            return false;
        });
        
        // Also include replies that are nested in parent messages
        const allReplies = [];
        campaignMessages.forEach(msg => {
            if (msg.replies && msg.replies.length > 0) {
                allReplies.push(...msg.replies);
            }
        });
        
        // Combine campaign messages with nested replies, removing duplicates
        const allCampaignMessages = [
            ...campaignMessages,
            ...allReplies.filter(reply => !campaignMessages.some(m => m.id === reply.id))
        ];
        
        // Build conversation threads (parent messages with their replies)
        const threads = [];
        const processedIds = new Set();
        
        allCampaignMessages.forEach(msg => {
            if (processedIds.has(msg.id)) return;
            
            // If this is a reply, find the parent
            if (msg.parentMessageId) {
                const parent = allCampaignMessages.find(m => m.id === msg.parentMessageId);
                if (parent) {
                    if (!processedIds.has(parent.id)) {
                        // Get all replies for this parent (from flat list and nested)
                        const flatReplies = allCampaignMessages.filter(m => m.parentMessageId === parent.id);
                        const nestedReplies = parent.replies || [];
                        const allRepliesForParent = [
                            ...flatReplies,
                            ...nestedReplies.filter(r => !flatReplies.some(fr => fr.id === r.id))
                        ];
                        
                        threads.push({
                            ...parent,
                            replies: allRepliesForParent
                        });
                        processedIds.add(parent.id);
                        allRepliesForParent.forEach(r => processedIds.add(r.id));
                    }
                    return;
                }
            }
            
            // This is a parent message
            // Get all replies (from flat list and nested)
            const flatReplies = allCampaignMessages.filter(m => m.parentMessageId === msg.id);
            const nestedReplies = msg.replies || [];
            const allRepliesForMsg = [
                ...flatReplies,
                ...nestedReplies.filter(r => !flatReplies.some(fr => fr.id === r.id))
            ];
            
            threads.push({
                ...msg,
                replies: allRepliesForMsg
            });
            processedIds.add(msg.id);
            allRepliesForMsg.forEach(r => processedIds.add(r.id));
        });
        
        // Sort by creation date (newest first)
        return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const sendMessage = async () => {
        if (!message.trim() || !selectedCampaignId) return;
        
        try {
            setSending(true);
            const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
            
            await messagesAPI.create({
                subject: `Message regarding ${selectedCampaign?.name || 'campaign'}`,
                content: message,
                type: "ClientToAdmin",
                senderName: userInfo?.firstName && userInfo?.lastName 
                    ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
                    : userInfo?.email || "Client",
                senderEmail: userInfo?.email,
                clientId: selectedCampaign?.clientId,
                relatedEntityId: selectedCampaignId,
                relatedEntityType: "Campaign"
            });
            
            setMessage("");
            await fetchData();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Just now";
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

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    const conversationThreads = selectedCampaignId ? getCampaignMessages(selectedCampaignId) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                <p className="text-slate-400">Communicate with your agency team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
                {/* Campaigns List */}
                <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-slate-700/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Campaigns */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredCampaigns.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                No campaigns found
                            </div>
                        ) : (
                            filteredCampaigns.map((campaign) => {
                                const campaignMessages = getCampaignMessages(campaign.id);
                                const unreadCount = campaignMessages.reduce((count, thread) => {
                                    const hasUnread = thread.replies?.some(reply => 
                                        reply.recipientUserId === userInfo?.id && 
                                        reply.status === "Unread"
                                    ) || (thread.recipientUserId === userInfo?.id && thread.status === "Unread");
                                    return count + (hasUnread ? 1 : 0);
                                }, 0);

                                return (
                                    <button
                                        key={campaign.id}
                                        onClick={() => setSelectedCampaignId(campaign.id)}
                                        className={`w-full p-4 border-b border-slate-700/50 text-left hover:bg-slate-700/30 transition-all ${
                                            selectedCampaignId === campaign.id ? "bg-emerald-600/20 border-emerald-500/30" : ""
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-white font-semibold text-sm truncate">{campaign.name}</h3>
                                            {unreadCount > 0 && (
                                                <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        {campaignMessages.length > 0 && (
                                            <p className="text-slate-400 text-xs truncate mb-1">
                                                {campaignMessages.length} conversation{campaignMessages.length !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
                    {selectedCampaign ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-700/50">
                                <h2 className="text-lg font-bold text-white">{selectedCampaign.name}</h2>
                                <p className="text-slate-400 text-sm">{selectedCampaign.description || 'Campaign messages'}</p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {conversationThreads.length === 0 ? (
                                    <div className="text-center text-slate-400 py-8">
                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No messages yet for this campaign.</p>
                                        <p className="text-sm mt-2">Start a conversation by sending a message below.</p>
                                    </div>
                                ) : (
                                    conversationThreads.map((thread) => {
                                        const isFromClient = thread.type === "ClientToAdmin" || thread.senderUserId === userInfo?.id;
                                        
                                        return (
                                            <div key={thread.id} className="border border-slate-700/50 rounded-xl p-5 bg-slate-700/20 hover:bg-slate-700/30 transition-colors">
                                                {/* Original Message */}
                                                <div className="mb-4 pb-4 border-b border-slate-700/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white font-semibold text-sm">
                                                                {isFromClient ? "You" : (thread.senderName || "Admin")}
                                                            </span>
                                                            <span className="text-slate-400 text-xs">•</span>
                                                            <span className="text-slate-400 text-xs">
                                                                {formatTimestamp(thread.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-200 text-sm font-medium mb-2">{thread.subject}</p>
                                                    <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{thread.content}</p>
                                                </div>
                                                
                                                {/* Replies */}
                                                {thread.replies && thread.replies.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {thread.replies
                                                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                                            .map((reply) => {
                                                                const isFromClientReply = reply.type === "ClientToAdmin" || reply.senderUserId === userInfo?.id;
                                                                
                                                                return (
                                                                    <div key={reply.id} className="pl-4 border-l-4 border-l-emerald-500 bg-slate-700/40 rounded-lg p-4">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-emerald-400 font-semibold text-sm">
                                                                                    {isFromClientReply ? "You" : (reply.senderName || "Admin")}
                                                                                </span>
                                                                                <span className="text-slate-400 text-xs">•</span>
                                                                                <span className="text-slate-400 text-xs">
                                                                                    {formatTimestamp(reply.createdAt)}
                                                                                </span>
                                                                                {reply.status === "Read" && !isFromClientReply && (
                                                                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-3">
                                                        <p className="text-slate-500 text-xs italic">Waiting for admin reply...</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
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
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={!message.trim() || sending}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Send size={20} />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-slate-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a campaign to view messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
