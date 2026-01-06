import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Search,
    Filter,
    TrendingUp,
    Award,
    Users,
    Target,
    TrendingDown,
    Calendar,
    MapPin,
    ExternalLink,
    Eye,
    Sparkles,
    Briefcase,
    BarChart3,
    CheckCircle2,
    Star,
    Zap
} from "lucide-react";
import CarnivalImg from "@/assets/images/carnival.png";
import MusicEventImg from "@/assets/images/music event.png";
import CampaignImg from "@/assets/images/campaign.png";
import Image1 from "@/assets/images/image 1.png";
import Image5 from "@/assets/images/image 5.png";
import Image6 from "@/assets/images/image 6.png";
import Image7 from "@/assets/images/image 7.png";
import Image11 from "@/assets/images/image 11.png";
import Image12 from "@/assets/images/image 12.png";

const projectCategories = ["All", "Education", "Corporate", "Technology", "Events", "Branding"];

const projectTypes = ["Digital Marketing", "Brand Strategy", "Content Creation", "Social Media", "Campaigns", "Web Design"];

const projects = [
    {
        id: 1,
        title: "Carnival Community Engagement",
        category: "Events",
        type: "Campaigns",
        image: CarnivalImg,
        client: "Community Foundation",
        year: "2023",
        location: "London, UK",
        description: "A comprehensive community engagement campaign that brought together diverse audiences through innovative event marketing strategies.",
        results: {
            reach: "250K+",
            engagement: "45K+",
            conversion: "12%"
        },
        featured: true,
        tags: ["Event Marketing", "Community", "Engagement"],
    },
    {
        id: 2,
        title: "Music Festival Brand Launch",
        category: "Events",
        type: "Brand Strategy",
        image: MusicEventImg,
        client: "Festival Co.",
        year: "2023",
        location: "Manchester, UK",
        description: "Complete brand identity and launch campaign for a major music festival, creating buzz and driving ticket sales.",
        results: {
            reach: "180K+",
            engagement: "32K+",
            conversion: "18%"
        },
        featured: false,
        tags: ["Branding", "Events", "Social Media"],
    },
    {
        id: 3,
        title: "Digital Transformation Campaign",
        category: "Corporate",
        type: "Digital Marketing",
        image: CampaignImg,
        client: "TechCorp Global",
        year: "2023",
        location: "Birmingham, UK",
        description: "Strategic digital marketing campaign that transformed brand perception and increased market share in competitive tech sector.",
        results: {
            reach: "500K+",
            engagement: "85K+",
            conversion: "15%"
        },
        featured: false,
        tags: ["Digital Marketing", "Strategy", "B2B"],
    },
    {
        id: 4,
        title: "Educational Platform Launch",
        category: "Education",
        type: "Content Creation",
        image: Image1,
        client: "EduTech Solutions",
        year: "2023",
        location: "Edinburgh, UK",
        description: "Multi-channel content strategy and launch campaign for an innovative educational technology platform.",
        results: {
            reach: "320K+",
            engagement: "58K+",
            conversion: "22%"
        },
        featured: false,
        tags: ["Education", "Content", "Platform"],
    },
    {
        id: 5,
        title: "Luxury Brand Rebranding",
        category: "Branding",
        type: "Brand Strategy",
        image: Image5,
        client: "Luxury Brands Ltd",
        year: "2023",
        location: "London, UK",
        description: "Complete brand overhaul and repositioning strategy for a luxury goods company targeting premium markets.",
        results: {
            reach: "150K+",
            engagement: "28K+",
            conversion: "25%"
        },
        featured: false,
        tags: ["Branding", "Luxury", "Strategy"],
    },
    {
        id: 6,
        title: "Social Media Campaign Suite",
        category: "Technology",
        type: "Social Media",
        image: Image6,
        client: "Startup Inc",
        year: "2023",
        location: "Bristol, UK",
        description: "Comprehensive social media strategy and execution across multiple platforms, driving brand awareness and growth.",
        results: {
            reach: "420K+",
            engagement: "95K+",
            conversion: "20%"
        },
        featured: false,
        tags: ["Social Media", "Growth", "Awareness"],
    },
    {
        id: 7,
        title: "Corporate Sustainability Initiative",
        category: "Corporate",
        type: "Campaigns",
        image: Image7,
        client: "GreenCorp",
        year: "2023",
        location: "Leeds, UK",
        description: "Purpose-driven marketing campaign highlighting corporate sustainability efforts and environmental responsibility.",
        results: {
            reach: "280K+",
            engagement: "52K+",
            conversion: "14%"
        },
        featured: false,
        tags: ["Sustainability", "Corporate", "Purpose"],
    },
    {
        id: 8,
        title: "E-commerce Platform Launch",
        category: "Technology",
        type: "Digital Marketing",
        image: Image11,
        client: "RetailTech",
        year: "2023",
        location: "Liverpool, UK",
        description: "Full-funnel digital marketing campaign for a new e-commerce platform, from awareness to conversion.",
        results: {
            reach: "600K+",
            engagement: "120K+",
            conversion: "16%"
        },
        featured: false,
        tags: ["E-commerce", "Digital", "Conversion"],
    },
    {
        id: 9,
        title: "Healthcare Awareness Campaign",
        category: "Education",
        type: "Content Creation",
        image: Image12,
        client: "Health Foundation",
        year: "2023",
        location: "Glasgow, UK",
        description: "Educational content campaign raising awareness about important health issues in underserved communities.",
        results: {
            reach: "380K+",
            engagement: "68K+",
            conversion: "19%"
        },
        featured: false,
        tags: ["Healthcare", "Education", "Awareness"],
    },
];

