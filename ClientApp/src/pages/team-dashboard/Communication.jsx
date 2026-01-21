import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    MessageSquare,
    Bell,
    AtSign,
    Paperclip,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search
} from "lucide-react";
import { tasksAPI } from "../../services/api";
import { generateMockTasks, generateMockComments, generateMockNotifications } from "../../services/mockData";

export default function Communication() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [notifications, setNotifications] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            if (!userInfo || !userInfo.id) {
                console.warn("User info not available");
                setLoading(false);
                return;
            }
            
            // TODO: Replace with real API call when backend is ready
            // const tasksResponse = await tasksAPI.getMyTasks();
            
            // Use mock data for now
            const userTasks = generateMockTasks(userInfo.id, teamMemberInfo?.role);
            setTasks(userTasks);

            // Get mock notifications and comments
            const mockNotifications = generateMockNotifications();
            const mockComments = generateMockComments(userTasks);
            
            setNotifications(mockNotifications);
            setComments(mockComments);
        } catch (error) {
            console.error("Error fetching communication data:", error);
            // Set empty arrays on error to prevent blank page
            setTasks([]);
            setNotifications([]);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = (notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const handleSendComment = () => {
        if (!newComment.trim() || !selectedTask) return;

        const comment = {
            id: `new-${Date.now()}`,
            taskId: selectedTask.id,
            taskTitle: selectedTask.title,
            author: userInfo.firstName || 'You',
            message: newComment,
            createdAt: new Date(),
            mentions: extractMentions(newComment)
        };

        setComments(prev => [comment, ...prev]);
        setNewComment("");
    };

    const extractMentions = (text) => {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        while ((match = mentionRegex.exec(text)) !== null) {
            mentions.push(match[1]);
        }
        return mentions;
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
            <div>
                <h1 className="text-3xl font-bold text-white">Communication</h1>
                <p className="text-slate-400 mt-1">Task comments, discussions, and notifications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notifications Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Notifications</h2>
                            {unreadCount > 0 && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="text-slate-400 text-sm">No notifications</p>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                            notification.read
                                                ? 'bg-slate-700/30'
                                                : 'bg-blue-900/30 border border-blue-700/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <Bell
                                                size={16}
                                                className={`mt-1 ${notification.read ? 'text-slate-400' : 'text-blue-600'}`}
                                            />
                                            <div className="flex-1">
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

                {/* Comments Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Task Comments</h2>

                        {/* Task Selector */}
                        <div className="mb-4">
                            <select
                                value={selectedTask?.id || ""}
                                onChange={(e) => {
                                    const task = tasks.find(t => t.id === parseInt(e.target.value));
                                    setSelectedTask(task);
                                }}
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Select a task...</option>
                                {tasks.map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTask && (
                            <>
                                {/* Comments List */}
                                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                                    {comments
                                        .filter(c => c.taskId === selectedTask.id)
                                        .length === 0 ? (
                                        <p className="text-slate-400 text-sm text-center py-8">No comments yet for this task</p>
                                    ) : (
                                        comments
                                            .filter(c => c.taskId === selectedTask.id)
                                            .map(comment => (
                                            <div
                                                key={comment.id}
                                                className="p-4 bg-slate-700/30 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-white">
                                                            {comment.author}
                                                        </span>
                                                        {comment.mentions.length > 0 && (
                                                            <span className="text-xs text-blue-400 flex items-center gap-1">
                                                                <AtSign size={12} />
                                                                {comment.mentions.join(', ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400">
                                                        {formatTimeAgo(new Date(comment.createdAt))}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 whitespace-pre-wrap">
                                                    {comment.message}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add Comment */}
                                <div className="border-t border-slate-700/50 pt-4">
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment... Use @ to mention someone"
                                                rows={3}
                                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg">
                                                    <Paperclip size={18} />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg">
                                                    <AtSign size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSendComment}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                                        >
                                            <Send size={18} />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
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
