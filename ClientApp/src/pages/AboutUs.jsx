import { Link } from "react-router-dom";
import {
    ArrowRight,
    Award,
    Users,
    Target,
    Heart,
    Lightbulb,
    Rocket,
    Shield,
    Globe,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Sparkles,
    Briefcase,
    Zap,
    BarChart3,
    Star,
    Mail,
    Phone,
    MapPin,
    Clock,
    Code,
    Palette,
    Database,
    BarChart,
    MessageSquare,
    Handshake,
    Eye,
    Layers,
    Monitor,
    Smartphone,
    Camera
} from "lucide-react";
import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";
import employeeImg from "@/assets/images/Mask Group.png";
import Ellipse1 from "@/assets/images/Ellipse 1.png";
import Ellipse13 from "@/assets/images/Ellipse 13.png";
import Image14 from "@/assets/images/image 14.png";
import Image15 from "@/assets/images/image 15.png";

// Team members for About Us (key leadership)
const leadershipTeam = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Chief Executive Officer",
        image: employeeImg,
        bio: "Visionary leader with 15+ years of experience in marketing and business strategy. Sarah founded the agency with a mission to transform how businesses connect with their audiences through data-driven creativity.",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Chief Marketing Officer",
        image: Ellipse1,
        bio: "Expert in digital marketing and brand development with proven track record. Michael brings innovative thinking and strategic vision to every client engagement, driving measurable results.",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Creative Director",
        image: Ellipse13,
        bio: "Award-winning creative professional specializing in visual identity and campaigns. Emily leads our creative team in delivering stunning visuals that captivate audiences and drive engagement.",
    },
    {
        id: 4,
        name: "David Thompson",
        role: "Head of Strategy",
        image: Image14,
        bio: "Strategic thinker with expertise in market analysis and growth planning. David ensures every campaign is built on solid data and strategic insights that deliver real business impact.",
    },
    {
        id: 5,
        name: "Lisa Anderson",
        role: "Senior Marketing Manager",
        image: Image15,
        bio: "Results-driven marketer with expertise in campaign management and analytics. Lisa oversees our client campaigns, ensuring excellence in execution and measurable outcomes.",
    },
];

// Mission, Vision & Values
const mission = {
    title: "Our Mission",
    description: "To empower businesses of all sizes with strategic marketing solutions that drive measurable growth and sustainable success. We combine data-driven insights with creative excellence to help our clients achieve their goals and exceed their expectations.",
    icon: Target,
};

const vision = {
    title: "Our Vision",
    description: "To become the most trusted marketing partner for forward-thinking businesses worldwide. We envision a future where every company has access to world-class marketing expertise that transforms their brand presence and accelerates their growth trajectory.",
    icon: Eye,
};

const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We embrace new ideas, cutting-edge technologies, and creative solutions that push boundaries and deliver exceptional results.",
    },
    {
        icon: Heart,
        title: "Integrity",
        description: "We operate with transparency, honesty, and ethical practices in every client relationship and business decision.",
    },
    {
        icon: Target,
        title: "Excellence",
        description: "We strive for perfection in everything we do, setting high standards and consistently delivering work that exceeds expectations.",
    },
    {
        icon: Users,
        title: "Collaboration",
        description: "We believe in the power of teamwork, both internally and with our clients, building strong partnerships that drive success.",
    },
    {
        icon: Rocket,
        title: "Growth",
        description: "We're committed to continuous learning, professional development, and helping our clients achieve sustainable growth.",
    },
    {
        icon: Shield,
        title: "Accountability",
        description: "We take ownership of our work, measure our results, and hold ourselves accountable for delivering on our promises.",
    },
];

