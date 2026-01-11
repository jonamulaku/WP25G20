import { Link } from "react-router-dom";
import {
    ArrowRight,
    Search,
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
    Calendar,
    Shield,
    Globe,
    Heart,
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
    Camera,
    FileText,
    Megaphone,
    ShoppingCart,
    Building2,
    Rocket as RocketIcon,
    Store,
    DollarSign,
    Clock,
    ArrowDown,
    ArrowUp
} from "lucide-react";
import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";
import StrategyIcon from "@/assets/icons/strategic.svg";
import MarketingIcon from "@/assets/icons/marketing.svg";
import DesignIcon from "@/assets/icons/design.svg";
import ResearchIcon from "@/assets/icons/research.svg";

// Services Overview - High-Level View
const servicesOverview = [
    {
        id: "seo",
        name: "Search Engine Optimization (SEO)",
        icon: Search,
        description: "Boost your organic visibility and drive qualified traffic through data-driven SEO strategies.",
        color: "emerald",
    },
    {
        id: "ppc",
        name: "Pay-Per-Click Advertising",
        icon: TrendingUp,
        description: "Maximize ROI with strategic PPC campaigns across Google, Bing, and social platforms.",
        color: "blue",
    },
    {
        id: "social-media",
        name: "Social Media Marketing",
        icon: MessageSquare,
        description: "Build brand awareness and engage your audience with compelling social media strategies.",
        color: "purple",
    },
    {
        id: "content-marketing",
        name: "Content Marketing",
        icon: FileText,
        description: "Create valuable content that attracts, engages, and converts your target audience.",
        color: "orange",
    },
    {
        id: "branding",
        name: "Brand Strategy & Design",
        icon: Palette,
        description: "Develop a powerful brand identity that resonates with your audience and drives loyalty.",
        color: "pink",
    },
    {
        id: "email-marketing",
        name: "Email Marketing",
        icon: Mail,
        description: "Nurture leads and drive conversions with personalized, data-driven email campaigns.",
        color: "indigo",
    },
];

