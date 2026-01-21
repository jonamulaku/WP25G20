// Mock Data Service - Replace with real API calls when backend is ready
// This file provides realistic mock data for development and design purposes

export const generateMockTasks = (userId, role) => {
    const campaigns = [
        { id: 1, name: "Q1 Social Media Blitz" },
        { id: 2, name: "Brand Identity Redesign" },
        { id: 3, name: "Spring Collection Launch" },
        { id: 4, name: "New Year Fitness Challenge" }
    ];

    const taskTemplates = {
        marketer: [
            { title: "Create social media content calendar", type: "content" },
            { title: "Set up paid ad campaigns", type: "ads" },
            { title: "Analyze campaign performance metrics", type: "analytics" },
            { title: "Optimize Google Ads keywords", type: "seo" },
            { title: "Design email marketing campaign", type: "email" },
            { title: "Monitor social media engagement", type: "monitoring" }
        ],
        designer: [
            { title: "Design new logo concepts", type: "logo" },
            { title: "Create social media graphics", type: "graphics" },
            { title: "Design campaign banner", type: "banner" },
            { title: "Create local flyers and posters", type: "print" },
            { title: "Design email template", type: "email" },
            { title: "Create brand style guide", type: "branding" }
        ],
        manager: [
            { title: "Develop campaign strategy", type: "strategy" },
            { title: "Monitor campaign performance", type: "monitoring" },
            { title: "Review and approve content", type: "approval" },
            { title: "Generate weekly performance report", type: "reporting" },
            { title: "Coordinate team tasks", type: "coordination" },
            { title: "Client presentation preparation", type: "presentation" }
        ]
    };

    const roleKey = role?.toLowerCase().includes('marketer') ? 'marketer' :
                   role?.toLowerCase().includes('designer') ? 'designer' :
                   role?.toLowerCase().includes('manager') ? 'manager' : 'marketer';

    const templates = taskTemplates[roleKey] || taskTemplates.marketer;
    const statuses = ['Pending', 'InProgress', 'Review', 'OnHold', 'Completed'];
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    return Array.from({ length: 12 }, (_, i) => {
        const template = templates[i % templates.length];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const dueDays = Math.floor(Math.random() * 14) - 5; // -5 to +9 days
        
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + dueDays);
        
        const completedAt = status === 'Completed' ? new Date() : null;
        if (completedAt) {
            completedAt.setDate(completedAt.getDate() - Math.floor(Math.random() * 7));
        }

        return {
            id: i + 1,
            title: template.title,
            description: `Detailed description for ${template.title}. This task involves multiple steps and requires attention to detail.`,
            campaignId: campaign.id,
            campaignName: campaign.name,
            assignedToTeamMemberId: userId,
            assignedToTeamMemberName: "You",
            assignedToTeamMemberRole: role,
            dueDate: dueDate.toISOString(),
            priority: priority,
            status: status,
            notes: status === 'Completed' ? "Task completed successfully" : null,
            createdAt: createdAt.toISOString(),
            updatedAt: new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: completedAt?.toISOString(),
            createdBy: "Campaign Manager",
            commentCount: Math.floor(Math.random() * 5),
            fileCount: Math.floor(Math.random() * 3)
        };
    });
};

export const generateMockCampaigns = (userId) => {
    const clients = [
        { id: 1, name: "TechStart Solutions" },
        { id: 2, name: "GreenLife Organics" },
        { id: 3, name: "Fashion Forward Inc" },
        { id: 4, name: "FitZone Gym" }
    ];

    const services = [
        { id: 1, name: "Digital Marketing" },
        { id: 2, name: "Graphic Design" },
        { id: 3, name: "Campaign Management" }
    ];

    return [
        {
            id: 1,
            name: "Q1 Social Media Blitz",
            description: "Comprehensive social media campaign for Q1 to increase brand awareness and engagement",
            clientId: clients[0].id,
            clientName: clients[0].name,
            serviceId: services[0].id,
            serviceName: services[0].name,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 15000.00,
            status: "Active",
            notes: "Focus on LinkedIn and Instagram",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            taskCount: 8,
            completedTaskCount: 5,
            assignedUserIds: [userId]
        },
        {
            id: 2,
            name: "Brand Identity Redesign",
            description: "Complete brand identity redesign including logo, colors, and marketing materials",
            clientId: clients[1].id,
            clientName: clients[1].name,
            serviceId: services[1].id,
            serviceName: services[1].name,
            startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 8000.00,
            status: "Active",
            notes: "Eco-friendly design focus",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            taskCount: 6,
            completedTaskCount: 3,
            assignedUserIds: [userId]
        },
        {
            id: 3,
            name: "Spring Collection Launch",
            description: "Marketing campaign for spring fashion collection launch",
            clientId: clients[2].id,
            clientName: clients[2].name,
            serviceId: services[2].id,
            serviceName: services[2].name,
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 53 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 25000.00,
            status: "Active",
            notes: "High-end luxury market",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            taskCount: 12,
            completedTaskCount: 4,
            assignedUserIds: [userId]
        }
    ];
};

