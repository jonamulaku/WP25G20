import { Link } from "react-router-dom";
import {
    ArrowRight,
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
    Calendar,
    Globe,
    Heart,
    Palette,
    BarChart,
    MessageSquare,
    Handshake,
    Eye,
    FileText,
    Megaphone,
    Building2,
    DollarSign,
    Clock,
} from "lucide-react";
import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";
import StrategyIcon from "@/assets/icons/strategic.svg";
import MarketingIcon from "@/assets/icons/marketing.svg";
import DesignIcon from "@/assets/icons/design.svg";
import ServiceImage1 from "@/assets/images/campaign.png";
import ServiceImage2 from "@/assets/images/image 17.png";
import ServiceImage3 from "@/assets/images/image 14.png";

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

// Detailed Services - The three main services
const detailedServices = [
    {
        id: "digital-marketing-performance",
        name: "Digital Marketing & Performance",
        icon: MarketingIcon,
        image: ServiceImage1,
        overview: "Our digital marketing specialists drive your online presence with strategic campaigns, social media management, SEO optimization, and data-driven marketing solutions that deliver measurable results.",
        methods: [
            {
                title: "Social Media Management",
                description: "We develop and execute comprehensive social media strategies across all major platforms, creating engaging content calendars, managing community interactions, and building authentic brand connections.",
                icon: MessageSquare,
            },
            {
                title: "SEO & Content Strategy",
                description: "We optimize your online visibility through keyword research, on-page optimization, technical SEO audits, and content strategies that rank higher in search results.",
                icon: Target,
            },
            {
                title: "Paid Advertising",
                description: "We manage paid campaigns across Google Ads, Facebook, Instagram, LinkedIn, and other platforms, optimizing ad spend for maximum ROI and conversion rates.",
                icon: TrendingUp,
            },
            {
                title: "Analytics & Reporting",
                description: "We track performance metrics, analyze campaign data, and provide comprehensive reports that show clear ROI and guide future marketing decisions.",
                icon: BarChart3,
            },
        ],
        deliverables: [
            "Comprehensive digital marketing strategy",
            "Social media content calendar and management",
            "SEO optimization and keyword targeting",
            "Paid advertising campaign setup and management",
            "Monthly performance analytics reports",
            "Conversion tracking and optimization",
        ],
    },
    {
        id: "branding-creative-design",
        name: "Branding & Creative Design",
        icon: DesignIcon,
        image: ServiceImage2,
        overview: "Our creative graphic designers transform your brand vision into compelling visual identities, marketing materials, and digital assets that captivate your audience and strengthen brand recognition.",
        methods: [
            {
                title: "Brand Identity Design",
                description: "We create complete brand identities including logos, color palettes, typography, and brand guidelines that establish a cohesive visual presence across all touchpoints.",
                icon: Sparkles,
            },
            {
                title: "Marketing Materials",
                description: "We design professional marketing collateral including brochures, flyers, business cards, presentations, and print materials that communicate your brand effectively.",
                icon: FileText,
            },
            {
                title: "Digital Graphics",
                description: "We create engaging digital graphics for websites, social media, email campaigns, and digital advertising that capture attention and drive engagement.",
                icon: Zap,
            },
            {
                title: "Visual Content Creation",
                description: "We produce high-quality visual content including infographics, illustrations, banners, and custom graphics that tell your brand story visually.",
                icon: Eye,
            },
        ],
        deliverables: [
            "Complete brand identity package",
            "Logo design and variations",
            "Brand style guide and guidelines",
            "Marketing collateral design",
            "Social media graphics and templates",
            "Website and digital asset design",
        ],
    },
    {
        id: "campaign-strategy-management",
        name: "Campaign Strategy & Management",
        icon: StrategyIcon,
        image: ServiceImage3,
        overview: "Our experienced campaign managers orchestrate end-to-end marketing campaigns, from strategic planning and creative development to execution, optimization, and performance analysis.",
        methods: [
            {
                title: "Campaign Strategy",
                description: "We develop comprehensive campaign strategies that align with your business goals, target the right audience, and leverage the most effective channels for maximum impact.",
                icon: Lightbulb,
            },
            {
                title: "Multi-Channel Execution",
                description: "We coordinate campaigns across multiple channels including email, social media, paid ads, content marketing, and events, ensuring consistent messaging and optimal reach.",
                icon: Globe,
            },
            {
                title: "Performance Optimization",
                description: "We continuously monitor campaign performance, A/B test different approaches, optimize budgets and targeting, and refine strategies based on real-time data and insights.",
                icon: TrendingUp,
            },
            {
                title: "ROI Tracking",
                description: "We implement comprehensive tracking systems to measure campaign ROI, conversion rates, customer acquisition costs, and other key performance indicators.",
                icon: BarChart3,
            },
        ],
        deliverables: [
            "Comprehensive campaign strategy document",
            "Multi-channel campaign execution plan",
            "Creative briefs and campaign assets",
            "Real-time performance monitoring",
            "Optimization recommendations and implementation",
            "Post-campaign analysis and ROI reports",
        ],
    },
];