// Agency Journey / Timeline
const timeline = [
    {
        year: "2010",
        title: "Foundation",
        description: "Founded with a vision to transform marketing through strategic thinking and creative excellence.",
        achievement: "Started with 3 team members and 5 clients",
    },
    {
        year: "2013",
        title: "First Major Award",
        description: "Recognized for excellence in digital marketing innovation and client service.",
        achievement: "Won 'Marketing Excellence Award' - Gold",
    },
    {
        year: "2016",
        title: "International Expansion",
        description: "Expanded operations to serve clients across 12+ countries, establishing global presence.",
        achievement: "Opened offices in London, New York, and Singapore",
    },
    {
        year: "2018",
        title: "100+ Projects Milestone",
        description: "Reached a significant milestone of completing 100+ successful projects across diverse industries.",
        achievement: "Served 50+ clients with 100% satisfaction rate",
    },
    {
        year: "2020",
        title: "Digital Transformation",
        description: "Pioneered remote collaboration and digital-first strategies, adapting to new market realities.",
        achievement: "Launched AI-powered analytics platform",
    },
    {
        year: "2023",
        title: "Industry Leadership",
        description: "Recognized as a top marketing agency with 860+ projects completed and 55+ happy clients.",
        achievement: "Achieved 100% repeat client rate",
    },
];

// How We Are Different
const differentiators = [
    {
        icon: BarChart3,
        title: "Data-Driven Decision Making",
        description: "Every strategy we develop is backed by comprehensive data analysis. We don't rely on assumptions—we use real insights to drive decisions that deliver measurable ROI.",
    },
    {
        icon: Zap,
        title: "Agile & Responsive",
        description: "We move fast and adapt quickly. Our agile approach means we can pivot strategies in real-time based on performance data and market changes, ensuring optimal results.",
    },
    {
        icon: Handshake,
        title: "True Partnership Model",
        description: "We're not just vendors—we're strategic partners. We invest in understanding your business deeply and work as an extension of your team to achieve shared goals.",
    },
    {
        icon: Sparkles,
        title: "Creative + Strategic Fusion",
        description: "We uniquely combine creative excellence with strategic rigor. Our campaigns are both visually stunning and strategically sound, ensuring they look great and perform even better.",
    },
    {
        icon: TrendingUp,
        title: "Proven Track Record",
        description: "With 98% success rate and 100% repeat client rate, our results speak for themselves. We don't just promise—we deliver measurable outcomes that drive business growth.",
    },
];

// Tools & Technologies
const toolsCategories = [
    {
        category: "Marketing Platforms",
        icon: Monitor,
        tools: [
            { name: "HubSpot", description: "Marketing automation and CRM" },
            { name: "Mailchimp", description: "Email marketing campaigns" },
            { name: "Hootsuite", description: "Social media management" },
            { name: "Buffer", description: "Content scheduling and analytics" },
        ],
    },
    {
        category: "Analytics Tools",
        icon: BarChart,
        tools: [
            { name: "Google Analytics", description: "Web analytics and insights" },
            { name: "Adobe Analytics", description: "Advanced analytics platform" },
            { name: "Mixpanel", description: "Product analytics and tracking" },
            { name: "SEMrush", description: "SEO and competitive analysis" },
        ],
    },
    {
        category: "CRM Systems",
        icon: Database,
        tools: [
            { name: "Salesforce", description: "Enterprise CRM solution" },
            { name: "HubSpot CRM", description: "All-in-one CRM platform" },
            { name: "Pipedrive", description: "Sales-focused CRM" },
            { name: "Zoho CRM", description: "Cloud-based CRM" },
        ],
    },
    {
        category: "Design Tools",
        icon: Palette,
        tools: [
            { name: "Adobe Creative Suite", description: "Professional design software" },
            { name: "Figma", description: "Collaborative design platform" },
            { name: "Sketch", description: "UI/UX design tool" },
            { name: "Canva Pro", description: "Graphic design platform" },
        ],
    },
];

// Culture & Work Philosophy
const culturePoints = [
    {
        icon: MessageSquare,
        title: "Open Communication",
        description: "We foster an environment of transparent, honest communication. Every team member's voice is valued, and we encourage open dialogue with clients to ensure alignment and success.",
    },
    {
        icon: Users,
        title: "Collaborative Approach",
        description: "We believe the best results come from collaboration. Our cross-functional teams work together seamlessly, and we partner closely with clients as an extension of their team.",
    },
    {
        icon: Heart,
        title: "Client-Centric Focus",
        description: "Your success is our success. We prioritize understanding your business goals, challenges, and vision, ensuring every strategy and campaign is tailored to your unique needs.",
    },
    {
        icon: Rocket,
        title: "Continuous Innovation",
        description: "We stay ahead of industry trends and continuously innovate our processes. Our team is always learning, experimenting, and adopting new technologies and methodologies.",
    },
];

