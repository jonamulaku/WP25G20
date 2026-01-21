import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    FolderOpen,
    Upload,
    Download,
    Eye,
    FileText,
    Image,
    Video,
    File,
    Search,
    Filter,
    MoreVertical,
    ArrowUpDown,
    Calendar,
    FileDown
} from "lucide-react";
import { tasksAPI } from "../../services/api";

export default function FilesAssets() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, size
    const [loading, setLoading] = useState(true);

    const role = teamMemberInfo?.role || "";
    const canUpload = role.toLowerCase().includes('designer') || 
                     role.toLowerCase().includes('graphic') ||
                     role.toLowerCase().includes('manager') ||
                     role.toLowerCase().includes('campaign');
    const canUploadLimited = role.toLowerCase().includes('marketer') || 
                            role.toLowerCase().includes('marketing');
    const canEdit = canUpload;
    const canApprove = role.toLowerCase().includes('manager') || 
                      role.toLowerCase().includes('campaign');

    useEffect(() => {
        fetchFiles();
    }, [userInfo]);

    useEffect(() => {
        let filtered = [...files];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.campaignName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (filterType !== "All") {
            filtered = filtered.filter(file => file.type === filterType);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.uploadedAt) - new Date(a.uploadedAt);
                case "oldest":
                    return new Date(a.uploadedAt) - new Date(b.uploadedAt);
                case "name":
                    return a.name.localeCompare(b.name);
                case "size":
                    return b.size - a.size;
                default:
                    return 0;
            }
        });

        setFilteredFiles(filtered);
    }, [files, searchTerm, filterType, sortBy]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            // Fetch tasks to get associated files
            const tasksResponse = await tasksAPI.getMyTasks();
            const tasks = tasksResponse.items || [];
            
            // Mock file data - in real app, this would come from a files API
            const mockFiles = tasks.flatMap(task => {
                if (task.fileCount > 0) {
                    return Array.from({ length: task.fileCount }, (_, i) => ({
                        id: `${task.id}-${i}`,
                        name: `File ${i + 1} for ${task.title}`,
                        type: i % 3 === 0 ? 'image' : i % 3 === 1 ? 'document' : 'other',
                        size: Math.floor(Math.random() * 5000) + 100, // KB
                        uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                        taskId: task.id,
                        taskTitle: task.title,
                        campaignName: task.campaignName,
                        version: 1,
                        owner: userInfo.email
                    }));
                }
                return [];
            });
            
            setFiles(mockFiles);
            setFilteredFiles(mockFiles);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image':
                return Image;
            case 'video':
                return Video;
            case 'document':
                return FileText;
            default:
                return File;
        }
    };

    const formatFileSize = (sizeInKB) => {
        if (sizeInKB < 1024) return `${sizeInKB} KB`;
        return `${(sizeInKB / 1024).toFixed(2)} MB`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading files...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold text-white">Files & Assets</h1>
                <p className="text-slate-400 mt-1">Manage your files and assets</p>
                </div>
                {(canUpload || canUploadLimited) && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                        <Upload size={18} />
                        <span>{canUploadLimited && !canUpload ? "Upload Content" : "Upload Asset"}</span>
                    </button>
                )}
            </div>

            {/* Filters & Sorting */}
            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search files by name, task, or campaign..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                        />
                    </div>

                    {/* Filters and Sort Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filter by Type */}
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <Filter className="text-slate-400" size={18} />
                                <label className="text-sm font-medium text-slate-300">Filter by Type</label>
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="image">Images</option>
                                <option value="document">Documents</option>
                                <option value="video">Videos</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <ArrowUpDown className="text-slate-400" size={18} />
                                <label className="text-sm font-medium text-slate-300">Sort By</label>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="size">Size (Largest)</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Results</span>
                                    <span className="text-lg font-semibold text-white">{filteredFiles.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(searchTerm || filterType !== "All") && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-700/50">
                            <span className="text-xs text-slate-400">Active filters:</span>
                            {searchTerm && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-xs font-medium">
                                    Search: "{searchTerm}"
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="ml-1 hover:text-emerald-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filterType !== "All" && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
                                    Type: {filterType}
                                    <button
                                        onClick={() => setFilterType("All")}
                                        className="ml-1 hover:text-blue-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {(searchTerm || filterType !== "All") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterType("All");
                                    }}
                                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Files Grid */}
            {filteredFiles.length === 0 ? (
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-12 text-center">
                    <FolderOpen className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-300">No files found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFiles.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                            <div
                                key={file.id}
                                className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-3 bg-slate-700/30 rounded-lg">
                                        <FileIcon className="text-slate-300" size={24} />
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-200">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                                
                                <h3 className="font-medium text-white mb-1 truncate" title={file.name}>
                                    {file.name}
                                </h3>
                                
                                <div className="space-y-1 text-sm text-slate-300 mb-3">
                                    <p>Size: {formatFileSize(file.size)}</p>
                                    <p>Version: {file.version}</p>
                                    <p className="truncate" title={file.taskTitle}>
                                        Task: {file.taskTitle}
                                    </p>
                                    {file.campaignName && (
                                        <p className="truncate" title={file.campaignName}>
                                            Campaign: {file.campaignName}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors">
                                        <Eye size={16} />
                                        Preview
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors">
                                        <Download size={16} />
                                        Download
                                    </button>
                                </div>

                                {canApprove && (
                                    <button className="w-full mt-2 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                        Approve
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