// Who These Services Are For
const targetAudiences = [
    {
        icon: Building2,
        title: "Growing Businesses",
        description: "Companies ready to scale their marketing efforts and establish a stronger market presence.",
    },
    {
        icon: Users,
        title: "Startups & Entrepreneurs",
        description: "New businesses looking to build brand awareness and acquire their first customers.",
    },
    {
        icon: Globe,
        title: "Established Brands",
        description: "Well-established companies seeking to optimize their marketing strategies and expand their reach.",
    },
    {
        icon: Target,
        title: "Industry Leaders",
        description: "Market leaders wanting to maintain their competitive edge and explore new growth opportunities.",
    },
];

// How Engagement Works - High-level confirmation (3-4 simple steps)
const engagementSteps = [
    {
        number: "01",
        title: "Discovery Call",
        desc: "We learn about your business, goals, and challenges to understand what you need.",
        icon: Calendar,
    },
    {
        number: "02",
        title: "Strategy Proposal",
        desc: "We create a customized strategy and proposal tailored to your specific objectives.",
        icon: Lightbulb,
    },
    {
        number: "03",
        title: "Team Assignment",
        desc: "We assign our digital marketing specialist, graphic designer, and campaign manager to your project.",
        icon: Users,
    },
    {
        number: "04",
        title: "Execution & Growth",
        desc: "We execute the strategy, monitor performance, and continuously optimize for better results.",
        icon: TrendingUp,
    },
];

// Industry Use Cases
const industryUseCases = [
    {
        industry: "E-commerce",
        icon: Briefcase,
        description: "Drive online sales with SEO, social media, and strategic advertising campaigns tailored for online retailers.",
        services: ["Digital Marketing", "Content Creation", "Analytics"],
    },
    {
        industry: "Technology",
        icon: Zap,
        description: "Build brand awareness and acquire customers cost-effectively with growth-focused marketing strategies.",
        services: ["Campaign Management", "Graphic Design", "Analytics"],
    },
    {
        industry: "Healthcare",
        icon: Heart,
        description: "Establish trust and connect with patients through compliant, professional marketing campaigns.",
        services: ["Content Creation", "Graphic Design", "Digital Marketing"],
    },
    {
        industry: "Education",
        icon: Target,
        description: "Reach students and institutions with targeted campaigns that highlight your educational value.",
        services: ["Digital Marketing", "Campaign Management", "Content Creation"],
    },
];