export default function AboutUs() {
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
                        <span className="text-white font-medium">About Us</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                                <Sparkles size={16} />
                                <span>Our Story</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                Building Brands That
                                <br />
                                <span className="bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                                    Drive Results
                                </span>
                            </h1>

                            <p className="text-xl text-emerald-50 mb-6 leading-relaxed">
                                We help forward-thinking businesses across diverse industries achieve their marketing goals through strategic planning, creative excellence, and data-driven execution.
                            </p>

                            <p className="text-lg text-emerald-100 leading-relaxed">
                                Since 2010, we've been transforming how companies connect with their audiences, combining innovation with proven methodologies to deliver measurable growth and sustainable success.
                            </p>
                        </div>

                        <div className="relative lg:block hidden">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50"></div>
                                <img
                                    src={HeroImage}
                                    alt="About Us"
                                    className="relative rounded-3xl shadow-2xl w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= MISSION, VISION & VALUES ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Target size={16} />
                            <span>Our Foundation</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Mission, Vision & Values
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and shape how we work
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Mission */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-10 border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                                    <mission.icon className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                    {mission.title}
                                </h3>
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {mission.description}
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                                    <vision.icon className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                    {vision.title}
                                </h3>
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {vision.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-4
                                              group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon className="text-emerald-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= AGENCY JOURNEY / TIMELINE ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Clock size={16} />
                            <span>Our Journey</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Agency Timeline
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Key milestones and achievements that have shaped our growth
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-200 transform md:-translate-x-1/2"></div>

                        <div className="space-y-12">
                            {timeline.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center gap-8 ${
                                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>

                                    {/* Content */}
                                    <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                                        <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                                                <Calendar size={14} />
                                                <span>{milestone.year}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-slate-600 mb-4 leading-relaxed">
                                                {milestone.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                                                <CheckCircle2 size={16} />
                                                <span>{milestone.achievement}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= TEAM SECTION ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Users size={16} />
                            <span>Our Leadership</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            The experienced leaders driving our agency's success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {leadershipTeam.map((member) => (
                            <div
                                key={member.id}
                                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                         hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 
                                                  group-hover:from-black/70 transition-all"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-emerald-600 font-semibold mb-4 text-sm">{member.role}</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            to="/team"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>View Full Team</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= HOW WE ARE DIFFERENT ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Star size={16} />
                            <span>What Sets Us Apart</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            How We Are Different
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            The unique approaches and methodologies that make us stand out
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {differentiators.map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6
                                              group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="text-emerald-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TOOLS & TECHNOLOGIES ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Code size={16} />
                            <span>Our Toolkit</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Tools & Technologies
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            The platforms and tools we use to deliver exceptional results
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {toolsCategories.map((category, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6
                                              group-hover:bg-emerald-100 transition-colors">
                                    <category.icon className="text-emerald-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors">
                                    {category.category}
                                </h3>
                                <ul className="space-y-4">
                                    {category.tools.map((tool, i) => (
                                        <li key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                            <div className="font-semibold text-slate-900 text-sm mb-1">{tool.name}</div>
                                            <div className="text-xs text-slate-500">{tool.description}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CULTURE & WORK PHILOSOPHY ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Heart size={16} />
                            <span>Our Culture</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Culture & Work Philosophy
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            How we work together and what drives our approach to client relationships
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {culturePoints.map((point, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6
                                                  group-hover:bg-emerald-100 transition-colors">
                                        <point.icon className="text-emerald-600" size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {point.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {point.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SOFT CTA SECTION ================= */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                                <Handshake size={16} />
                                <span>Let's Connect</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Ready to Start Your Journey?
                            </h2>
                            <p className="text-emerald-50 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                                We'd love to learn about your business and explore how we can help you achieve your marketing goals. 
                                Let's have a conversation about your vision and how we can bring it to life together.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/contact"
                                    className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                             hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl
                                             flex items-center justify-center gap-2"
                                >
                                    <Mail size={20} />
                                    <span>Get In Touch</span>
                                </Link>
                                <Link
                                    to="/projects"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                                             hover:bg-white/20 transition-all duration-300
                                             flex items-center justify-center gap-2"
                                >
                                    <Briefcase size={20} />
                                    <span>View Our Work</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
