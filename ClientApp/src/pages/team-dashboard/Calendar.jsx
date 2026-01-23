import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, CheckSquare, Megaphone } from "lucide-react";
import { tasksAPI, campaignsAPI } from "../../services/api";

export default function Calendar() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [view, setView] = useState("calendar"); // "calendar" or "timeline"
    const [tasks, setTasks] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            const [tasksResponse, campaignsResponse] = await Promise.all([
                tasksAPI.getMyTasks({ pageSize: 1000 }),
                campaignsAPI.getAll({ pageSize: 1000 })
            ]);
            
            const userTasks = tasksResponse.items || [];
            // The backend already filters campaigns for team members based on CampaignUsers table
            // So we can trust the backend response - no need for additional filtering
            const userCampaigns = campaignsResponse.items || [];
            
            setTasks(userTasks);
            setCampaigns(userCampaigns);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
            setTasks([]);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            );
        });
    };

    const getCampaignMilestones = () => {
        const milestones = [];
        campaigns.forEach(campaign => {
            milestones.push({
                type: "start",
                date: new Date(campaign.startDate),
                campaign: campaign.name,
                campaignId: campaign.id
            });
            if (campaign.endDate) {
                milestones.push({
                    type: "end",
                    date: new Date(campaign.endDate),
                    campaign: campaign.name,
                    campaignId: campaign.id
                });
            }
        });
        return milestones.sort((a, b) => a.date - b.date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold text-white">Calendar</h1>
                <p className="text-slate-400 mt-1">View task deadlines and campaign milestones</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("calendar")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            view === "calendar"
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50"
                        }`}
                    >
                        Calendar View
                    </button>
                    <button
                        onClick={() => setView("timeline")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            view === "timeline"
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50"
                        }`}
                    >
                        Timeline View
                    </button>
                </div>
            </div>

            {view === "calendar" ? (
                <CalendarView
                    tasks={tasks}
                    campaigns={campaigns}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    getTasksForDate={getTasksForDate}
                />
            ) : (
                <TimelineView
                    tasks={tasks}
                    campaigns={campaigns}
                    milestones={getCampaignMilestones()}
                />
            )}
        </div>
    );
}

function CalendarView({ tasks, selectedDate, onDateSelect, getTasksForDate }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg"
                >
                    ← Previous
                </button>
                <h2 className="text-xl font-semibold text-white">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                    onClick={() => navigateMonth(1)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg"
                >
                    Next →
                </button>
            </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-sm font-semibold text-slate-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={index} className="aspect-square" />;
                    }

                    const dayTasks = getTasksForDate(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = date.toDateString() === selectedDate.toDateString();

                    return (
                        <div
                            key={index}
                            onClick={() => onDateSelect(date)}
                            className={`aspect-square border border-slate-700/50 rounded-lg p-2 cursor-pointer hover:bg-slate-700/30 transition-colors ${
                                isToday ? "ring-2 ring-emerald-500" : ""
                            } ${isSelected ? "bg-emerald-600/20 border-emerald-500/50" : ""}`}
                        >
                            <div className={`text-sm font-medium mb-1 ${isToday ? "text-emerald-400" : "text-white"}`}>
                                {date.getDate()}
                            </div>
                            {dayTasks.length > 0 && (
                                <div className="space-y-1">
                                    {dayTasks.slice(0, 2).map(task => (
                                        <div
                                            key={task.id}
                                            className="text-xs px-1 py-0.5 bg-emerald-600/30 text-emerald-300 rounded truncate"
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                    {dayTasks.length > 2 && (
                                        <div className="text-xs text-slate-400">
                                            +{dayTasks.length - 2} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    {getTasksForDate(selectedDate).length === 0 ? (
                        <p className="text-slate-400">No tasks scheduled for this date</p>
                    ) : (
                        <div className="space-y-2">
                            {getTasksForDate(selectedDate).map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                                >
                                    <CheckSquare size={18} className="text-emerald-400" />
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{task.title}</p>
                                        <p className="text-sm text-slate-300">{task.campaignName}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        task.priority === 'Urgent' ? 'bg-red-900/50 text-red-300' :
                                        task.priority === 'High' ? 'bg-amber-900/50 text-amber-300' :
                                        'bg-blue-900/50 text-blue-300'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function TimelineView({ tasks, campaigns, milestones }) {
    const allEvents = [
        ...tasks.map(task => ({
            type: 'task',
            date: task.dueDate ? new Date(task.dueDate) : null,
            title: task.title,
            item: task
        })),
        ...milestones.map(milestone => ({
            type: 'milestone',
            date: milestone.date,
            title: `${milestone.campaign} - ${milestone.type}`,
            item: milestone
        }))
    ].filter(event => event.date).sort((a, b) => a.date - b.date);

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Timeline View</h2>
            
            <div className="space-y-4">
                {allEvents.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No events scheduled</p>
                ) : (
                    allEvents.map((event, index) => (
                        <div
                            key={index}
                                    className="flex items-start gap-4 p-4 border-l-4 border-emerald-500 bg-slate-700/30 rounded-r-lg"
                        >
                            <div className="flex-shrink-0">
                                {event.type === 'task' ? (
                                    <CheckSquare className="text-emerald-600" size={20} />
                                ) : (
                                    <Megaphone className="text-blue-600" size={20} />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">{event.title}</p>
                                <p className="text-sm text-slate-300 mt-1">
                                    {event.date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                {event.type === 'task' && event.item.campaignName && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Campaign: {event.item.campaignName}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
