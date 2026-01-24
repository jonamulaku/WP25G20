import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
    ArrowRight,
    Target,
    Heart,
    Lightbulb,
    Rocket,
    Users,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Sparkles,
    Briefcase,
    Zap,
    BarChart3,
    Star,
    Mail,
    Clock,
    Handshake,
    Eye,
    Award,
} from "lucide-react";
import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";

/* ============================== STYLES ============================== */
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-right {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fade-in-left {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes rotate-in {
    from { opacity: 0; transform: rotate(-5deg) scale(0.95); }
    to { opacity: 1; transform: rotate(0) scale(1); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  .animate-fade-in-right {
    animation: fade-in-right 1s ease-out;
  }
  .animate-fade-in-left {
    animation: fade-in-left 1s ease-out;
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  .animate-slide-up {
    animation: slide-up 0.8s ease-out forwards;
  }
  .animate-scale-in {
    animation: scale-in 0.6s ease-out forwards;
  }
  .animate-rotate-in {
    animation: rotate-in 0.7s ease-out forwards;
  }
  .scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .scroll-reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

function PatternBg() {
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
  );
}

function SectionHeader({ badgeIcon: BadgeIcon, badgeText, title, desc, align = "center" }) {
  const isCenter = align === "center";
  return (
    <div className={`${isCenter ? "text-center" : ""} mb-16`}>
      <div
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 ${isCenter ? "mx-auto" : ""
          } bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300`}
      >
        {BadgeIcon ? <BadgeIcon size={16} className="shrink-0" /> : null}
        <span>{badgeText}</span>
      </div>
      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">{title}</h2>
      {desc ? <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">{desc}</p> : null}
    </div>
  );
}

// Our Team (3 people)
const teamMembers = [
    {
        id: 1,
        name: "Alex Martinez",
        role: "Digital Marketing Specialist",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
        bio: "Expert in digital marketing strategies with a proven track record of driving measurable results. Alex specializes in SEO, social media management, and data-driven campaign optimization.",
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Graphic Designer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
        bio: "Creative professional with a passion for visual storytelling. Sarah transforms brand visions into compelling designs that captivate audiences and strengthen brand recognition.",
    },
    {
        id: 3,
        name: "Michael Thompson",
        role: "Campaign Manager",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
        bio: "Strategic campaign manager with expertise in orchestrating end-to-end marketing campaigns. Michael ensures seamless execution and optimal performance across all channels.",
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

// Core Values (3-4)
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
];

// Agency Timeline (4 milestones)
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
        year: "2023",
        title: "Industry Leadership",
        description: "Recognized as a top marketing agency with 860+ projects completed and 55+ happy clients.",
        achievement: "Achieved 100% repeat client rate",
    },
];

// How We Are Different (3 points)
const differentiators = [
    {
        icon: BarChart3,
        title: "Data-Driven Decision Making",
        description: "Every strategy we develop is backed by comprehensive data analysis. We don't rely on assumptions—we use real insights to drive decisions that deliver measurable ROI.",
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
];

export default function AboutUs() {
    // Scroll reveal animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* ================= HERO (SHORT) ================= */}
                <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden">
                    <PatternBg />

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-16 lg:py-20 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* LEFT */}
                            <div className="space-y-8 relative z-10">
                                {/* Breadcrumb */}
                                <nav className="flex items-center gap-2 text-sm text-emerald-50 animate-fade-in">
                                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                    <span className="text-emerald-200">/</span>
                                    <span className="text-white font-medium">About Us</span>
                                </nav>

                                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-effect rounded-full text-white text-sm font-semibold shadow-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 animate-fade-in">
                                    <Sparkles size={16} className="shrink-0" />
                                    <span>Our Story</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                    Building Brands That
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-100 bg-clip-text text-transparent">
                                        Drive Results
                                    </span>
                                </h1>

                                <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                    We help forward-thinking businesses achieve their marketing goals through strategic planning, creative excellence, and data-driven execution.
                                </p>
                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="relative lg:block hidden animate-fade-in-right">
                                <div className="relative group">
                                    <div className="absolute -inset-6 bg-white/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-200/50 transition-shadow duration-500">
                                        <img
                                            src={HeroImage}
                                            alt="About Us"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 hover:scale-105 transition-all duration-300 animate-float glass-effect">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-lg">
                                            <Award className="text-emerald-700" size={26} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-extrabold text-slate-900 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">100%</div>
                                            <div className="text-xs text-slate-600 font-semibold">Repeat Client Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= MISSION & VISION ================= */}
                <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
                    {/* Simple Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <SectionHeader
                            badgeIcon={Target}
                            badgeText="Our Foundation"
                            title="Mission & Vision"
                            desc="The principles that guide everything we do and shape how we work"
                        />

                        {/* Mission & Vision */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Mission */}
                            <div className="relative group scroll-reveal">
                                <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl p-5 border-2 border-emerald-100 
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 
                                             transition-all duration-300 hover:-translate-y-1 h-full">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Icon with Animation */}
                                    <div className="mb-4 relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center 
                                                     group-hover:from-emerald-200 group-hover:to-emerald-300 
                                                     group-hover:scale-105
                                                     transition-all duration-300 shadow-lg">
                                            <mission.icon className="text-emerald-700 relative z-10" size={24} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {mission.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-sm font-light">
                                        {mission.description}
                                    </p>
                                    
                                    {/* Accent Line */}
                                    <div className="mt-4 w-12 h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full 
                                                 group-hover:w-20 transition-all duration-300"></div>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="relative group scroll-reveal">
                                <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl p-5 border-2 border-slate-200 
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 
                                             transition-all duration-300 hover:-translate-y-1 h-full">
                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Icon with Animation */}
                                    <div className="mb-4 relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center 
                                                     group-hover:from-blue-200 group-hover:to-cyan-300 
                                                     group-hover:scale-105
                                                     transition-all duration-300 shadow-lg">
                                            <vision.icon className="text-blue-700 relative z-10" size={24} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {vision.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-sm font-light">
                                        {vision.description}
                                    </p>
                                    
                                    {/* Accent Line */}
                                    <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full 
                                                 group-hover:w-20 transition-all duration-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= CORE VALUES ================= */}
                <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
                    {/* Simple Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl"></div>
                    </div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }} />

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <SectionHeader
                            badgeIcon={Heart}
                            badgeText="What We Stand For"
                            title="Core Values"
                            desc="The principles that guide everything we do"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => {
                                const gradients = [
                                    "from-amber-50 to-orange-50",
                                    "from-pink-50 to-rose-50",
                                    "from-emerald-50 to-teal-50",
                                    "from-blue-50 to-cyan-50",
                                ];
                                const iconGradients = [
                                    "from-amber-100 to-orange-200",
                                    "from-pink-100 to-rose-200",
                                    "from-emerald-100 to-teal-200",
                                    "from-blue-100 to-cyan-200",
                                ];
                                const iconColors = [
                                    "text-amber-600",
                                    "text-pink-600",
                                    "text-emerald-600",
                                    "text-blue-600",
                                ];
                                
                                return (
                                    <div
                                        key={index}
                                        className="group relative"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Glow Effect */}
                                        <div className={`absolute -inset-2 bg-gradient-to-r ${iconGradients[index]} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                        
                                        <div className={`relative bg-gradient-to-br ${gradients[index]} rounded-2xl p-5 border-2 border-slate-200
                                                     hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                                     transition-all duration-300 hover:-translate-y-1 h-full scroll-reveal`}>
                                            {/* Icon with Enhanced Animation */}
                                            <div className="mb-4 relative">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradients[index]} flex items-center justify-center 
                                                             group-hover:scale-105
                                                             transition-all duration-300 shadow-lg`}>
                                                    <value.icon className={`${iconColors[index]} relative z-10`} size={22} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-base lg:text-lg font-extrabold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                                {value.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed text-xs font-light">
                                                {value.description}
                                            </p>
                                            
                                            {/* Decorative Accent */}
                                            <div className={`mt-4 w-10 h-1 bg-gradient-to-r ${iconGradients[index]} rounded-full 
                                                         group-hover:w-16 transition-all duration-300`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ================= AGENCY TIMELINE ================= */}
                <section className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white relative overflow-hidden">
                    {/* Simple Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <SectionHeader
                            badgeIcon={Clock}
                            badgeText="Our Journey"
                            title="Agency Timeline"
                            desc="Key milestones and achievements that have shaped our growth"
                        />

                        <div className="relative">
                            {/* Enhanced Timeline Line */}
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200 transform md:-translate-x-1/2 rounded-full"></div>
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-400 transform md:-translate-x-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="space-y-16">
                                {timeline.map((milestone, index) => {
                                    const colors = [
                                        "from-amber-400 to-orange-500",
                                        "from-emerald-400 to-teal-500",
                                        "from-blue-400 to-cyan-500",
                                        "from-purple-400 to-pink-500",
                                    ];
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`relative flex items-center gap-8 ${
                                                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                            }`}
                                            style={{ animationDelay: `${index * 0.15}s` }}
                                        >

                                            {/* Content */}
                                            <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                                                <div className="group relative">
                                                    {/* Glow Effect */}
                                                    <div className={`absolute -inset-2 bg-gradient-to-r ${colors[index]} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                                                    
                                                    <div className="relative bg-white rounded-2xl p-5 border-2 border-slate-200 
                                                                 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 
                                                                 transition-all duration-300 hover:-translate-y-1 scroll-reveal">
                                                        {/* Year Badge with Animation */}
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-50 to-emerald-100 
                                                                     text-emerald-700 rounded-full text-xs font-bold mb-4 
                                                                     border-2 border-emerald-200 group-hover:border-emerald-300
                                                                     group-hover:scale-105 transition-all duration-300 shadow-md">
                                                            <Calendar size={14} className="shrink-0" />
                                                            <span>{milestone.year}</span>
                                                        </div>
                                                        
                                                        <h3 className="text-lg lg:text-xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                                            {milestone.title}
                                                        </h3>
                                                        <p className="text-slate-600 mb-4 leading-relaxed text-sm font-light">
                                                            {milestone.description}
                                                        </p>
                                                        
                                                        {/* Achievement Badge */}
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 
                                                                     rounded-xl border border-emerald-100 group-hover:border-emerald-200
                                                                     group-hover:shadow-md transition-all duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center 
                                                                         group-hover:bg-emerald-200 group-hover:scale-105 transition-all duration-300">
                                                                <CheckCircle2 className="text-emerald-600" size={16} />
                                                            </div>
                                                            <span className="text-emerald-700 font-bold text-xs">{milestone.achievement}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= OUR TEAM ================= */}
                <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
                    {/* Simple Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <SectionHeader
                            badgeIcon={Users}
                            badgeText="Meet Our Team"
                            title="Our Team"
                            desc="The talented professionals who bring your marketing vision to life"
                        />

                        <div className="grid md:grid-cols-3 gap-10 mb-16">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    {/* Glow Effect */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    
                                    <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-slate-200
                                                 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                                 transition-all duration-300 hover:-translate-y-1 scroll-reveal">
                                        {/* Image Section with Enhanced Effects */}
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 
                                                          group-hover:from-black/80 transition-all duration-300"></div>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            
                                            {/* Floating Icon Badge */}
                                            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center 
                                                             shadow-lg group-hover:scale-105 transition-all duration-300">
                                                    <Award className="text-emerald-600" size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Content Section */}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                                        {member.name}
                                                    </h3>
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 
                                                                 rounded-full text-xs font-bold border border-emerald-100
                                                                 group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-300">
                                                        <Briefcase size={11} />
                                                        <span>{member.role}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="text-slate-600 text-xs leading-relaxed font-light mb-4">
                                                {member.bio}
                                            </p>
                                            
                                            {/* Social/Contact Icons Placeholder */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 group-hover:border-emerald-100 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center 
                                                             group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-300">
                                                    <Users className="text-emerald-600" size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs text-slate-500 font-semibold">Team Member</div>
                                                    <div className="text-xs text-emerald-600 font-bold">Expert Professional</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                to="/team"
                                onClick={() => {
                                    // Scroll to top when navigating to team page
                                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                                }}
                                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-base
                                         shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                         border-2 border-transparent hover:border-emerald-500"
                            >
                                <span className="leading-none">View All Team</span>
                                <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ================= HOW WE ARE DIFFERENT ================= */}
                <section className="py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
                    {/* Simple Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <SectionHeader
                            badgeIcon={Star}
                            badgeText="What Sets Us Apart"
                            title="How We Are Different"
                            desc="The unique approaches and methodologies that make us stand out"
                        />

                        <div className="grid md:grid-cols-3 gap-10">
                            {differentiators.map((item, index) => {
                                const gradients = [
                                    "from-blue-50 via-cyan-50 to-blue-50",
                                    "from-emerald-50 via-teal-50 to-emerald-50",
                                    "from-purple-50 via-pink-50 to-purple-50",
                                ];
                                const iconGradients = [
                                    "from-blue-100 to-cyan-200",
                                    "from-emerald-100 to-teal-200",
                                    "from-purple-100 to-pink-200",
                                ];
                                const iconColors = [
                                    "text-blue-600",
                                    "text-emerald-600",
                                    "text-purple-600",
                                ];
                                
                                return (
                                    <div
                                        key={index}
                                        className="group relative"
                                        style={{ animationDelay: `${index * 0.15}s` }}
                                    >
                                        {/* Glow Effect */}
                                        <div className={`absolute -inset-3 bg-gradient-to-r ${iconGradients[index]} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                                        
                                        <div className={`relative bg-gradient-to-br ${gradients[index]} rounded-2xl p-5 border-2 border-slate-200
                                                     hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                                     transition-all duration-300 hover:-translate-y-1 h-full scroll-reveal`}>
                                            {/* Enhanced Icon */}
                                            <div className="mb-4 relative">
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradients[index]} flex items-center justify-center 
                                                             group-hover:scale-105
                                                             transition-all duration-300 shadow-lg`}>
                                                    <item.icon className={`${iconColors[index]} relative z-10`} size={22} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-base lg:text-lg font-extrabold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed text-xs font-light">
                                                {item.description}
                                            </p>
                                            
                                            {/* Decorative Accent */}
                                            <div className={`mt-4 w-10 h-1 bg-gradient-to-r ${iconGradients[index]} rounded-full 
                                                         group-hover:w-16 transition-all duration-300`}></div>
                                            
                                            {/* Floating Badge */}
                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center 
                                                             shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                                    <CheckCircle2 className="text-emerald-600" size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ================= SOFT CTA ================= */}
                <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                    <PatternBg />
                    
                    {/* Simple Background Gradient */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <div className="max-w-4xl mx-auto scroll-reveal">
                            <div className="glass-effect rounded-2xl p-6 border border-white/20 text-center">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-effect rounded-full text-white text-sm font-semibold shadow-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 mb-6 animate-fade-in">
                                    <Handshake size={16} className="shrink-0" />
                                    <span>Let's Connect</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="text-lg lg:text-xl text-emerald-50/95 mb-6 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                    We'd love to learn about your business and explore how we can help you achieve your marketing goals. 
                                    Let's have a conversation about your vision and how we can bring it to life together.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold text-sm
                                                 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-105
                                                 border-2 border-transparent hover:border-emerald-100"
                                    >
                                        <Mail size={18} className="shrink-0" />
                                        <span className="leading-none">Get In Touch</span>
                                        <ArrowRight size={18} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                    <Link
                                        to="/projects"
                                        onClick={() => {
                                            // Scroll to top when navigating to projects page
                                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                                        }}
                                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 glass-effect text-white rounded-xl font-bold text-sm
                                                 border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-105
                                                 shadow-lg hover:shadow-xl"
                                    >
                                        <Briefcase size={18} className="shrink-0" />
                                        <span className="leading-none">View Our Work</span>
                                        <ArrowRight size={18} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
