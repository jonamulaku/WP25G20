import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Target,
    TrendingUp,
    Award,
    CheckCircle2,
    Play,
    Share2,
    Download,
    Clock,
    Briefcase,
    Lightbulb,
    Rocket,
    BarChart3,
    Star,
    Image as ImageIcon,
    ExternalLink,
    Mail,
    Linkedin
} from "lucide-react";
import Image1 from "@/assets/images/image 1.png";
import Image14 from "@/assets/images/image 14.png";
import Image15 from "@/assets/images/image 15.png";
import Image16 from "@/assets/images/image 16.png";
import Image17 from "@/assets/images/image 17.png";
import Image18 from "@/assets/images/image 18.png";
import Image19 from "@/assets/images/image 19.png";
import Image20 from "@/assets/images/image 20.png";
import Image21 from "@/assets/images/image 21.png";
import CarnivalImg from "@/assets/images/carnival.png";
import CampaignImg from "@/assets/images/campaign.png";
import MusicEventImg from "@/assets/images/music event.png";
import StrategicIcon from "@/assets/icons/strategic.svg";

// Mock project data - in real app, this would come from API/route params
const projectData = {
    id: 1,
    title: "Carnival Community Engagement",
    category: "Events",
    type: "Campaigns",
    client: "Community Foundation",
    year: "2023",
    location: "London, UK",
    duration: "6 months",
    image: CarnivalImg,
    heroImage: Image1,
    description: "A comprehensive community engagement campaign that brought together diverse audiences through innovative event marketing strategies. This project transformed how communities connect and celebrate together.",
    challenge: "The client needed to increase community participation in local events by 40% while building stronger connections between diverse demographic groups. Previous campaigns had low engagement rates and failed to reach younger audiences.",
    solution: "We developed a multi-channel campaign combining digital marketing, strategic partnerships, and immersive event experiences. Our approach focused on storytelling, community involvement, and creating shareable moments that resonated across all age groups.",
    results: {
        reach: "250K+",
        engagement: "45K+",
        conversion: "12%",
        roi: "340%",
        events: "15+",
        participants: "12K+"
    },
    services: [
        "Video Production",
        "Graphic Design",
        "Above the line media",
        "Digital marketing",
        "Strategic campaign planning",
        "Public relations",
        "Design and branding",
        "Onsite design production",
        "Cinematography",
        "Charitable partnerships",
        "Community affairs"
    ],
    process: [
        {
            phase: "Discovery",
            title: "Research & Strategy",
            desc: "Conducted comprehensive market research and community surveys to understand audience needs and preferences.",
            duration: "2 weeks"
        },
        {
            phase: "Development",
            title: "Creative Development",
            desc: "Designed campaign identity, messaging framework, and multi-channel content strategy.",
            duration: "4 weeks"
        },
        {
            phase: "Execution",
            title: "Campaign Launch",
            desc: "Rolled out integrated marketing campaign across digital, traditional, and experiential channels.",
            duration: "3 months"
        },
        {
            phase: "Optimization",
            title: "Analysis & Growth",
            desc: "Continuously monitored performance metrics and optimized strategies for maximum impact.",
            duration: "Ongoing"
        }
    ],
    gallery: [Image16, Image17, Image18, Image19, Image20, Image21],
    events: [
        {
            title: "Community Festival Launch",
            desc: "Grand opening event that brought together over 3,000 community members for a day of celebration and connection.",
            image: Image14
        },
        {
            title: "Youth Engagement Workshop",
            desc: "Interactive workshops designed to engage younger demographics and build lasting community connections.",
            image: Image15
        }
    ],
    testimonial: {
        quote: "This campaign exceeded all our expectations. The team's strategic approach and creative execution transformed our community engagement efforts. We saw unprecedented participation and the results speak for themselves.",
        author: "Sarah Mitchell",
        role: "Community Engagement Director",
        company: "Community Foundation",
        rating: 5
    },
    tags: ["Event Marketing", "Community", "Engagement", "Digital Strategy", "Brand Awareness"]
};

