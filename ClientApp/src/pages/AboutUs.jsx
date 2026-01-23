import { Link } from "react-router-dom";
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
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  .animate-fade-in-right {
    animation: fade-in-right 1s ease-out;
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
                            <div className="space-y-8 animate-fade-in">
                                {/* Breadcrumb */}
                                <nav className="flex items-center gap-2 text-sm text-emerald-50">
                                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                    <span className="text-emerald-200">/</span>
                                    <span className="text-white font-medium">About Us</span>
                                </nav>

                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                                    <Sparkles size={16} className="shrink-0" />
                                    <span>Our Story</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                                    Building Brands That
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-100 bg-clip-text text-transparent">
                                        Drive Results
                                    </span>
                                </h1>

                                <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light">
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

                                <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-lg">
                                            <Award className="text-emerald-700" size={26} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-extrabold text-slate-900">100%</div>
                                            <div className="text-xs text-slate-600 font-semibold">Repeat Client Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= MISSION & VISION ================= */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Target}
                            badgeText="Our Foundation"
                            title="Mission & Vision"
                            desc="The principles that guide everything we do and shape how we work"
                        />

                        {/* Mission & Vision */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Mission */}
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-10 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105 transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <mission.icon className="text-emerald-600" size={32} />
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {mission.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-base font-light">
                                        {mission.description}
                                    </p>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 h-full">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105 transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <vision.icon className="text-emerald-600" size={32} />
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {vision.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed text-base font-light">
                                        {vision.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= CORE VALUES ================= */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Heart}
                            badgeText="What We Stand For"
                            title="Core Values"
                            desc="The principles that guide everything we do"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-9 border-2 border-slate-200
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                             transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4
                                                  group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                                  transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <value.icon className="text-emerald-600" size={28} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base font-light">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= AGENCY TIMELINE ================= */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Clock}
                            badgeText="Our Journey"
                            title="Agency Timeline"
                            desc="Key milestones and achievements that have shaped our growth"
                        />

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
                                            <div className="group relative bg-white rounded-3xl p-9 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-700 hover:-translate-y-2">
                                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-4 border border-emerald-100">
                                                    <Calendar size={14} className="shrink-0" />
                                                    <span>{milestone.year}</span>
                                                </div>
                                                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                                    {milestone.title}
                                                </h3>
                                                <p className="text-slate-600 mb-4 leading-relaxed text-base font-light">
                                                    {milestone.description}
                                                </p>
                                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                                    <CheckCircle2 size={16} className="shrink-0" />
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

                {/* ================= OUR TEAM ================= */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Users}
                            badgeText="Meet Our Team"
                            title="Our Team"
                            desc="The talented professionals who bring your marketing vision to life"
                        />

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="group relative bg-white rounded-3xl overflow-hidden border-2 border-slate-200
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                             transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 
                                                      group-hover:from-black/80 transition-all duration-700"></div>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors leading-tight">
                                            {member.name}
                                        </h3>
                                        <p className="text-emerald-600 font-bold mb-4 text-sm">{member.role}</p>
                                        <p className="text-slate-600 text-base leading-relaxed font-light">
                                            {member.bio}
                                        </p>
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
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Star}
                            badgeText="What Sets Us Apart"
                            title="How We Are Different"
                            desc="The unique approaches and methodologies that make us stand out"
                        />

                        <div className="grid md:grid-cols-3 gap-8">
                            {differentiators.map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-9 border-2 border-slate-200
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                             transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6
                                                  group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                                  transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <item.icon className="text-emerald-600" size={28} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base font-light">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= SOFT CTA ================= */}
                <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                    <PatternBg />

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300 mb-6">
                                    <Handshake size={16} className="shrink-0" />
                                    <span>Let's Connect</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="text-xl text-emerald-50/95 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
                                    We'd love to learn about your business and explore how we can help you achieve your marketing goals. 
                                    Let's have a conversation about your vision and how we can bring it to life together.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                                                 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 border-2 border-transparent hover:border-emerald-100"
                                    >
                                        <Mail size={20} className="shrink-0" />
                                        <span className="leading-none">Get In Touch</span>
                                        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                    <Link
                                        to="/projects"
                                        onClick={() => {
                                            // Scroll to top when navigating to projects page
                                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                                        }}
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-base
                                                 border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 shadow-lg hover:shadow-xl"
                                    >
                                        <Briefcase size={20} className="shrink-0" />
                                        <span className="leading-none">View Our Work</span>
                                        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
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
