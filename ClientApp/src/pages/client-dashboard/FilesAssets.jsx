import { useState } from "react";
import { Search, Folder, File, Download, Upload, Eye, Image, FileText, Video, ChevronRight, ChevronDown } from "lucide-react";

export default function FilesAssets() {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(["Brand Assets"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const folders = [
        { id: 1, name: "Brand Assets", files: 12 },
        { id: 2, name: "Campaign Assets", files: 28 },
        { id: 3, name: "Reports", files: 8 },
        { id: 4, name: "Contracts", files: 5 }
    ];

    const allFiles = [
        { id: 1, name: "logo.png", type: "image", folder: "Brand Assets", uploadedBy: "Agency Team", date: "2025-01-10", size: "2.5 MB", url: "https://via.placeholder.com/800x600" },
        { id: 2, name: "brand-guidelines.pdf", type: "pdf", folder: "Brand Assets", uploadedBy: "Agency Team", date: "2025-01-10", size: "5.2 MB", url: "https://via.placeholder.com/800x600" },
        { id: 3, name: "campaign-video.mp4", type: "video", folder: "Campaign Assets", uploadedBy: "Agency Team", date: "2025-01-12", size: "45.8 MB", url: "https://via.placeholder.com/800x600" },
        { id: 4, name: "monthly-report.pdf", type: "pdf", folder: "Reports", uploadedBy: "Agency Team", date: "2025-01-15", size: "3.1 MB", url: "https://via.placeholder.com/800x600" },
        { id: 5, name: "campaign-banner.jpg", type: "image", folder: "Campaign Assets", uploadedBy: "Agency Team", date: "2025-01-13", size: "1.8 MB", url: "https://via.placeholder.com/800x600" },
        { id: 6, name: "service-agreement.pdf", type: "pdf", folder: "Contracts", uploadedBy: "Agency Team", date: "2025-01-05", size: "2.3 MB", url: "https://via.placeholder.com/800x600" },
        { id: 7, name: "social-media-assets.zip", type: "archive", folder: "Campaign Assets", uploadedBy: "Agency Team", date: "2025-01-14", size: "12.5 MB", url: "https://via.placeholder.com/800x600" },
        { id: 8, name: "Q1-analytics.pdf", type: "pdf", folder: "Reports", uploadedBy: "Agency Team", date: "2025-01-16", size: "4.2 MB", url: "https://via.placeholder.com/800x600" }
    ];

    const filteredFiles = allFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFolder = !selectedFolder || file.folder === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    const toggleFolder = (folderName) => {
        setExpandedFolders(prev => 
            prev.includes(folderName) 
                ? prev.filter(f => f !== folderName)
                : [...prev, folderName]
        );
        if (!selectedFolder || selectedFolder !== folderName) {
            setSelectedFolder(folderName);
        } else {
            setSelectedFolder(null);
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case "image":
                return <Image className="text-blue-400" size={20} />;
            case "pdf":
                return <FileText className="text-red-400" size={20} />;
            case "video":
                return <Video className="text-purple-400" size={20} />;
            default:
                return <File className="text-slate-400" size={20} />;
        }
    };

    const openPreview = (file) => {
        setSelectedFile(file);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setSelectedFile(null);
    };

    const handleDownload = (file) => {
        // TODO: Implement actual download
        console.log("Downloading:", file.name);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Files & Assets</h1>
                    <p className="text-slate-400">Access and manage your campaign files and assets</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Upload size={20} />
                    Upload File
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Folder Structure */}
                <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Folders</h2>
                    <div className="space-y-2">
                        {folders.map((folder) => {
                            const isExpanded = expandedFolders.includes(folder.name);
                            const isSelected = selectedFolder === folder.name;
                            return (
                                <div key={folder.id}>
                                    <button
                                        onClick={() => toggleFolder(folder.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                                            isSelected
                                                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                                : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Folder size={20} />
                                            <span className="font-medium">{folder.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400">{folder.files}</span>
                                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                        <button
                            onClick={() => setSelectedFolder(null)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                !selectedFolder
                                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50"
                            }`}
                        >
                            <Folder size={20} />
                            <span className="font-medium">All Files</span>
                        </button>
                    </div>
                </div>

                {/* Files List */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Files Table */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">File</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Uploaded By</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {filteredFiles.map((file) => (
                                        <tr key={file.id} className="hover:bg-slate-700/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(file.type)}
                                                    <div>
                                                        <p className="text-white font-medium">{file.name}</p>
                                                        <p className="text-slate-400 text-xs">{file.size}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300 capitalize">{file.type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300">{file.uploadedBy}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300">{new Date(file.date).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(file.type === "image" || file.type === "pdf" || file.type === "video") && (
                                                        <button
                                                            onClick={() => openPreview(file)}
                                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                            title="Preview"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDownload(file)}
                                                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                        title="Download"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Preview Modal */}
            {showPreview && selectedFile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{selectedFile.name}</h2>
                            <button
                                onClick={closePreview}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Eye size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {selectedFile.type === "image" && (
                                <div className="flex items-center justify-center bg-slate-900/50 rounded-xl p-8">
                                    <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[600px] rounded-lg" />
                                </div>
                            )}
                            {selectedFile.type === "pdf" && (
                                <div className="flex items-center justify-center bg-slate-900/50 rounded-xl p-8 min-h-[600px]">
                                    <div className="text-center">
                                        <FileText size={64} className="text-red-400 mx-auto mb-4" />
                                        <p className="text-white mb-2">{selectedFile.name}</p>
                                        <p className="text-slate-400 text-sm mb-4">PDF Preview</p>
                                        <button
                                            onClick={() => handleDownload(selectedFile)}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <Download size={20} />
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                            {selectedFile.type === "video" && (
                                <div className="flex items-center justify-center bg-slate-900/50 rounded-xl p-8 min-h-[600px]">
                                    <div className="text-center">
                                        <Video size={64} className="text-purple-400 mx-auto mb-4" />
                                        <p className="text-white mb-2">{selectedFile.name}</p>
                                        <p className="text-slate-400 text-sm mb-4">Video Preview</p>
                                        <button
                                            onClick={() => handleDownload(selectedFile)}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <Download size={20} />
                                            Download Video
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