// Detailed Service Breakdowns
const serviceDetails = {
    seo: {
        name: "Search Engine Optimization (SEO)",
        icon: Search,
        overview: {
            title: "What is SEO & Why It Matters",
            description: "SEO is the foundation of sustainable online growth. Unlike paid advertising, organic search traffic builds over time and delivers long-term value. We help businesses rank higher in search results, attract qualified visitors, and convert them into customers—all while building authority in your industry.",
        },
        deliverables: [
            "Comprehensive technical SEO audit",
            "Keyword research and strategy development",
            "On-page optimization (meta tags, headings, content)",
            "Content recommendations and optimization",
            "Link building and outreach strategy",
            "Local SEO optimization (if applicable)",
            "Performance tracking and monthly reports",
            "Competitor analysis and gap identification",
        ],
        process: [
            {
                step: "01",
                title: "Website & Market Analysis",
                description: "We conduct a thorough audit of your current SEO performance, analyze your competitors, and identify opportunities in your market.",
            },
            {
                step: "02",
                title: "Strategy Definition",
                description: "Based on our analysis, we develop a customized SEO strategy aligned with your business goals and target audience.",
            },
            {
                step: "03",
                title: "Implementation",
                description: "Our team implements technical optimizations, creates optimized content, and builds quality backlinks to improve your rankings.",
            },
            {
                step: "04",
                title: "Monitoring & Optimization",
                description: "We continuously monitor performance, track rankings, and optimize strategies based on data and algorithm updates.",
            },
            {
                step: "05",
                title: "Reporting & Insights",
                description: "Monthly reports provide clear insights into traffic growth, keyword rankings, and conversion improvements.",
            },
        ],
        tools: [
            { name: "Google Analytics", description: "Traffic and behavior analysis" },
            { name: "Google Search Console", description: "Search performance monitoring" },
            { name: "SEMrush", description: "Keyword research and competitor analysis" },
            { name: "Ahrefs", description: "Backlink analysis and tracking" },
            { name: "Screaming Frog", description: "Technical SEO auditing" },
        ],
        outcomes: [
            { metric: "Increased Organic Traffic", value: "150-300%", description: "Average traffic growth within 6-12 months" },
            { metric: "Improved Keyword Rankings", value: "Top 10", description: "Target keywords ranking on first page" },
            { metric: "Better Conversion Rates", value: "25-40%", description: "Higher quality traffic leads to better conversions" },
            { metric: "Enhanced Domain Authority", value: "+15-25", description: "Improved overall site credibility and trust" },
        ],
    },
    ppc: {
        name: "Pay-Per-Click Advertising",
        icon: TrendingUp,
        overview: {
            title: "What is PPC & Why It Matters",
            description: "PPC advertising delivers immediate, measurable results. While SEO builds long-term value, PPC gets you in front of your target audience right now. We create and manage campaigns that maximize your ad spend, improve quality scores, and drive conversions across Google Ads, Microsoft Advertising, and social platforms.",
        },
        deliverables: [
            "Campaign strategy and setup",
            "Keyword research and negative keyword lists",
            "Ad copy creation and A/B testing",
            "Landing page optimization recommendations",
            "Bid management and budget optimization",
            "Conversion tracking setup",
            "Monthly performance reports",
            "Ongoing campaign optimization",
        ],
        process: [
            {
                step: "01",
                title: "Account Audit & Strategy",
                description: "We analyze your current PPC performance, identify opportunities, and develop a comprehensive campaign strategy.",
            },
            {
                step: "02",
                title: "Campaign Setup",
                description: "Our team sets up optimized campaigns with proper targeting, ad groups, and keyword structures.",
            },
            {
                step: "03",
                title: "Launch & Monitor",
                description: "We launch campaigns and closely monitor performance, making real-time adjustments to optimize results.",
            },
            {
                step: "04",
                title: "Continuous Optimization",
                description: "Ongoing optimization of bids, keywords, ad copy, and landing pages to improve ROI and reduce costs.",
            },
            {
                step: "05",
                title: "Reporting & Insights",
                description: "Regular reports show campaign performance, ROI, and recommendations for further improvements.",
            },
        ],
        tools: [
            { name: "Google Ads", description: "Search and display advertising" },
            { name: "Microsoft Advertising", description: "Bing and partner network ads" },
            { name: "Facebook Ads Manager", description: "Social media advertising" },
            { name: "Google Analytics", description: "Conversion tracking and analysis" },
            { name: "Google Tag Manager", description: "Tag and pixel management" },
        ],
        outcomes: [
            { metric: "Improved ROI", value: "3-5x", description: "Average return on ad spend" },
            { metric: "Lower Cost Per Click", value: "20-35%", description: "Reduction through optimization" },
            { metric: "Higher Conversion Rates", value: "30-50%", description: "Improved ad-to-conversion performance" },
            { metric: "Increased Qualified Traffic", value: "200-400%", description: "More relevant visitors to your site" },
        ],
    },
    "social-media": {
        name: "Social Media Marketing",
        icon: MessageSquare,
        overview: {
            title: "What is Social Media Marketing & Why It Matters",
            description: "Social media is where your audience lives, shares, and makes decisions. We help brands build authentic connections, increase engagement, and drive business results through strategic social media campaigns. From content creation to community management, we turn followers into customers.",
        },
        deliverables: [
            "Social media strategy and content calendar",
            "Platform-specific content creation",
            "Community management and engagement",
            "Influencer partnership coordination",
            "Social media advertising campaigns",
            "Analytics and performance reporting",
            "Crisis management protocols",
            "Brand voice and tone guidelines",
        ],
        process: [
            {
                step: "01",
                title: "Audit & Strategy Development",
                description: "We analyze your current social presence, audience insights, and competitor strategies to develop a winning plan.",
            },
            {
                step: "02",
                title: "Content Planning",
                description: "We create a content calendar aligned with your brand, audience preferences, and business objectives.",
            },
            {
                step: "03",
                title: "Content Creation & Publishing",
                description: "Our team creates engaging content and publishes it across your chosen platforms on a consistent schedule.",
            },
            {
                step: "04",
                title: "Community Engagement",
                description: "We actively engage with your audience, respond to comments, and build meaningful relationships.",
            },
            {
                step: "05",
                title: "Analysis & Optimization",
                description: "Regular analysis of performance metrics helps us refine strategies and improve engagement and conversions.",
            },
        ],
        tools: [
            { name: "Hootsuite", description: "Social media management and scheduling" },
            { name: "Buffer", description: "Content planning and analytics" },
            { name: "Canva", description: "Visual content creation" },
            { name: "Sprout Social", description: "Advanced social listening and analytics" },
            { name: "Facebook Business Suite", description: "Multi-platform management" },
        ],
        outcomes: [
            { metric: "Increased Followers", value: "150-250%", description: "Organic growth over 6-12 months" },
            { metric: "Higher Engagement Rate", value: "3-5%", description: "Above industry average engagement" },
            { metric: "Increased Brand Awareness", value: "200-300%", description: "Reach and impressions growth" },
            { metric: "More Website Traffic", value: "100-200%", description: "Social-driven traffic increase" },
        ],
    },
    "content-marketing": {
        name: "Content Marketing",
        icon: FileText,
        overview: {
            title: "What is Content Marketing & Why It Matters",
            description: "Content marketing builds trust, educates your audience, and drives organic growth. We create valuable, relevant content that attracts and converts your ideal customers. From blog posts to videos, we develop content strategies that position you as an industry authority and drive measurable business results.",
        },
        deliverables: [
            "Content strategy and editorial calendar",
            "Blog posts and articles",
            "Video content and scripts",
            "Infographics and visual content",
            "E-books and whitepapers",
            "Email newsletter content",
            "Content distribution strategy",
            "Performance analytics and reporting",
        ],
        process: [
            {
                step: "01",
                title: "Content Strategy Development",
                description: "We research your audience, identify content gaps, and develop a comprehensive content strategy aligned with your goals.",
            },
            {
                step: "02",
                title: "Content Creation",
                description: "Our team creates high-quality, valuable content that educates, entertains, and converts your audience.",
            },
            {
                step: "03",
                title: "Optimization & Publishing",
                description: "Content is optimized for SEO, formatted for readability, and published across your channels.",
            },
            {
                step: "04",
                title: "Distribution & Promotion",
                description: "We promote content through social media, email, and other channels to maximize reach and engagement.",
            },
            {
                step: "05",
                title: "Performance Analysis",
                description: "We track content performance, analyze what works, and refine our strategy for continuous improvement.",
            },
        ],
        tools: [
            { name: "WordPress", description: "Content management system" },
            { name: "Grammarly", description: "Content quality and editing" },
            { name: "Canva", description: "Visual content creation" },
            { name: "Google Analytics", description: "Content performance tracking" },
            { name: "Ahrefs", description: "Content research and SEO" },
        ],
        outcomes: [
            { metric: "Increased Organic Traffic", value: "200-400%", description: "Content-driven traffic growth" },
            { metric: "Higher Lead Generation", value: "150-250%", description: "More qualified leads from content" },
            { metric: "Improved Brand Authority", value: "Top Rankings", description: "Content ranking for target keywords" },
            { metric: "Better Engagement", value: "4-6 min", description: "Average time on page" },
        ],
    },
    branding: {
        name: "Brand Strategy & Design",
        icon: Palette,
        overview: {
            title: "What is Brand Strategy & Why It Matters",
            description: "Your brand is more than a logo—it's the emotional connection people have with your business. We help you develop a compelling brand identity that differentiates you from competitors, resonates with your target audience, and drives loyalty. From visual identity to brand voice, we create brands that people remember and trust.",
        },
        deliverables: [
            "Brand strategy and positioning",
            "Logo design and brand identity",
            "Visual style guide and brand guidelines",
            "Website design and development",
            "Marketing collateral design",
            "Brand voice and messaging framework",
            "Brand audit and competitive analysis",
            "Brand implementation support",
        ],
        process: [
            {
                step: "01",
                title: "Discovery & Research",
                description: "We dive deep into your business, market, competitors, and target audience to understand what makes you unique.",
            },
            {
                step: "02",
                title: "Strategy Development",
                description: "We develop a comprehensive brand strategy that defines your positioning, values, and messaging framework.",
            },
            {
                step: "03",
                title: "Visual Identity Creation",
                description: "Our designers create a compelling visual identity including logo, color palette, typography, and imagery style.",
            },
            {
                step: "04",
                title: "Brand Guidelines",
                description: "We create comprehensive brand guidelines ensuring consistent application across all touchpoints.",
            },
            {
                step: "05",
                title: "Implementation & Launch",
                description: "We help implement your new brand across all channels and provide ongoing support for brand consistency.",
            },
        ],
        tools: [
            { name: "Adobe Creative Suite", description: "Professional design software" },
            { name: "Figma", description: "Collaborative design platform" },
            { name: "Sketch", description: "UI/UX design tool" },
            { name: "Canva Pro", description: "Graphic design platform" },
            { name: "Brandfolder", description: "Brand asset management" },
        ],
        outcomes: [
            { metric: "Increased Brand Recognition", value: "80-120%", description: "Improved brand awareness and recall" },
            { metric: "Better Market Position", value: "Top 3", description: "Positioned as industry leader" },
            { metric: "Higher Customer Loyalty", value: "40-60%", description: "Improved customer retention" },
            { metric: "Consistent Brand Experience", value: "100%", description: "Unified brand across all touchpoints" },
        ],
    },
    "email-marketing": {
        name: "Email Marketing",
        icon: Mail,
        overview: {
            title: "What is Email Marketing & Why It Matters",
            description: "Email marketing delivers the highest ROI of any marketing channel. We help you build engaged email lists, create compelling campaigns, and nurture leads through automated sequences. From welcome emails to re-engagement campaigns, we turn subscribers into customers and customers into advocates.",
        },
        deliverables: [
            "Email marketing strategy",
            "List building and segmentation",
            "Email template design",
            "Automated email sequences",
            "Campaign creation and management",
            "A/B testing and optimization",
            "Deliverability optimization",
            "Performance analytics and reporting",
        ],
        process: [
            {
                step: "01",
                title: "Strategy & Setup",
                description: "We develop your email marketing strategy, set up your platform, and configure automation workflows.",
            },
            {
                step: "02",
                title: "List Building",
                description: "We help you grow your email list through lead magnets, opt-in forms, and strategic placement.",
            },
            {
                step: "03",
                title: "Campaign Creation",
                description: "Our team creates engaging email campaigns with compelling copy, beautiful design, and clear CTAs.",
            },
            {
                step: "04",
                title: "Automation Setup",
                description: "We set up automated sequences for welcome emails, nurture campaigns, and re-engagement flows.",
            },
            {
                step: "05",
                title: "Optimization & Analysis",
                description: "We continuously test, optimize, and analyze campaigns to improve open rates, clicks, and conversions.",
            },
        ],
        tools: [
            { name: "Mailchimp", description: "Email marketing automation" },
            { name: "HubSpot", description: "Marketing automation and CRM" },
            { name: "ConvertKit", description: "Email marketing for creators" },
            { name: "Klaviyo", description: "E-commerce email marketing" },
            { name: "Litmus", description: "Email testing and analytics" },
        ],
        outcomes: [
            { metric: "Higher Open Rates", value: "25-35%", description: "Above industry average open rates" },
            { metric: "Better Click-Through Rates", value: "3-5%", description: "Engaged subscribers clicking through" },
            { metric: "Increased Conversions", value: "20-30%", description: "Email-driven sales and sign-ups" },
            { metric: "Improved ROI", value: "42:1", description: "Average email marketing ROI" },
        ],
    },
};