const relatedProjects = [
    {
        id: 2,
        title: "Music Festival Brand Launch",
        category: "Events",
        image: MusicEventImg,
        results: "180K+ Reach"
    },
    {
        id: 3,
        title: "Digital Transformation Campaign",
        category: "Corporate",
        image: CampaignImg,
        results: "500K+ Reach"
    }
];

export default function ProjectDetails() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* ================= LUXURY HERO SECTION ================= */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-28 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-emerald-50 mb-8">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <span className="text-emerald-200">/</span>
                        <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                        <span className="text-emerald-200">/</span>
                        <span className="text-white font-medium">{projectData.title}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                                <Briefcase size={16} />
                                <span>{projectData.category}</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                {projectData.title}
                            </h1>

                            <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                                {projectData.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mb-8 text-emerald-50">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span>{projectData.year}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <span>{projectData.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{projectData.duration}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    className="group px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold 
                                             shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 
                                             flex items-center justify-center gap-2"
                                >
                                    <Play size={20} className="ml-0.5" />
                                    <span>Watch Case Study</span>
                                </button>
                                <button
                                    type="button"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold 
                                             hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    <span>Share Project</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative lg:block hidden">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50"></div>
                                <img
                                    src={projectData.heroImage}
                                    alt={projectData.title}
                                    className="relative rounded-3xl shadow-2xl w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PROJECT STATS ================= */}
            <section className="py-12 bg-white border-b border-slate-200 -mt-1">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                        {[
                            { label: "Reach", value: projectData.results.reach, icon: TrendingUp },
                            { label: "Engagement", value: projectData.results.engagement, icon: Users },
                            { label: "Conversion", value: projectData.results.conversion, icon: Target },
                            { label: "ROI", value: projectData.results.roi, icon: BarChart3 },
                            { label: "Events", value: projectData.results.events, icon: Award },
                            { label: "Participants", value: projectData.results.participants, icon: Users },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <stat.icon className="text-emerald-600" size={24} />
                                    </div>
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TABS NAVIGATION ================= */}
            <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "challenge", label: "Challenge" },
                            { id: "solution", label: "Solution" },
                            { id: "process", label: "Process" },
                            { id: "results", label: "Results" },
                            { id: "gallery", label: "Gallery" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300
                                    ${activeTab === tab.id
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= PROJECT OVERVIEW ================= */}
            {activeTab === "overview" && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2">
                                <h2 className="text-4xl font-bold text-slate-900 mb-6">Project Overview</h2>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                        {projectData.description}
                                    </p>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                        Our comprehensive approach combined strategic planning, creative excellence, and data-driven execution
                                        to deliver exceptional results. The campaign successfully engaged diverse community groups,
                                        creating lasting connections and establishing a new standard for community engagement initiatives.
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-3 mt-8">
                                    {projectData.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Project Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Client</div>
                                            <div className="font-semibold text-slate-900">{projectData.client}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Category</div>
                                            <div className="font-semibold text-slate-900">{projectData.category}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Type</div>
                                            <div className="font-semibold text-slate-900">{projectData.type}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Year</div>
                                            <div className="font-semibold text-slate-900">{projectData.year}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Location</div>
                                            <div className="font-semibold text-slate-900">{projectData.location}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">Duration</div>
                                            <div className="font-semibold text-slate-900">{projectData.duration}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Key Achievements</h3>
                                    <ul className="space-y-3">
                                        {[
                                            "340% ROI increase",
                                            "12K+ active participants",
                                            "15+ successful events",
                                            "45K+ social engagements"
                                        ].map((achievement, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                                                <span className="text-slate-700">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= CHALLENGE SECTION ================= */}
            {activeTab === "challenge" && (
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                                <Lightbulb size={16} />
                                <span>The Challenge</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
                                Understanding the Problem
                            </h2>
                            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl">
                                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                    {projectData.challenge}
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    {[
                                        { title: "Low Engagement", desc: "Previous campaigns had less than 5% participation rate" },
                                        { title: "Demographic Gap", desc: "Failed to reach audiences under 35 years old" },
                                        { title: "Limited Reach", desc: "Traditional methods only reached 20% of target audience" },
                                        { title: "Budget Constraints", desc: "Needed to maximize impact with limited resources" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-xl">
                                            <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-600">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= SOLUTION SECTION ================= */}
            {activeTab === "solution" && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                                <Rocket size={16} />
                                <span>Our Solution</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
                                Strategic Approach
                            </h2>
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl">
                                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                    {projectData.solution}
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {[
                                        { title: "Multi-Channel Strategy", desc: "Integrated approach across digital, traditional, and experiential channels" },
                                        { title: "Community-Centric Design", desc: "Campaigns designed with community input and participation" },
                                        { title: "Data-Driven Optimization", desc: "Real-time analytics and continuous performance improvement" },
                                        { title: "Partnership Development", desc: "Strategic alliances with local organizations and influencers" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200">
                                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <CheckCircle2 className="text-emerald-600" size={20} />
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= SERVICES SECTION ================= */}
            <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Briefcase size={16} />
                            <span>Services Provided</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Our Services
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectData.services.map((service, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors">
                                    <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={20} />
                                    <span className="text-slate-700 font-medium">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PROCESS SECTION ================= */}
            {activeTab === "process" && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <Rocket size={16} />
                                <span>Our Process</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                How We Delivered
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {projectData.process.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    <div className="relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 
                                                 hover:shadow-xl transition-all duration-300 h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="text-5xl font-bold text-emerald-100 group-hover:text-emerald-200 transition-colors">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                                <Rocket className="text-emerald-600" size={24} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                                                {step.phase}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                                            {step.desc}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={14} />
                                            <span>{step.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= RESULTS SECTION ================= */}
            {activeTab === "results" && (
                <section className="py-16 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                                <BarChart3 size={16} />
                                <span>Results & Impact</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Measurable Success
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(projectData.results).map(([key, value], i) => (
                                <div
                                    key={i}
                                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20
                                             hover:bg-white/20 hover:scale-105 transition-all duration-300 text-center"
                                >
                                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{value}</div>
                                    <div className="text-emerald-50 text-sm font-medium capitalize">{key}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= EVENTS SECTION ================= */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Award size={16} />
                            <span>Key Events</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Project Highlights
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projectData.events.map((event, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                         hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 
                                                  group-hover:from-black/70 transition-all"></div>
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {event.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= GALLERY SECTION ================= */}
            {activeTab === "gallery" && (
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <ImageIcon size={16} />
                                <span>Project Gallery</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                Visual Showcase
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {projectData.gallery.map((image, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 
                                                  group-hover:from-black/70 transition-all opacity-0 group-hover:opacity-100"></div>
                                    <img
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= TESTIMONIAL SECTION ================= */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-20"></div>
                            <div className="relative bg-white rounded-3xl p-12 border border-slate-100 shadow-2xl">
                                <div className="flex justify-center mb-6">
                                    <div className="flex gap-1">
                                        {[...Array(projectData.testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="text-amber-400 fill-amber-400" size={24} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xl text-slate-700 leading-relaxed text-center mb-8 italic">
                                    "{projectData.testimonial.quote}"
                                </p>
                                <div className="border-t border-slate-200 pt-6 text-center">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        {projectData.testimonial.author}
                                    </h3>
                                    <p className="text-slate-600">
                                        {projectData.testimonial.role}, {projectData.testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= RELATED PROJECTS ================= */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Related Projects</h2>
                            <p className="text-slate-600 mt-2">Explore more of our successful campaigns</p>
                        </div>
                        <Link
                            to="/projects"
                            className="group hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>View All Projects</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {relatedProjects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="group relative block bg-white rounded-2xl overflow-hidden border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                         hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 
                                                  group-hover:from-black/80 transition-all"></div>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold">
                                            {project.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <div className="text-white font-bold text-lg mb-1">{project.title}</div>
                                        <div className="text-emerald-200 text-sm">{project.results}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-emerald-50 text-lg mb-8">
                            Let's discuss how we can help you achieve similar results for your business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/projects"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                                         hover:bg-white/20 transition-all duration-300"
                            >
                                View All Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}