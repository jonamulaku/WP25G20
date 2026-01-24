import { Link } from "react-router-dom";
import { useState } from "react";
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
    ChevronDown,
    ChevronUp,
    X,
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

// Pricing Packages - All packages include all three services with different levels based on price
const pricingPackages = [
    {
        id: "basic",
        name: "Basic",
        price: "$2,500",
        period: "per month",
        description: "Perfect for small businesses getting started with digital marketing",
        popular: false,
        features: [
            "Social Media Management (3 platforms)",
            "10 Social Media Posts per month",
            "Basic SEO Optimization",
            "Monthly Analytics Report",
            "Email Support",
            "1 Campaign Strategy Session",
            "Basic Logo Design",
            "Simple Brand Guidelines",
            "Basic Campaign Planning",
        ],
        services: [
            {
                name: "Digital Marketing & Performance",
                level: "Basic",
                includes: ["Social Media Management (3 platforms)", "10 Posts/month", "Basic SEO", "Monthly Reports"]
            },
            {
                name: "Branding & Creative Design",
                level: "Basic",
                includes: ["Basic Logo Design", "Simple Brand Guidelines", "Basic Social Media Graphics"]
            },
            {
                name: "Campaign Strategy & Management",
                level: "Basic",
                includes: ["1 Strategy Session/month", "Basic Campaign Planning", "Monthly Campaign Review"]
            }
        ],
        details: {
            overview: "Our Basic package is designed for small businesses and startups looking to establish their online presence. Get professional social media management, basic SEO, simple branding, and campaign planning to start building your brand.",
            deliverables: [
                "Social media content calendar (3 platforms)",
                "10 custom posts per month",
                "Basic SEO audit and optimization",
                "Monthly performance report",
                "Basic logo design",
                "Simple brand guidelines document",
                "1 campaign strategy session per month",
                "Basic campaign planning and setup",
                "Email support during business hours",
            ],
            timeline: "1-2 weeks setup, ongoing monthly service",
            support: "Email support with 48-hour response time",
        },
    },
    {
        id: "standard",
        name: "Standard",
        price: "$5,000",
        period: "per month",
        description: "Ideal for growing businesses ready to scale their marketing efforts",
        popular: true,
        features: [
            "Social Media Management (5 platforms)",
            "20 Social Media Posts per month",
            "Advanced SEO & Content Strategy",
            "Paid Advertising Management",
            "Bi-weekly Analytics Reports",
            "Priority Email & Phone Support",
            "2 Campaign Strategy Sessions",
            "Professional Brand Identity",
            "Complete Brand Guidelines",
            "Advanced Campaign Management",
        ],
        services: [
            {
                name: "Digital Marketing & Performance",
                level: "Standard",
                includes: ["Social Media Management (5 platforms)", "20 Posts/month", "Advanced SEO", "Paid Ads", "Bi-weekly Reports"]
            },
            {
                name: "Branding & Creative Design",
                level: "Standard",
                includes: ["Professional Brand Identity", "Complete Brand Guidelines", "Social Media Graphics", "Marketing Materials"]
            },
            {
                name: "Campaign Strategy & Management",
                level: "Standard",
                includes: ["2 Strategy Sessions/month", "Advanced Campaign Planning", "Multi-channel Campaigns", "Bi-weekly Reviews"]
            }
        ],
        details: {
            overview: "Our Standard package is perfect for growing businesses that need comprehensive marketing support. Get full social media management, advanced SEO, paid advertising, professional branding, and advanced campaign management.",
            deliverables: [
                "Social media content calendar (5 platforms)",
                "20 custom posts per month",
                "Advanced SEO optimization and content strategy",
                "Paid advertising campaign management",
                "Bi-weekly performance reports",
                "Professional brand identity design",
                "Complete brand guidelines document",
                "Marketing materials and graphics",
                "2 campaign strategy sessions per month",
                "Advanced multi-channel campaign management",
                "Priority support with 24-hour response",
            ],
            timeline: "2-3 weeks setup, ongoing monthly service",
            support: "Priority email and phone support with 24-hour response time",
        },
    },
    {
        id: "premium",
        name: "Premium",
        price: "$10,000",
        period: "per month",
        description: "Complete marketing solution for established businesses and enterprises",
        popular: false,
        features: [
            "Unlimited Social Media Management",
            "40+ Social Media Posts per month",
            "Full SEO & Content Marketing Strategy",
            "Multi-Channel Paid Advertising",
            "Weekly Analytics & Strategy Reports",
            "Dedicated Account Manager",
            "Unlimited Campaign Strategy Sessions",
            "Full Creative Design Services",
            "Complete Brand Strategy",
            "Enterprise Campaign Management",
            "Custom Marketing Materials",
        ],
        services: [
            {
                name: "Digital Marketing & Performance",
                level: "Premium",
                includes: ["Unlimited Social Media Management", "40+ Posts/month", "Full SEO Strategy", "Multi-channel Paid Ads", "Weekly Reports"]
            },
            {
                name: "Branding & Creative Design",
                level: "Premium",
                includes: ["Complete Brand Strategy", "Full Creative Design Services", "Custom Marketing Materials", "Brand Asset Library"]
            },
            {
                name: "Campaign Strategy & Management",
                level: "Premium",
                includes: ["Unlimited Strategy Sessions", "Enterprise Campaign Management", "End-to-end Campaign Execution", "Weekly Strategy Reviews"]
            }
        ],
        details: {
            overview: "Our Premium package is the ultimate marketing solution for established businesses. Get unlimited support across all our services with a dedicated account manager, comprehensive campaign management, complete branding, and full creative design services.",
            deliverables: [
                "Unlimited social media management across all platforms",
                "40+ custom posts per month",
                "Complete SEO and content marketing strategy",
                "Multi-channel paid advertising campaigns",
                "Weekly performance and strategy reports",
                "Complete brand strategy and positioning",
                "Full creative design services",
                "Custom marketing materials and collateral",
                "Brand asset library and guidelines",
                "End-to-end campaign management",
                "Unlimited campaign strategy sessions",
                "Enterprise-level campaign execution",
                "Dedicated account manager",
                "Weekly strategy check-ins",
            ],
            timeline: "3-4 weeks setup, ongoing monthly service with dedicated support",
            support: "Dedicated account manager with priority support and weekly check-ins",
        },
    },
];

