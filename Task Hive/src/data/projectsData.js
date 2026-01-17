export const projectsData = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Revamp the company website for a modern look and better UX.",
        progress: 72,
        totalTasks: 12,
        overdueTasks: 3,
        team: [
            "https://randomuser.me/api/portraits/men/32.jpg",
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/45.jpg"
        ],
        due: "Mar 24"
    },
    {
        id: 2,
        name: "Mobile App Launch",
        description: "Prepare and launch the new mobile application.",
        progress: 55,
        totalTasks: 20,
        overdueTasks: 1,
        team: [
            "https://randomuser.me/api/portraits/women/65.jpg",
            "https://randomuser.me/api/portraits/men/12.jpg"
        ],
        due: "Apr 10"
    },
    {
        id: 3,
        name: "Q2 Marketing Campaign",
        description: "Plan and execute the Q2 marketing campaign for new products.",
        progress: 90,
        totalTasks: 15,
        overdueTasks: 0,
        team: [
            "https://randomuser.me/api/portraits/men/23.jpg",
            "https://randomuser.me/api/portraits/women/34.jpg",
        ],
        due: "May 2"
    },
    {
        id: 4,
        name: "Customer Portal Upgrade",
        description: "Enhance the customer portal with new features and improved security.",
        progress: 40,
        totalTasks: 10,
        overdueTasks: 2,
        team: [
            "https://randomuser.me/api/portraits/men/11.jpg",
            "https://randomuser.me/api/portraits/women/22.jpg"
        ],
        due: "Feb 15"
    },
    {
        id: 5,
        name: "Cloud Migration",
        description: "Migrate infrastructure to the cloud for better scalability.",
        progress: 30,
        totalTasks: 18,
        overdueTasks: 4,
        team: [
            "https://randomuser.me/api/portraits/men/77.jpg",
            "https://randomuser.me/api/portraits/women/88.jpg"
        ],
        due: "Apr 20"
    },
];

// Helper to convert projects to dropdown options
export const getProjectOptions = (projects) => {
    return projects.map(project => ({
        value: project.name,
        label: project.name
    }));
};
