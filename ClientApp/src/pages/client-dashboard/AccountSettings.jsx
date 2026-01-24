import { useState, useEffect } from "react";
import { Save, User, Bell } from "lucide-react";
import { authAPI, usersAPI, clientsAPI } from "../../services/api";

export default function AccountSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState(null);
    const [clientData, setClientData] = useState(null);
    
    // Profile Settings
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });

    // Preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        reportFrequency: "weekly",
        language: "en",
        currency: "USD"
    });

    useEffect(() => {
        fetchUserData();
        loadPreferences();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            // Fetch both user and client data
            const [user, client] = await Promise.all([
                usersAPI.getMe().catch(() => null),
                clientsAPI.getMe().catch(() => null)
            ]);
            
            setUserData(user);
            setClientData(client);
            
            setProfileData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
                phone: client?.phone || "",
                address: client?.address || ""
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadPreferences = () => {
        const savedPrefs = localStorage.getItem('clientPreferences');
        if (savedPrefs) {
            try {
                setPreferences(JSON.parse(savedPrefs));
            } catch (e) {
                console.error("Error loading preferences:", e);
            }
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            
            // Update user profile first (firstName, lastName, email)
            const updatedUser = await usersAPI.updateMe({
                email: profileData.email,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                isActive: userData?.isActive ?? true
            });
            setUserData(updatedUser);
            
            // Update client profile (contactPerson, email, phone, address)
            // The ClientService will sync the User entity based on ContactPerson
            // The updateMe endpoint will create the client entity if it doesn't exist
            const contactPerson = `${profileData.firstName} ${profileData.lastName}`.trim();
            const clientUpdateData = {
                companyName: clientData?.companyName || "Client Company",
                contactPerson: contactPerson,
                email: profileData.email,
                phone: profileData.phone || "",
                address: profileData.address || "",
                isActive: clientData?.isActive ?? true
            };
            
            const updatedClient = await clientsAPI.updateMe(clientUpdateData);
            setClientData(updatedClient);
            
            // Update profileData with the saved values to ensure they persist in the UI
            setProfileData({
                firstName: updatedUser.firstName || "",
                lastName: updatedUser.lastName || "",
                email: updatedUser.email || "",
                phone: updatedClient.phone || "",
                address: updatedClient.address || ""
            });
            
            // Update local storage user info
            const currentUser = authAPI.getCurrentUser();
            if (currentUser) {
                const updatedUserInfo = {
                    ...currentUser,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName
                };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                // Trigger auth change event
                window.dispatchEvent(new Event('authChange'));
            }
            
            alert('Profile updated successfully! Changes will be reflected everywhere, including the admin dashboard.');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(error.message || 'Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handlePreferencesSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            // Save preferences to localStorage
            localStorage.setItem('clientPreferences', JSON.stringify(preferences));
            alert('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Failed to save preferences. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile Settings", icon: User },
        { id: "preferences", label: "Preferences", icon: Bell }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        activeTab === tab.id
                                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                            : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {/* Profile Settings */}
                    {activeTab === "profile" && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                            <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                            <form onSubmit={handleProfileSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">First Name</label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Last Name</label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-slate-400 text-sm mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-slate-400 text-sm mb-2 block">Address</label>
                                        <textarea
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={20} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Preferences */}
                    {activeTab === "preferences" && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                            <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
                            <form onSubmit={handlePreferencesSave} className="space-y-6">
                                <div>
                                    <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 rounded bg-slate-700/50 border-slate-600/50 text-emerald-600 focus:ring-emerald-500/50"
                                            />
                                            <span className="text-white">Email Notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.smsNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                                                className="w-5 h-5 rounded bg-slate-700/50 border-slate-600/50 text-emerald-600 focus:ring-emerald-500/50"
                                            />
                                            <span className="text-white">SMS Notifications</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Report Frequency</label>
                                        <select
                                            value={preferences.reportFrequency}
                                            onChange={(e) => setPreferences({ ...preferences, reportFrequency: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Language</label>
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Currency</label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={20} />
                                    {saving ? "Saving..." : "Save Preferences"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