// Pricing Section Component
function PricingSection() {
    const [expandedPackage, setExpandedPackage] = useState(null);

    const togglePackage = (packageId) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                <SectionHeader
                    badgeIcon={DollarSign}
                    badgeText="Pricing"
                    title="Choose Your Marketing Package"
                    desc="Transparent pricing packages designed to scale with your business needs"
                />

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
                    {pricingPackages.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            className="group relative flex flex-col"
                        >
                            {/* Popular Badge */}
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                                        <Star size={14} className="fill-white" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            <div
                                className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full ${
                                    pkg.popular
                                        ? "border-emerald-500 shadow-xl shadow-emerald-500/10"
                                        : "border-slate-200 hover:border-emerald-300 hover:shadow-lg"
                                }`}
                            >
                                {/* Header */}
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">{pkg.name}</h3>
                                    <p className="text-slate-600 text-xs mb-4 leading-relaxed">{pkg.description}</p>
                                    <div className="mb-4">
                                        <div className="flex items-baseline justify-center gap-1.5">
                                            <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                                            <span className="text-slate-500 text-xs">{pkg.period}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Features List - Compact */}
                                <div className="mb-6 flex-1">
                                    <ul className="space-y-2.5">
                                        {pkg.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                    pkg.popular
                                                        ? "bg-emerald-100"
                                                        : "bg-slate-100"
                                                }`}>
                                                    <CheckCircle2
                                                        className={pkg.popular ? "text-emerald-600" : "text-slate-600"}
                                                        size={14}
                                                    />
                                                </div>
                                                <span className="text-slate-700 text-xs font-medium leading-snug">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-2.5">
                                    <button
                                        onClick={() => togglePackage(pkg.id)}
                                        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                                            pkg.popular
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {expandedPackage === pkg.id ? (
                                            <>
                                                <span>Show Less</span>
                                                <ChevronUp size={16} />
                                            </>
                                        ) : (
                                            <>
                                                <span>View Details</span>
                                                <ChevronDown size={16} />
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        to="/contact"
                                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                                            pkg.popular
                                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                                                : "bg-slate-900 text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        <Calendar size={16} />
                                        Schedule a Meeting
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expanded Details Modal */}
                {expandedPackage && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-slate-200">
                            {(() => {
                                const pkg = pricingPackages.find(p => p.id === expandedPackage);
                                if (!pkg) return null;

                                return (
                                    <div className="p-8 lg:p-12">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-3xl font-extrabold text-slate-900">{pkg.name} Package</h2>
                                                    {pkg.popular && (
                                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            Most Popular
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                                                    <span className="text-slate-600">{pkg.period}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedPackage(null)}
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        {/* Overview */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                <Lightbulb className="text-emerald-600" size={24} />
                                                Overview
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">{pkg.details.overview}</p>
                                        </div>

                                        {/* Services Included */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                <Briefcase className="text-emerald-600" size={24} />
                                                Services Included
                                            </h3>
                                            <div className="space-y-4">
                                                {pkg.services.map((service, i) => (
                                                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="text-lg font-bold text-slate-900">{service.name}</h4>
                                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                                {service.level} Level
                                                            </span>
                                                        </div>
                                                        <ul className="space-y-1.5 mt-2">
                                                            {service.includes.map((item, j) => (
                                                                <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                                                    <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={16} />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deliverables */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="text-emerald-600" size={24} />
                                                What's Included
                                            </h3>
                                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                                                <ul className="space-y-3">
                                                    {pkg.details.deliverables.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <CheckCircle2 className="text-emerald-700" size={16} />
                                                            </div>
                                                            <span className="text-slate-700 font-medium">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Timeline & Support */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Clock className="text-emerald-600" size={20} />
                                                    <h4 className="font-extrabold text-slate-900">Timeline</h4>
                                                </div>
                                                <p className="text-slate-600 text-sm">{pkg.details.timeline}</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <MessageSquare className="text-emerald-600" size={20} />
                                                    <h4 className="font-extrabold text-slate-900">Support</h4>
                                                </div>
                                                <p className="text-slate-600 text-sm">{pkg.details.support}</p>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-5 border-2 border-emerald-200 text-center">
                                            <p className="text-slate-700 mb-6 font-medium">
                                                For more information about this package and to discuss how it fits your business needs, let's schedule a meeting.
                                            </p>
                                            <Link
                                                to="/contact"
                                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold
                                                         shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                                            >
                                                <Calendar size={20} />
                                                <span>Schedule a Meeting</span>
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

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

                        <div className="space-y-24">
                            {detailedServices.map((service, index) => (
                                <div
                                    key={service.id}
                                    className="group relative"
                                >
                                    {/* Service Header - Full Width */}
                                    <div className="mb-12 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg border-2 border-emerald-100 mb-6 mx-auto">
                                            <span className="text-2xl font-extrabold text-emerald-700">0{index + 1}</span>
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                                            {service.name}
                                        </h3>
                                        <p className="text-lg text-slate-600 leading-relaxed font-light max-w-4xl mx-auto">
                                            {service.overview}
                                        </p>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                                        {/* Left: Image and Deliverables */}
                                        <div className="space-y-8">
                                            {/* Main Image */}
                                            <div className="relative group/image">
                                                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-100/40 to-emerald-50/20 rounded-3xl blur-2xl opacity-50 group-hover/image:opacity-70 transition-opacity duration-500"></div>
                                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                                    <img
                                                        src={service.image}
                                                        alt={service.name}
                                                        className="w-full h-[300px] object-cover group-hover/image:scale-105 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                                    <div className="absolute top-6 left-6 z-10">
                                                        <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-white/80">
                                                            <img src={service.icon} alt={service.name} className="w-10 h-10" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Deliverables Section */}
                                            <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg">
                                                <div className="text-center mb-6">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                                        <CheckCircle2 size={16} className="shrink-0" />
                                                        <span>Deliverables</span>
                                                    </div>
                                                    <h4 className="text-2xl lg:text-3xl font-extrabold text-slate-900">What's Included</h4>
                                                </div>
                                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200">
                                                    <ul className="space-y-3">
                                                        {service.deliverables.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3">
                                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
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
                                        <div className="space-y-5">
                                            <div className="text-center mb-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                                    <Rocket size={16} className="shrink-0" />
                                                    <span>Our Process</span>
                                                </div>
                                                <h4 className="text-2xl lg:text-3xl font-extrabold text-slate-900">How We Do It</h4>
                                            </div>
                                            <div className="grid gap-5">
                                                {service.methods.map((method, i) => (
                                                    <div
                                                        key={i}
                                                        className="group/item bg-white rounded-xl p-5 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover/item:from-emerald-100 group-hover/item:to-emerald-200 group-hover/item:scale-105 transition-all duration-300 flex-shrink-0 shadow-md">
                                                                <method.icon className="text-emerald-600" size={22} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-extrabold text-slate-900 mb-2.5 text-lg group-hover/item:text-emerald-700 transition-colors leading-tight">
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
                                    className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200
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
                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                                    <div className="relative bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1">
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

                {/* ================= PRICING PACKAGES ================= */}
                <PricingSection />

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
                                    className="group relative bg-white rounded-2xl p-5 border-2 border-slate-200
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