export const generateMockFiles = (tasks) => {
    const fileTypes = ['image', 'document', 'video', 'other'];
    const extensions = {
        image: ['jpg', 'png', 'svg', 'gif'],
        document: ['pdf', 'docx', 'xlsx', 'pptx'],
        video: ['mp4', 'mov', 'avi'],
        other: ['zip', 'rar', 'psd']
    };

    return tasks.flatMap(task => {
        const fileCount = task.fileCount || Math.floor(Math.random() * 3) + 1;
        return Array.from({ length: fileCount }, (_, i) => {
            const type = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const ext = extensions[type][Math.floor(Math.random() * extensions[type].length)];
            const size = Math.floor(Math.random() * 5000) + 100;
            
            return {
                id: `${task.id}-${i}`,
                name: `${task.title.replace(/\s+/g, '_')}_v${i + 1}.${ext}`,
                type: type,
                size: size,
                uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                taskId: task.id,
                taskTitle: task.title,
                campaignName: task.campaignName,
                version: i + 1,
                owner: "You",
                url: `#file-${task.id}-${i}`
            };
        });
    });
};

export const generateMockComments = (tasks) => {
    const authors = ["Campaign Manager", "Team Lead", "Client", "You"];
    
    return tasks.flatMap(task => {
        const commentCount = task.commentCount || Math.floor(Math.random() * 4) + 1;
        return Array.from({ length: commentCount }, (_, i) => ({
            id: `${task.id}-comment-${i}`,
            taskId: task.id,
            taskTitle: task.title,
            author: authors[Math.floor(Math.random() * authors.length)],
            message: i === 0 
                ? "Please review the requirements before starting. Let me know if you have any questions."
                : i === 1
                ? "Working on it. Will update soon."
                : "Great progress! Keep it up.",
            createdAt: new Date(Date.now() - (commentCount - i) * 24 * 60 * 60 * 1000).toISOString(),
            mentions: []
        }));
    });
};

export const generateMockNotifications = () => {
    return [
        {
            id: 1,
            type: 'task_assigned',
            message: 'New task assigned: Design Campaign Banner',
            taskId: 1,
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 2,
            type: 'feedback',
            message: 'Feedback received on task: Social Media Posts',
            taskId: 2,
            read: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 3,
            type: 'deadline',
            message: 'Deadline reminder: Campaign Review due tomorrow',
            taskId: 3,
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 4,
            type: 'status_change',
            message: 'Task status updated: Logo Design is now In Review',
            taskId: 4,
            read: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 5,
            type: 'comment',
            message: 'New comment on: Create social media content calendar',
            taskId: 5,
            read: true,
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
    ];
};

export const generateMockActivityLog = (tasks) => {
    const activities = [];
    
    tasks.forEach(task => {
        activities.push({
            id: `${task.id}-created`,
            type: 'task_created',
            description: `Task "${task.title}" was created`,
            entityType: 'Task',
            entityId: task.id,
            createdAt: new Date(task.createdAt).toISOString()
        });

        if (task.updatedAt) {
            activities.push({
                id: `${task.id}-updated`,
                type: 'task_updated',
                description: `Task "${task.title}" was updated`,
                entityType: 'Task',
                entityId: task.id,
                createdAt: new Date(task.updatedAt).toISOString()
            });
        }

        if (task.completedAt) {
            activities.push({
                id: `${task.id}-completed`,
                type: 'task_completed',
                description: `Task "${task.title}" was completed`,
                entityType: 'Task',
                entityId: task.id,
                createdAt: new Date(task.completedAt).toISOString()
            });
        }
    });

    return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const generateRoleSpecificMetrics = (role, tasks, campaigns) => {
    if (role?.toLowerCase().includes('marketer') || role?.toLowerCase().includes('marketing')) {
        return {
            engagementRate: 12.5 + (Math.random() * 5),
            ctr: 3.2 + (Math.random() * 2),
            conversionRate: 2.8 + (Math.random() * 1.5),
            campaignPerformance: 85 + (Math.random() * 10)
        };
    } else if (role?.toLowerCase().includes('designer') || role?.toLowerCase().includes('graphic')) {
        const designTasks = tasks.filter(t => 
            t.title.toLowerCase().includes('design') || 
            t.title.toLowerCase().includes('asset') ||
            t.title.toLowerCase().includes('graphic') ||
            t.title.toLowerCase().includes('logo')
        );
        const totalAssets = designTasks.length;
        const approvedAssets = designTasks.filter(t => t.status === 'Completed').length;
        
        return {
            assetsDelivered: totalAssets,
            revisionsPerAsset: totalAssets > 0 ? (Math.random() * 2 + 0.5).toFixed(1) : 0,
            approvalRate: totalAssets > 0 ? Math.round((approvedAssets / totalAssets) * 100) : 0,
            avgTurnaroundTime: (Math.random() * 3 + 2).toFixed(1)
        };
    } else if (role?.toLowerCase().includes('manager') || role?.toLowerCase().includes('campaign')) {
        const totalCampaigns = campaigns.length;
        const successfulCampaigns = campaigns.filter(c => 
            c.status === 'Completed' || (c.completedTaskCount / c.taskCount) >= 0.8
        ).length;
        
        return {
            campaignSuccessRate: totalCampaigns > 0 
                ? Math.round((successfulCampaigns / totalCampaigns) * 100) 
                : 0,
            teamTaskCompletion: tasks.length > 0
                ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)
                : 0,
            bottleneckTasks: tasks.filter(t => {
                if (!t.dueDate) return false;
                return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
            }).length,
            timelineAccuracy: tasks.length > 0
                ? Math.round((tasks.filter(t => {
                    if (!t.dueDate || !t.completedAt) return false;
                    return new Date(t.completedAt) <= new Date(t.dueDate);
                }).length / tasks.length) * 100)
                : 0
        };
    }
    
    return {};
};