export default function Services() {
    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* ================= HERO SECTION – What problem you solve ================= */}
                <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden">
                    <PatternBg />

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-32 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* LEFT */}
                            <div className="space-y-8 animate-fade-in">
                                {/* Breadcrumb */}
                                <nav className="flex items-center gap-2 text-sm text-emerald-50">
                                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                    <span className="text-emerald-200">/</span>
                                    <span className="text-white font-medium">Services</span>
                                </nav>

                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                                    <Briefcase size={16} className="shrink-0" />
                                    <span>Our Services</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                                    Marketing Challenges?
                                    <br />
                                    <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-100 bg-clip-text text-transparent">
                                        We Solve Them
                                    </span>
                                </h1>

                                <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light">
                                    Struggling with low brand visibility? Inconsistent messaging? Poor campaign performance? Our team of digital marketing specialists, graphic designers, and campaign managers transforms these challenges into measurable growth.
                                </p>
                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="relative lg:block hidden animate-fade-in-right">
                                <div className="relative group">
                                    <div className="absolute -inset-6 bg-white/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-200/50 transition-shadow duration-500">
                                        <img
                                            src={HeroImage}
                                            alt="Services"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= OUR SERVICES – Detailed Sections ================= */}
                <section id="our-services" className="py-32 bg-gradient-to-b from-white via-slate-50/30 to-white scroll-mt-20">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Sparkles}
                            badgeText="What We Offer"
                            title="Our Services"
                            desc="Comprehensive marketing solutions delivered by our expert team of digital marketing specialists, graphic designers, and campaign managers"
                        />

                        <div className="space-y-20">
                            {detailedServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="group relative"
                                >
                                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                                        {/* Left: Image Section */}
                                        <div className="space-y-6">
                                            {/* Main Image */}
                                            <div className="relative group/image">
                                                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 to-emerald-50/20 rounded-3xl blur-2xl opacity-50 group-hover/image:opacity-70 transition-opacity duration-500"></div>
                                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                                    <img
                                                        src={service.image}
                                                        alt={service.name}
                                                        className="w-full h-[350px] object-cover group-hover/image:scale-105 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                                    <div className="absolute top-6 left-6 z-10">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-white/80">
                                                            <img src={service.icon} alt={service.name} className="w-10 h-10" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Overview Text Below Image */}
                                            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-md">
                                                        <span className="text-xl font-extrabold text-emerald-700">0{index + 1}</span>
                                                    </div>
                                                    <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                                                        {service.name}
                                                    </h3>
                                                </div>
                                                <p className="text-base text-slate-600 leading-relaxed font-light">
                                                    {service.overview}
                                                </p>
                                            </div>

                                            {/* Deliverables Section */}
                                            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
                                                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-200">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                        <CheckCircle2 className="text-emerald-600" size={20} />
                                                    </div>
                                                    <h4 className="text-xl font-extrabold text-slate-900">What's Included</h4>
                                                </div>
                                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border-2 border-slate-200">
                                                    <ul className="space-y-3">
                                                        {service.deliverables.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3">
                                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                    <CheckCircle2 className="text-emerald-700" size={14} />
                                                                </div>
                                                                <span className="text-slate-700 text-sm font-medium leading-relaxed">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Methods Section */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-slate-200">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                    <Rocket className="text-emerald-600" size={20} />
                                                </div>
                                                <h4 className="text-xl font-extrabold text-slate-900">How We Do It</h4>
                                            </div>
                                            <div className="grid gap-4">
                                                {service.methods.map((method, i) => (
                                                    <div
                                                        key={i}
                                                        className="group/item bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover/item:from-emerald-100 group-hover/item:to-emerald-200 group-hover/item:scale-105 transition-all duration-300 flex-shrink-0 shadow-md">
                                                                <method.icon className="text-emerald-600" size={20} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-extrabold text-slate-900 mb-2 text-base group-hover/item:text-emerald-700 transition-colors leading-tight">
                                                                    {method.title}
                                                                </h5>
                                                                <p className="text-sm text-slate-600 leading-relaxed font-light">
                                                                    {method.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= WHO THESE SERVICES ARE FOR ================= */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Users}
                            badgeText="Who We Serve"
                            title="Who These Services Are For"
                            desc="We work with businesses at every stage, from startups to industry leaders"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {targetAudiences.map((audience, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-9 border-2 border-slate-200
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                             transition-all duration-300 hover:-translate-y-1 text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 mx-auto
                                                  group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                                  transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <audience.icon className="text-emerald-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {audience.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base font-light">
                                        {audience.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= HOW ENGAGEMENT WORKS ================= */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Rocket}
                            badgeText="How We Work"
                            title="How Engagement Works"
                            desc="A simple, transparent process that gets you results"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {engagementSteps.map((step, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                                    <div className="relative bg-white rounded-3xl p-9 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1">
                                        <div className="flex items-start justify-between mb-7">
                                            <div className="text-6xl font-extrabold text-emerald-50 group-hover:text-emerald-100 transition-colors duration-300">
                                                {step.number}
                                            </div>
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center 
                                                           group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                                           transition-all duration-300 shadow-md group-hover:shadow-lg">
                                                <step.icon className="text-emerald-700" size={26} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-base font-light">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= PRICING DIRECTION ================= */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-3xl p-12 border-2 border-slate-200 shadow-xl">
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full text-emerald-700 text-sm font-semibold mb-6 border border-emerald-100">
                                        <DollarSign size={16} className="shrink-0" />
                                        <span>Pricing</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                                        Custom Pricing Based on Your Needs
                                    </h2>
                                    <p className="text-lg lg:text-xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
                                        We believe in transparent, value-based pricing that aligns with your business goals. Every project is unique, and our pricing reflects the scope, complexity, and expected outcomes.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                            <Target className="text-emerald-600" size={24} />
                                        </div>
                                        <h3 className="font-extrabold text-slate-900 mb-2">Project Scope</h3>
                                        <p className="text-sm text-slate-600 font-light">
                                            Number of services, deliverables, and campaign complexity
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                            <TrendingUp className="text-emerald-600" size={24} />
                                        </div>
                                        <h3 className="font-extrabold text-slate-900 mb-2">Business Goals</h3>
                                        <p className="text-sm text-slate-600 font-light">
                                            Your objectives, target metrics, and expected ROI
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                            <Clock className="text-emerald-600" size={24} />
                                        </div>
                                        <h3 className="font-extrabold text-slate-900 mb-2">Timeline</h3>
                                        <p className="text-sm text-slate-600 font-light">
                                            Project duration, launch dates, and ongoing support needs
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-base
                                                 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 border-2 border-transparent hover:border-emerald-500"
                                    >
                                        <Calendar size={20} className="shrink-0" />
                                        <span className="leading-none">Schedule a Consultation</span>
                                        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= PROOF OR CONTEXT – Industry Use Cases ================= */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        <SectionHeader
                            badgeIcon={Globe}
                            badgeText="Industries We Serve"
                            title="Industry Use Cases"
                            desc="We adapt our services to meet the unique needs of different industries"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {industryUseCases.map((useCase, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-9 border-2 border-slate-200
                                             hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50
                                             transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6
                                                  group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                                  transition-all duration-300 shadow-md group-hover:shadow-lg">
                                        <useCase.icon className="text-emerald-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                        {useCase.industry}
                                    </h3>
                                    <p className="text-slate-600 text-base mb-4 leading-relaxed font-light">
                                        {useCase.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {useCase.services.map((service, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= STRONG CTA – What to do next ================= */}
                <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                    <PatternBg />

                    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300 mb-6">
                                    <Handshake size={16} className="shrink-0" />
                                    <span>Ready to Get Started?</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                                    Let's Transform Your Marketing
                                </h2>
                                <p className="text-xl text-emerald-50/95 mb-8 leading-relaxed max-w-2xl mx-auto font-light">
                                    Not sure which service fits your business? Book a free strategy call and we'll guide you through the options, answer your questions, and help you choose the best path forward for your goals.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                                                 shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 border-2 border-transparent hover:border-emerald-100"
                                    >
                                        <Calendar size={20} className="shrink-0" />
                                        <span className="leading-none">Book a Strategy Call</span>
                                        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-base
                                                 border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 shadow-lg hover:shadow-xl"
                                    >
                                        <Mail size={20} className="shrink-0" />
                                        <span className="leading-none">Contact Us</span>
                                        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                    <Link
                                        to="/projects"
                                        onClick={() => {
                                            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                                        }}
                                        className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-base
                                                 border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                                                 shadow-lg hover:shadow-xl"
                                    >
                                        <Briefcase size={20} className="shrink-0" />
                                        <span className="leading-none">View Case Studies</span>
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