// Service Packages
const servicePackages = [
    {
        name: "Starter",
        description: "Perfect for small businesses getting started",
        price: "Custom",
        services: [
            "1 Core Service",
            "Monthly Strategy Review",
            "Email Support",
            "Basic Analytics",
            "Quarterly Reports",
        ],
        idealFor: "Small businesses, startups, local businesses",
        supportLevel: "Email support with 48-hour response time",
        color: "emerald",
    },
    {
        name: "Growth",
        description: "Ideal for growing businesses ready to scale",
        price: "Custom",
        services: [
            "2-3 Core Services",
            "Bi-weekly Strategy Calls",
            "Priority Email & Phone Support",
            "Advanced Analytics",
            "Monthly Reports",
            "Dedicated Account Manager",
        ],
        idealFor: "Growing businesses, established companies",
        supportLevel: "Priority support with 24-hour response time",
        color: "blue",
    },
    {
        name: "Enterprise",
        description: "Comprehensive solution for large organizations",
        price: "Custom",
        services: [
            "Full Service Suite",
            "Weekly Strategy Sessions",
            "24/7 Priority Support",
            "Custom Analytics Dashboard",
            "Real-time Reporting",
            "Dedicated Team",
            "Custom Integrations",
        ],
        idealFor: "Large enterprises, corporations, agencies",
        supportLevel: "Dedicated support team with immediate response",
        color: "purple",
    },
];