const projectStats = [
    { label: "Projects Completed", value: "860+", icon: Briefcase },
    { label: "Happy Clients", value: "55+", icon: Users },
    { label: "Success Rate", value: "98%", icon: Target },
    { label: "Awards Won", value: "10+", icon: Award },
];

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeCategory === "All" || project.category === activeCategory;
        const matchesType = activeType === "All" || project.type === activeType;
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesType && matchesSearch;
    });

    const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];

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
                        <span className="text-white font-medium">Our Projects</span>
                    </nav>

                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                            <Briefcase size={16} />
                            <span>Portfolio</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Our Projects
                        </h1>

                        <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
                            Explore our portfolio of successful campaigns, innovative strategies, and transformative marketing solutions that drive real results.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search projects by name, client, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-0 shadow-xl 
                                         text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-300 
                                         focus:outline-none text-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PROJECT STATS ================= */}
            <section className="py-12 bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {projectStats.map((stat, i) => (
                            <div
                                key={i}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <stat.icon className="text-emerald-600" size={24} />
                                    </div>
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FILTERS & TYPES ================= */}
            <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-6">
                    <div className="flex flex-col gap-6">
                        {/* Category Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
                                <Filter size={16} />
                                Category:
                            </span>
                            <button
                                onClick={() => setActiveCategory("All")}
                                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300
                                    ${activeCategory === "All"
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                            >
                                All
                            </button>
                            {projectCategories.filter(cat => cat !== "All").map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300
                                        ${activeCategory === category
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Project Type Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
                                <Zap size={16} />
                                Type:
                            </span>
                            <button
                                onClick={() => setActiveType("All")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                    ${activeType === "All"
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    }`}
                            >
                                All Types
                            </button>
                            {projectTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${activeType === type
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURED PROJECT ================= */}
            {featuredProject && (
                <section className="py-16 bg-gradient-to-b from-white to-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-emerald-600" size={24} />
                                <h2 className="text-3xl font-bold text-slate-900">Featured Project</h2>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                                <div className="grid lg:grid-cols-2 gap-0">
                                    <div className="relative h-96 lg:h-[500px] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                                        <img
                                            src={featuredProject.image}
                                            alt={featuredProject.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 z-20 flex gap-3">
                                            <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                                                Featured
                                            </span>
                                            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-semibold">
                                                {featuredProject.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                                        <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span>{featuredProject.year}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>{featuredProject.location}</span>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                                                {featuredProject.type}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                            {featuredProject.title}
                                        </h2>
                                        <p className="text-slate-600 mb-2 text-sm">
                                            <span className="font-semibold">Client:</span> {featuredProject.client}
                                        </p>
                                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                            {featuredProject.description}
                                        </p>

                                        {/* Results */}
                                        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-emerald-600 mb-1">{featuredProject.results.reach}</div>
                                                <div className="text-xs text-slate-600">Reach</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-emerald-600 mb-1">{featuredProject.results.engagement}</div>
                                                <div className="text-xs text-slate-600">Engagement</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-emerald-600 mb-1">{featuredProject.results.conversion}</div>
                                                <div className="text-xs text-slate-600">Conversion</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link
                                                to={`/projects/${featuredProject.id}`}
                                                className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold 
                                                         hover:bg-emerald-700 transition-all duration-300 w-fit shadow-lg hover:shadow-xl"
                                            >
                                                <span>View Case Study</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <button
                                                type="button"
                                                className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                                                aria-label="View project"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= PROJECTS GRID ================= */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">All Projects</h2>
                        <span className="text-slate-600 text-sm">
                            {filteredProjects.filter(p => !p.featured).length} projects
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects
                            .filter(project => !project.featured)
                            .map((project) => (
                                <div
                                    key={project.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 
                                             hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                             hover:-translate-y-2 flex flex-col"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 
                                                      group-hover:from-black/70 transition-all"></div>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-semibold">
                                                {project.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                                <ExternalLink className="text-emerald-700" size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                <span>{project.year}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                <span>{project.location}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 
                                                      group-hover:text-emerald-600 transition-colors">
                                            {project.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm mb-1">
                                            <span className="font-semibold">Client:</span> {project.client}
                                        </p>

                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                                            {project.description}
                                        </p>

                                        {/* Results Preview */}
                                        <div className="flex items-center gap-4 mb-4 text-xs text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp size={12} />
                                                <span>{project.results.reach}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={12} />
                                                <span>{project.results.engagement}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Target size={12} />
                                                <span>{project.results.conversion}</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.slice(0, 2).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="group inline-flex items-center gap-2 text-emerald-600 font-semibold 
                                                         hover:text-emerald-700 transition-colors"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <button
                                                type="button"
                                                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                                                aria-label="View project"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Load More Button */}
                    {filteredProjects.length > 9 && (
                        <div className="mt-12 text-center">
                            <button
                                type="button"
                                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl 
                                         font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300
                                         shadow-lg hover:shadow-xl"
                            >
                                Load More Projects
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                                <Search className="text-slate-400" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
                            <p className="text-slate-600 mb-4">Try adjusting your search or selecting different filters</p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveType("All"); }}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CASE STUDIES CTA ================= */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-12 border border-emerald-100 shadow-xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <BarChart3 size={16} />
                                <span>Success Stories</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                Want to See Detailed Case Studies?
                            </h2>
                            <p className="text-lg text-slate-600">
                                Explore in-depth case studies showcasing our strategic approach, creative solutions, and measurable results for each project.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                type="button"
                                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold 
                                         hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                View All Case Studies
                            </button>
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold 
                                         hover:bg-emerald-50 transition-all duration-300 text-center"
                            >
                                Start Your Project
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CLIENT TESTIMONIALS ================= */}
            <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Star size={16} />
                            <span>Client Feedback</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Hear from clients who have experienced exceptional results from our marketing campaigns and strategic initiatives.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Their strategic approach transformed our brand presence. The results exceeded all expectations.",
                                client: "TechCorp Global",
                                project: "Digital Transformation Campaign",
                                rating: 5,
                            },
                            {
                                quote: "Outstanding creativity and execution. The campaign generated incredible engagement and ROI.",
                                client: "Festival Co.",
                                project: "Music Festival Brand Launch",
                                rating: 5,
                            },
                            {
                                quote: "Professional, innovative, and results-driven. They delivered exactly what we needed.",
                                client: "Community Foundation",
                                project: "Carnival Community Engagement",
                                rating: 5,
                            },
                        ].map((testimonial, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="text-amber-400 fill-amber-400" size={16} />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-6 leading-relaxed italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="border-t border-slate-100 pt-4">
                                    <div className="font-semibold text-slate-900">{testimonial.client}</div>
                                    <div className="text-sm text-slate-600">{testimonial.project}</div>
                                </div>
                            </div>
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
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Next Project?
                        </h2>
                        <p className="text-emerald-50 text-lg mb-8">
                            Let's discuss how we can help you achieve your marketing goals and drive exceptional results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                            <button
                                type="button"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                                         hover:bg-white/20 transition-all duration-300"
                            >
                                Schedule a Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}