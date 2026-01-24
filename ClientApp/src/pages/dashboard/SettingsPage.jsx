import { useState, useEffect } from "react";
import { Save, User, Bell, Palette, Shield, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        defaultUserRole: "user",
        autoAssignToCampaigns: false,
        emailNotifications: true,
        taskReminders: true,
        campaignUpdates: true,
        agencyName: "Marketing Agency",
        primaryColor: "#10b981"
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, []);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Save to localStorage
            localStorage.setItem('adminSettings', JSON.stringify(settings));
            
            // Show success message
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            
            // In a real app, you would also send this to the backend API here
            // await settingsAPI.update(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage system settings and configurations</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {/* User Management */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-emerald-400" size={24} />
                        <h2 className="text-xl font-bold text-white">User Management</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Default User Role</label>
                            <select 
                                value={settings.defaultUserRole}
                                onChange={(e) => handleSettingChange('defaultUserRole', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Auto-assign to campaigns</label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={settings.autoAssignToCampaigns}
                                    onChange={(e) => handleSettingChange('autoAssignToCampaigns', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500" 
                                />
                                <span className="text-slate-300">Automatically assign new users to default campaigns</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-emerald-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-300">Email notifications</span>
                            <input 
                                type="checkbox" 
                                checked={settings.emailNotifications}
                                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500" 
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-300">Task reminders</span>
                            <input 
                                type="checkbox" 
                                checked={settings.taskReminders}
                                onChange={(e) => handleSettingChange('taskReminders', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500" 
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-slate-300">Campaign updates</span>
                            <input 
                                type="checkbox" 
                                checked={settings.campaignUpdates}
                                onChange={(e) => handleSettingChange('campaignUpdates', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500" 
                            />
                        </label>
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="text-emerald-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Branding & Customization</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Agency Name</label>
                            <input
                                type="text"
                                value={settings.agencyName}
                                onChange={(e) => handleSettingChange('agencyName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Primary Color</label>
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                                className="w-20 h-12 rounded-lg border border-slate-600/50 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="text-emerald-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Permissions & Access</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Role-based Access Control</label>
                            <p className="text-slate-400 text-sm mb-4">Configure what each role can access and modify</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <span className="text-slate-300">Admin - Full Access</span>
                                    <span className="text-emerald-400 text-sm">Enabled</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                    <span className="text-slate-300">User - Limited Access</span>
                                    <span className="text-emerald-400 text-sm">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end items-center gap-4">
                    {saved && (
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-medium">Settings saved successfully!</span>
                        </div>
                    )}
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
