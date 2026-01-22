import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Settings,
    Bell,
    Moon,
    Sun,
    Globe,
    Save,
    Camera
} from "lucide-react";
import { usersAPI, teamMembersAPI } from "../../services/api";

export default function ProfileSettings() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [profile, setProfile] = useState({
        firstName: teamMemberInfo?.firstName || userInfo.firstName || "",
        lastName: teamMemberInfo?.lastName || userInfo.lastName || "",
        email: userInfo.email || "",
        role: teamMemberInfo?.role || "",
        phone: teamMemberInfo?.phone || "",
        skills: teamMemberInfo?.description?.split(',') || [],
        availability: "Available",
        profilePhoto: null
    });
    const [preferences, setPreferences] = useState({
        notifications: {
            taskAssigned: true,
            feedbackReceived: true,
            deadlineReminders: true,
            statusChanges: true
        },
        defaultDashboardView: "dashboard",
        themeMode: "light",
        language: "en"
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load saved preferences from localStorage
        const savedPrefs = localStorage.getItem('userPreferences');
        if (savedPrefs) {
            try {
                setPreferences(JSON.parse(savedPrefs));
            } catch (e) {
                console.error("Error loading preferences:", e);
            }
        }
    }, []);

    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handlePreferenceChange = (category, field, value) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            // In a real app, this would update the team member profile via API
            // await teamMembersAPI.update(teamMemberInfo.id, profile);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = () => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>
                <p className="text-slate-400 mt-1">Manage your profile and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Profile</h2>

                    {/* Profile Photo */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                            {profile.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">
                                <Camera size={18} />
                                <span>Change Photo</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={profile.role}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Skills
                            </label>
                            <input
                                type="text"
                                value={profile.skills.join(', ')}
                                onChange={(e) => handleProfileChange('skills', e.target.value.split(', ').filter(s => s.trim()))}
                                placeholder="Enter skills separated by commas"
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Availability
                            </label>
                            <select
                                value={profile.availability}
                                onChange={(e) => handleProfileChange('availability', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                                <option value="Away">Away</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>Save Profile</span>
                        </button>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>

                    <div className="space-y-6">
                        {/* Notifications */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <Bell size={20} />
                                Notifications
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(preferences.notifications).map(([key, value]) => (
                                    <label
                                        key={key}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50"
                                    >
                                        <span className="text-sm text-slate-300 capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Default Dashboard View */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-4">Default Dashboard View</h3>
                            <select
                                value={preferences.defaultDashboardView}
                                onChange={(e) => handlePreferenceChange('defaultDashboardView', null, e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="dashboard">Dashboard</option>
                                <option value="tasks">My Tasks</option>
                                <option value="campaigns">Campaigns</option>
                                <option value="performance">Performance</option>
                            </select>
                        </div>

                        {/* Theme Mode */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                {preferences.themeMode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                Theme Mode
                            </h3>
                            <select
                                value={preferences.themeMode}
                                onChange={(e) => handlePreferenceChange('themeMode', null, e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                                <Globe size={20} />
                                Language
                            </h3>
                            <select
                                value={preferences.language}
                                onChange={(e) => handlePreferenceChange('language', null, e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSavePreferences}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            <Save size={18} />
                            <span>Save Preferences</span>
                        </button>

                        {saved && (
                            <div className="p-3 bg-emerald-900/30 text-emerald-300 rounded-lg text-sm text-center">
                                Settings saved successfully!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
