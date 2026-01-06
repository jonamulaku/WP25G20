import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";
import StrategyIcon from "@/assets/icons/strategic.svg";
import MarketingIcon from "@/assets/icons/marketing.svg";
import DesignIcon from "@/assets/icons/design.svg";
import ResearchIcon from "@/assets/icons/research.svg";
import ProfilePic from "@/assets/images/Ellipse 1.png";
import Brands from "@/assets/images/brands.png";
import Relax from "@/assets/images/Relax.png";
import Music from "@/assets/images/Music.png";
import Nature from "@/assets/images/Nature.png";
import CarnivalImg from "@/assets/images/carnival.png";
import CampaignImg from "@/assets/images/campaign.png";
import Image1 from "@/assets/images/image 1.png";
import {
    ArrowRight,
    Play,
    TrendingUp,
    Award,
    Users,
    CheckCircle2,
    Sparkles,
    Briefcase,
    Target,
    Zap,
    BarChart3,
    Lightbulb,
    Rocket,
    Star,
    Mail,
    Phone,
    MapPin,
    Clock,
    Shield,
    Globe,
    Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
    {
        icon: StrategyIcon,
        title: "Strategic Planning",
        desc: "Data-driven strategies for sustainable growth and market leadership",
        features: ["Market Analysis", "Competitive Research", "Growth Planning"],
    },
    {
        icon: MarketingIcon,
        title: "Marketing & PR",
        desc: "Amplify your brand presence and reach your target audience effectively",
        features: ["Brand Awareness", "Media Relations", "Campaign Management"],
    },
    {
        icon: DesignIcon,
        title: "Design & Production",
        desc: "Stunning visuals that captivate audiences and drive engagement",
        features: ["Creative Design", "Content Production", "Visual Identity"],
    },
    {
        icon: ResearchIcon,
        title: "Research & Training",
        desc: "Deep insights and skill development to stay ahead of the curve",
        features: ["Market Research", "Training Programs", "Industry Insights"],
    },
];

const processSteps = [
    {
        number: "01",
        title: "Discovery & Strategy",
        desc: "We dive deep into your business, market, and goals to create a comprehensive strategy.",
        icon: Lightbulb,
    },
    {
        number: "02",
        title: "Creative Development",
        desc: "Our team brings your vision to life with innovative concepts and compelling designs.",
        icon: Rocket,
    },
    {
        number: "03",
        title: "Execution & Launch",
        desc: "We execute flawlessly across all channels, ensuring maximum impact and reach.",
        icon: Zap,
    },
    {
        number: "04",
        title: "Optimization & Growth",
        desc: "Continuous monitoring and optimization to ensure sustained growth and success.",
        icon: BarChart3,
    },
];

const featuredProjects = [
    {
        id: 1,
        title: "Carnival Community Engagement",
        category: "Events",
        image: CarnivalImg,
        results: "250K+ Reach",
    },
    {
        id: 2,
        title: "Digital Transformation Campaign",
        category: "Corporate",
        image: CampaignImg,
        results: "500K+ Reach",
    },
    {
        id: 3,
        title: "Educational Platform Launch",
        category: "Education",
        image: Image1,
        results: "320K+ Reach",
    },
];

