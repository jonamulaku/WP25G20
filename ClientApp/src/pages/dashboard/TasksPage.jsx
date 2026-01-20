import { useState } from "react";
import { Plus, Search, CheckCircle2, Clock, AlertCircle, User } from "lucide-react";

export default function TasksPage() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Design Logo", assignee: "John Doe", dueDate: "2025-01-25", status: "In Progress", priority: "High" },
        { id: 2, title: "Create Social Media Posts", assignee: "Jane Smith", dueDate: "2025-01-24", status: "Pending", priority: "Medium" },
        { id: 3, title: "Analytics Report", assignee: "Mike Johnson", dueDate: "2025-01-23", status: "Overdue", priority: "High" },
        { id: 4, title: "Client Meeting Prep", assignee: "Sarah Wilson", dueDate: "2025-01-26", status: "Completed", priority: "Low" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle2 className="text-emerald-400" size={20} />;
            case "In Progress":
                return <Clock className="text-blue-400" size={20} />;
            case "Overdue":
                return <AlertCircle className="text-red-400" size={20} />;
            default:
                return <Clock className="text-amber-400" size={20} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
                    <p className="text-slate-400">Track and manage tasks across all campaigns</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Create Task
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="mt-1">
                                    {getStatusIcon(task.status)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-lg mb-2">{task.title}</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <User size={16} />
                                            {task.assignee}
                                        </div>
                                        <div className="text-slate-400">
                                            Due: {task.dueDate}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            task.priority === "High"
                                                ? "bg-red-500/20 text-red-400"
                                                : task.priority === "Medium"
                                                ? "bg-amber-500/20 text-amber-400"
                                                : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task.status === "Completed"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : task.status === "In Progress"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : task.status === "Overdue"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-amber-500/20 text-amber-400"
                            }`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