// Industry Use Cases
const industryUseCases = [
    {
        industry: "E-commerce",
        icon: ShoppingCart,
        description: "Drive online sales with SEO, PPC, and social media strategies tailored for online retailers.",
        services: ["SEO", "PPC", "Social Media", "Email Marketing"],
    },
    {
        industry: "Startups",
        icon: RocketIcon,
        description: "Build brand awareness and acquire customers cost-effectively with growth-focused marketing.",
        services: ["Content Marketing", "Social Media", "SEO", "Branding"],
    },
    {
        industry: "Local Businesses",
        icon: Store,
        description: "Attract local customers and dominate your market with location-based marketing strategies.",
        services: ["Local SEO", "PPC", "Social Media", "Email Marketing"],
    },
    {
        industry: "Corporate Brands",
        icon: Building2,
        description: "Enhance brand reputation and drive B2B leads with enterprise-level marketing solutions.",
        services: ["Brand Strategy", "Content Marketing", "SEO", "PPC"],
    },
];

export default function Services() {
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
                        <span className="text-white font-medium">Services</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                                <Briefcase size={16} />
                                <span>Our Services</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                Marketing Solutions
                                <br />
                                <span className="bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                                    That Drive Growth
                                </span>
                            </h1>

                            <p className="text-xl text-emerald-50 mb-6 leading-relaxed">
                                We solve the marketing challenges that hold businesses back. From startups to enterprises, 
                                we provide strategic solutions that deliver measurable results—not just campaigns, but 
                                sustainable growth engines.
                            </p>

                            <p className="text-lg text-emerald-100 leading-relaxed">
                                We work with e-commerce brands, local businesses, startups, and corporate organizations 
                                across diverse industries to achieve their marketing goals.
                            </p>
                        </div>

                        <div className="relative lg:block hidden">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50"></div>
                                <img
                                    src={HeroImage}
                                    alt="Services"
                                    className="relative rounded-3xl shadow-2xl w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SERVICES OVERVIEW GRID ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Sparkles size={16} />
                            <span>What We Offer</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive marketing solutions tailored to your business needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesOverview.map((service) => (
                            <div
                                key={service.id}
                                className="group relative bg-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                         hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mb-6
                                              group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <Link
                                    to={`#${service.id}`}
                                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold 
                                             hover:text-emerald-700 transition-colors group-hover:gap-3"
                                >
                                    <span>View Details</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= INDIVIDUAL SERVICE BREAKDOWNS ================= */}
            {Object.entries(serviceDetails).map(([serviceId, service]) => (
                <section key={serviceId} id={serviceId} className="py-24 bg-gradient-to-br from-slate-50 to-white scroll-mt-20">
                    <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                        {/* Service Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                <service.icon size={16} />
                                <span>{service.name}</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                                {service.name}
                            </h2>
                        </div>

                        {/* A. Service Overview */}
                        <div className="mb-16">
                            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-lg">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {service.overview.title}
                                </h3>
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    {service.overview.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 mb-16">
                            {/* B. What's Included */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle2 className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">What's Included</h3>
                                </div>
                                <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                    <ul className="space-y-4">
                                        {service.deliverables.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle2 className="text-emerald-600 mt-1 flex-shrink-0" size={20} />
                                                <span className="text-slate-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* C. Our Process */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Rocket className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Our Process</h3>
                                </div>
                                <div className="space-y-4">
                                    {service.process.map((step, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-3xl font-bold text-emerald-100 flex-shrink-0">
                                                    {step.step}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                                                        {step.title}
                                                    </h4>
                                                    <p className="text-slate-600">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 mb-16">
                            {/* D. Tools & Platforms */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Code className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Tools & Platforms</h3>
                                </div>
                                <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                    <ul className="space-y-4">
                                        {service.tools.map((tool, index) => (
                                            <li key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                                <div className="font-semibold text-slate-900 mb-1">{tool.name}</div>
                                                <div className="text-sm text-slate-500">{tool.description}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* E. Expected Outcomes */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <Target className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">Expected Outcomes</h3>
                                </div>
                                <div className="space-y-4">
                                    {service.outcomes.map((outcome, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-slate-900">{outcome.metric}</h4>
                                                <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-bold">
                                                    {outcome.value}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">{outcome.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Case Study Link */}
                        <div className="text-center">
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                         font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span>View {service.name} Case Studies</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            ))}

            {/* ================= INDUSTRY USE CASES ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Globe size={16} />
                            <span>Industries We Serve</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Industry Use Cases
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We adapt our services to meet the unique needs of different industries
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {industryUseCases.map((useCase, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6
                                              group-hover:bg-emerald-100 transition-colors">
                                    <useCase.icon className="text-emerald-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {useCase.industry}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                    {useCase.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {useCase.services.map((service, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
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

            {/* ================= PRICING DIRECTION ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                                    <DollarSign size={16} />
                                    <span>Pricing</span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                                    Custom Pricing Based on Your Needs
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    We believe in transparent, value-based pricing that aligns with your business goals. 
                                    Every project is unique, and our pricing reflects the scope, complexity, and expected outcomes.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-50 rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                        <Target className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">Project Scope</h3>
                                    <p className="text-sm text-slate-600">
                                        Number of services, deliverables, and campaign complexity
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                        <TrendingUp className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">Business Goals</h3>
                                    <p className="text-sm text-slate-600">
                                        Your objectives, target metrics, and expected ROI
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                                        <Clock className="text-emerald-600" size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">Timeline</h3>
                                    <p className="text-sm text-slate-600">
                                        Project duration, launch dates, and ongoing support needs
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl 
                                             font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Calendar size={20} />
                                    <span>Schedule a Consultation</span>
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SERVICE PACKAGES ================= */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <Layers size={16} />
                            <span>Service Packages</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Choose Your Package
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Flexible packages designed to scale with your business
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {servicePackages.map((pkg, index) => (
                            <div
                                key={index}
                                className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-300
                                    ${index === 1 
                                        ? "border-emerald-300 shadow-2xl scale-105" 
                                        : "border-slate-200 hover:border-emerald-300 hover:shadow-xl"
                                    }`}
                            >
                                {index === 1 && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                    <p className="text-slate-600 mb-4">{pkg.description}</p>
                                    <div className="text-4xl font-bold text-emerald-600 mb-2">{pkg.price}</div>
                                    <p className="text-sm text-slate-500">Pricing</p>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {pkg.services.map((service, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="text-emerald-600 mt-1 flex-shrink-0" size={20} />
                                            <span className="text-slate-700">{service}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-slate-200 pt-6 space-y-4">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 mb-1">Ideal For:</div>
                                        <div className="text-sm text-slate-600">{pkg.idealFor}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 mb-1">Support Level:</div>
                                        <div className="text-sm text-slate-600">{pkg.supportLevel}</div>
                                    </div>
                                </div>
                                <Link
                                    to="/contact"
                                    className={`mt-8 block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300
                                        ${index === 1
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
                                            : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STRONG CTA SECTION ================= */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                                <Handshake size={16} />
                                <span>Not Sure Where to Start?</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Let's Find the Right Solution Together
                            </h2>
                            <p className="text-emerald-50 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                                Not sure which service fits your business? Book a free strategy call and we'll guide you 
                                through the options, answer your questions, and help you choose the best path forward for your goals.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/contact"
                                    className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                             hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl
                                             flex items-center justify-center gap-2"
                                >
                                    <Calendar size={20} />
                                    <span>Book a Free Strategy Call</span>
                                </Link>
                                <Link
                                    to="/projects"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                                             hover:bg-white/20 transition-all duration-300
                                             flex items-center justify-center gap-2"
                                >
                                    <Briefcase size={20} />
                                    <span>View Case Studies</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