const whyChooseUs = [
    {
        icon: Target,
        title: "Proven Results",
        desc: "98% success rate with measurable ROI for all our clients",
    },
    {
        icon: Shield,
        title: "Trusted Partner",
        desc: "100% repeat client rate speaks to our commitment and reliability",
    },
    {
        icon: Globe,
        title: "Global Expertise",
        desc: "Experience across multiple industries and international markets",
    },
    {
        icon: Heart,
        title: "Client-Centric",
        desc: "Your success is our priority. We're with you every step of the way",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* ================= LUXURY HERO SECTION ================= */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden min-h-[90vh] flex items-center">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-28 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* LEFT CONTENT */}
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                                <TrendingUp size={16} />
                                <span>Innovation Driven</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                                Provide Solutions
                                <br />
                                <span className="bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                                    With Creativity
                                </span>
                            </h1>

                            <p className="text-xl text-emerald-50 leading-relaxed max-w-xl">
                                Transform your vision into reality with our strategic approach.
                                We combine innovation, expertise, and creativity to deliver exceptional results
                                that drive growth and success.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    to="/projects"
                                    className="group relative px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold 
                                             shadow-xl hover:shadow-2xl 
                                             transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <span>Explore Projects</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <button
                                    type="button"
                                    className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold 
                                             border-2 border-white/30 hover:bg-white/20 
                                             transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center
                                                  group-hover:bg-white group-hover:text-emerald-600 transition-colors">
                                        <Play size={16} className="ml-0.5" />
                                    </div>
                                    <span>Watch Video</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center gap-8 pt-8 border-t border-white/20">
                                <div>
                                    <div className="text-2xl font-bold text-white">860+</div>
                                    <div className="text-sm text-emerald-50">Projects</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">55+</div>
                                    <div className="text-sm text-emerald-50">Clients</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">10+</div>
                                    <div className="text-sm text-emerald-50">Awards</div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="relative lg:block hidden">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50"></div>
                                <img
                                    src={HeroImage}
                                    alt="Hero"
                                    className="relative rounded-3xl shadow-2xl w-full object-cover"
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Award className="text-emerald-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">100%</div>
                                        <div className="text-xs text-slate-600">Repeat Client Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SERVICES SECTION ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Briefcase size={16} />
                            <span>Our Expertise</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            What Do We Help?
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive solutions tailored to your business needs, delivered with precision and excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100/50
                                         transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 
                                              group-hover:from-emerald-50/50 group-hover:to-transparent rounded-3xl 
                                              transition-all duration-500"></div>
                                <div className="relative z-10">
                                    <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6
                                                  group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                        <img src={item.icon} alt={item.title} className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        {item.desc}
                                    </p>
                                    <ul className="space-y-2">
                                        {item.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle2 className="text-emerald-600" size={14} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STATS SECTION ================= */}
            <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { value: "860+", label: "Projects Completed", icon: CheckCircle2 },
                            { value: "55+", label: "Happy Clients", icon: Users },
                            { value: "10+", label: "Awards Won", icon: Award },
                            { value: "100%", label: "Repeat Client Rate", icon: TrendingUp },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20
                                         hover:bg-white/20 hover:scale-105 transition-all duration-300
                                         text-center group"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center
                                              group-hover:bg-white/30 transition-colors">
                                    <stat.icon className="text-white" size={32} />
                                </div>
                                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-emerald-50 text-sm font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= HOW WE WORK / PROCESS ================= */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Rocket size={16} />
                            <span>Our Process</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            How We Work
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A proven methodology that ensures exceptional results at every stage
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div
                                key={index}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 
                                             hover:shadow-xl transition-all duration-300 h-full">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="text-5xl font-bold text-emerald-100 group-hover:text-emerald-200 transition-colors">
                                            {step.number}
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <step.icon className="text-emerald-600" size={24} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FEATURED PROJECTS ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <Sparkles size={16} />
                                <span>Featured Work</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                                Our Latest Projects
                            </h2>
                        </div>
                        <Link
                            to="/projects"
                            className="group hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>View All</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredProjects.map((project) => (
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
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">View Case Study</span>
                                        <ArrowRight className="text-emerald-600 group-hover:translate-x-2 transition-transform" size={18} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 lg:hidden text-center">
                        <Link
                            to="/projects"
                            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300"
                        >
                            View All Projects
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE US ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Star size={16} />
                            <span>Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            What Sets Us Apart
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We don't just deliver projects—we build lasting partnerships that drive sustainable growth
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1 text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center
                                              group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TESTIMONIAL SECTION ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Users size={16} />
                            <span>Client Success</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            We Shared Value With Our Clients
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Testimonial Card */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-20"></div>
                            <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
                                <div className="flex justify-center -mt-20 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50"></div>
                                        <img
                                            src={ProfilePic}
                                            alt="Client"
                                            className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="text-amber-400 fill-amber-400" size={20} />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-slate-700 text-lg leading-relaxed text-center mb-8 italic">
                                    "Working with this team has been transformative. Their strategic approach
                                    and creative solutions have exceeded our expectations and delivered
                                    measurable results for our business."
                                </p>

                                <div className="border-t border-slate-200 pt-6 text-center">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        Sally Lo, MBE
                                    </h3>
                                    <p className="text-slate-600">
                                        Sally Production Ltd.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="lg:block hidden">
                            <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                                    Trusted By Industry Leaders
                                </h3>
                                <img src={Brands} alt="Brands" className="w-full opacity-80 grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= NEWS SECTION ================= */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <span>Latest Updates</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                                News & Insights
                            </h2>
                        </div>
                        <Link
                            to="/news"
                            className="group hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <span>View All</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {[
                            { img: Relax, date: "August 27, 2023", title: "Winner – Innovative Use of Technology Marketing Award", desc: "Recognized for groundbreaking digital marketing strategies that transformed client engagement." },
                            { img: Music, date: "August 20, 2023", title: "New Partnership with Global Tech Leaders", desc: "Expanding our reach through strategic collaborations with industry pioneers." },
                            { img: Nature, date: "August 15, 2023", title: "Sustainability Initiative Launch", desc: "Leading the way in eco-friendly business practices and sustainable growth solutions." },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                to="/news"
                                className="group block bg-white rounded-2xl p-6 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="relative flex-shrink-0">
                                        <div className="absolute inset-0 bg-emerald-100 rounded-xl blur group-hover:blur-md transition-all"></div>
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="relative w-32 h-32 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-sm text-slate-500">{item.date}</span>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                                Featured
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <ArrowRight
                                        size={24}
                                        className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-2 
                                                 transition-all flex-shrink-0 hidden lg:block"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 lg:hidden">
                        <Link
                            to="/news"
                            className="block w-full text-center px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300"
                        >
                            View All News
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= CONTACT CTA ================= */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                                    <Mail size={16} />
                                    <span>Get In Touch</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                    Ready to Transform Your Business?
                                </h2>
                                <p className="text-emerald-50 text-lg">
                                    Let's discuss how we can help you achieve your marketing goals and drive exceptional results.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <Phone className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-emerald-50">Phone</div>
                                        <div className="text-white font-semibold">+44 0777 245 2848</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <Mail className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-emerald-50">Email</div>
                                        <div className="text-white font-semibold">info@marketingagency.co</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <MapPin className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-emerald-50">Location</div>
                                        <div className="text-white font-semibold">London, UK</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/contact"
                                    className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                             hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                                >
                                    Start a Project
                                </Link>
                                <button
                                    type="button"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                                             hover:bg-white/20 transition-all duration-300"
                                >
                                    Schedule Consultation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}