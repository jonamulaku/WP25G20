import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";
import StrategyIcon from "@/assets/icons/strategic.svg";
import MarketingIcon from "@/assets/icons/marketing.svg";
import DesignIcon from "@/assets/icons/design.svg";
import Story1Img from "@/assets/images/campaign.png";
import Story2Img from "@/assets/images/image 17.png";
import Story3Img from "@/assets/images/image 14.png";
// Using real human photos from Unsplash
const ProfilePic1 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";
const ProfilePic2 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
const ProfilePic3 = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";
const ProfilePic4 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

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
  Phone,
  MapPin,
  Calendar,
  Activity,
  Film,
  Laptop,
  GraduationCap,
  Leaf,
  DollarSign,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { authAPI } from "../services/api";

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
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
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
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  .animate-fade-in-right {
    animation: fade-in-right 1s ease-out;
  }
  .animate-bounce-subtle {
    animation: bounce-subtle 3s ease-in-out infinite;
  }
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s linear infinite;
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
`;

/* ============================== DATA ============================== */

const services = [
  {
    icon: MarketingIcon,
    title: "Digital Marketing & Performance",
    desc: "Our digital marketing specialists drive your online presence with strategic campaigns, social media management, SEO optimization, and data-driven marketing solutions that deliver measurable results.",
    features: ["Social Media Management", "SEO & Content Strategy", "Paid Advertising", "Analytics & Reporting"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    gradient: "from-blue-500/20 via-emerald-500/20 to-purple-500/20",
    stat: "340%",
    statLabel: "Average ROI",
    iconBg: "from-blue-500 to-cyan-500",
  },
  {
    icon: DesignIcon,
    title: "Branding & Creative Design",
    desc: "Our creative graphic designers transform your brand vision into compelling visual identities, marketing materials, and digital assets that captivate your audience and strengthen brand recognition.",
    features: ["Brand Identity Design", "Marketing Materials", "Digital Graphics", "Visual Content Creation"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    gradient: "from-pink-500/20 via-rose-500/20 to-orange-500/20",
    stat: "500+",
    statLabel: "Brands Designed",
    iconBg: "from-pink-500 to-rose-500",
  },
  {
    icon: StrategyIcon,
    title: "Campaign Strategy & Management",
    desc: "Our experienced campaign managers orchestrate end-to-end marketing campaigns, from strategic planning and creative development to execution, optimization, and performance analysis.",
    features: ["Campaign Strategy", "Multi-Channel Execution", "Performance Optimization", "ROI Tracking"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    stat: "860+",
    statLabel: "Campaigns Launched",
    iconBg: "from-emerald-500 to-teal-500",
  },
];

const processSteps = [
  { number: "01", title: "Discovery & Strategy", desc: "We dive deep into your business, market, and goals to create a comprehensive strategy.", icon: Lightbulb },
  { number: "02", title: "Creative Development", desc: "Our team brings your vision to life with innovative concepts and compelling designs.", icon: Rocket },
  { number: "03", title: "Execution & Launch", desc: "We execute flawlessly across all channels, ensuring maximum impact and reach.", icon: Zap },
  { number: "04", title: "Optimization & Growth", desc: "Continuous monitoring and optimization to ensure sustained growth and success.", icon: BarChart3 },
];

const successStories = [
  {
    id: 1,
    title: "Carnival Community Engagement",
    company: "Sally Production Ltd.",
    category: "Events & Entertainment",
    image: Story1Img,
    description: "Delivered a comprehensive multi-channel campaign that achieved 340% ROI and reached over 250K people, driving 12,450 conversions for a major cultural event.",
    metrics: "340% ROI • 250K+ Reach",
  },
  {
    id: 2,
    title: "Digital Transformation Campaign",
    company: "TechCorp Global",
    category: "Corporate Technology",
    image: Story2Img,
    description: "Rebranded and launched a new digital platform with strategic marketing and design, resulting in 420% ROI and 85% increase in brand awareness.",
    metrics: "420% ROI • 500K+ Reach",
  },
  {
    id: 3,
    title: "Educational Platform Launch",
    company: "EduLearn International",
    category: "Education & E-Learning",
    image: Story3Img,
    description: "Orchestrated a successful launch campaign that achieved 380% ROI and increased student enrollment by 45% through targeted marketing and optimized conversion funnels.",
    metrics: "380% ROI • 45% Enrollment Increase",
  },
];

const industries = [
  { name: "Entertainment", icon: Film, desc: "Events & Media" },
  { name: "Technology", icon: Laptop, desc: "Tech & Software" },
  { name: "Education", icon: GraduationCap, desc: "E-Learning" },
  { name: "Sustainability", icon: Leaf, desc: "Green Solutions" },
  { name: "Financial Services", icon: DollarSign, desc: "Finance & Banking" },
  { name: "Healthcare", icon: Heart, desc: "Health & Wellness" },
];

const testimonials = [
  {
    id: 1,
    name: "Sally Lo, MBE",
    role: "CEO",
    company: "Sally Production Ltd.",
    image: ProfilePic1,
    quote: "Their strategic approach delivered measurable results. We achieved 340% ROI in 6 months, transforming our community engagement and driving significant growth for our events.",
  },
  {
    id: 2,
    name: "James Mitchell",
    role: "CMO",
    company: "TechCorp Global",
    image: ProfilePic2,
    quote: "Data-driven excellence that delivered 420% ROI and 85% brand awareness increase in Q1. The team's expertise in digital marketing and campaign management exceeded our expectations.",
  },
  {
    id: 3,
    name: "Dr. Sarah Chen",
    role: "Director",
    company: "EduLearn International",
    image: ProfilePic3,
    quote: "Outstanding results! We saw a 380% ROI and our student enrollment increased by 45% after their campaign launch. Their creative design and strategic marketing made all the difference.",
  },
  {
    id: 4,
    name: "Michael Roberts",
    role: "Founder",
    company: "GreenLife Solutions",
    image: ProfilePic4,
    quote: "The team's branding and creative design transformed our market presence. Combined with their digital marketing expertise, we achieved record-breaking engagement and conversions.",
  },
];

const whyChooseUs = [
  { icon: Target, title: "Proven Results", desc: "98% success rate with measurable ROI for all our clients" },
  { icon: Award, title: "Trusted Partner", desc: "100% repeat client rate speaks to our commitment and reliability" },
  { icon: TrendingUp, title: "Global Expertise", desc: "Experience across multiple industries and international markets" },
  { icon: CheckCircle2, title: "Client-Centric", desc: "Your success is our priority. We're with you every step of the way" },
];

/* ============================ HELPERS ============================= */

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

function trackCta({ cta_id, cta_variant, location }) {
  if (window.gtag) {
    window.gtag("event", "cta_click", { cta_id, cta_variant, location });
  }
}

function IconPill({ icon: Icon, label }) {
  const IconComponent = Icon;
  return (
    <div className="flex items-center gap-2">
      <IconComponent className="text-emerald-600 shrink-0" size={18} />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

function ContactTile({ icon: Icon, label, children }) {
  const IconComponent = Icon;
  return (
    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        {/* fix: icon always centered + consistent size */}
        <IconComponent className="text-white shrink-0" size={22} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-emerald-50">{label}</div>
        <div className="text-white font-semibold truncate">{children}</div>
      </div>
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime = null;
            const animate = (currentTime) => {
              if (!startTime) startTime = currentTime;
              const progress = Math.min((currentTime - startTime) / duration, 1);

              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(easeOutQuart * end));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={counterRef} className="inline-block">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Statistics Section Component
function StatsSection() {
  const stats = [
    {
      icon: Award,
      value: 10,
      suffix: "+",
      label: "Awards Won",
      description: "Industry recognition for excellence",
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      icon: Briefcase,
      value: 860,
      suffix: "+",
      label: "Projects Completed",
      description: "Successful campaigns delivered",
      gradient: "from-emerald-400 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      icon: Users,
      value: 55,
      suffix: "+",
      label: "Happy Clients",
      description: "Trusted by businesses worldwide",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 lg:p-10 border-2 border-slate-200
                       hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100/50
                       transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 
                             group-hover:opacity-100 rounded-3xl transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient}
                               flex items-center justify-center shadow-lg
                               group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                               animate-float`}
                    style={{ animationDelay: `${index * 0.2}s` }}>
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:bg-white/40 transition-colors" />
                    <stat.icon className="text-white relative z-10" size={32} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Animated Number */}
                <div className="mb-3">
                  <div className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 
                               bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-800
                               transition-all duration-500">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2500}
                    />
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 
                             group-hover:text-emerald-700 transition-colors">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm font-medium">
                  {stat.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-6 w-16 h-1 bg-gradient-to-r from-emerald-400 to-transparent 
                             rounded-full group-hover:w-24 transition-all duration-500" />
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.gradient} 
                             opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 
                             -z-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== PAGE ============================== */

export default function Home() {
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = authAPI.getCurrentUser();
      console.log('Home page - Current user:', user);
      console.log('Home page - User roles:', user?.roles);
      setIsAdmin(user?.roles?.includes('Admin') || false);
      setIsClient(user?.roles?.includes('Client') || false);
      // Team members have 'Team' role
      const isTeam = user?.roles?.includes('Team') || false;
      setIsTeamMember(isTeam);
      console.log('Home page - Is team member:', isTeam);
    };

    checkAuth();
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* ================= HERO ================= */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden min-h-[92vh] flex items-center">
          <PatternBg />

          <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* LEFT */}
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                  <TrendingUp size={16} className="shrink-0" />
                  <span>Innovation Driven</span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                  We Turn Marketing Into
                  <br />
                  <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-100 bg-clip-text text-transparent">
                    Measurable Growth
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light">
                  Transform your vision into reality with our strategic approach. We combine innovation, expertise, and creativity to
                  deliver exceptional results that drive growth and success.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {isTeamMember && !isAdmin && !isClient && (
                    <Link
                      to="/team-dashboard"
                      className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                               shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                               border-2 border-transparent hover:border-emerald-100"
                    >
                      <LayoutDashboard size={20} className="shrink-0" />
                      <span className="leading-none">Go to Dashboard</span>
                      <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/dashboard"
                      className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                               shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                               border-2 border-transparent hover:border-emerald-100"
                    >
                      <LayoutDashboard size={20} className="shrink-0" />
                      <span className="leading-none">Go to Dashboard</span>
                      <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                  {isClient && !isAdmin && (
                    <Link
                      to="/client-dashboard"
                      className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                               shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                               border-2 border-transparent hover:border-emerald-100"
                    >
                      <LayoutDashboard size={20} className="shrink-0" />
                      <span className="leading-none">Go to Dashboard</span>
                      <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                  {!isTeamMember && !isAdmin && !isClient && (
                    <Link
                      to="/contact"
                      data-cta-id="hero-primary"
                      data-cta-variant="strategy-call"
                      data-cta-location="hero-section"
                      onClick={() => trackCta({ cta_id: "hero-primary", cta_variant: "strategy-call", location: "hero-section" })}
                      className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                               shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                               border-2 border-transparent hover:border-emerald-100"
                    >
                      <Calendar size={20} className="shrink-0" />
                      <span className="leading-none">Book a Strategy Call</span>
                      <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}

                  <Link
                    to="/projects"
                    data-cta-id="hero-secondary"
                    data-cta-variant="explore"
                    data-cta-location="hero-section"
                    onClick={() => {
                      trackCta({ cta_id: "hero-secondary", cta_variant: "explore", location: "hero-section" });
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

              {/* RIGHT IMAGE */}
              <div className="relative lg:block hidden animate-fade-in-right">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-white/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-200/50 transition-shadow duration-500">
                    <img
                      src={HeroImage}
                      alt="Hero"
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

        {/* ================= INDUSTRIES WE SERVE ================= */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <SectionHeader
              badgeIcon={Award}
              badgeText="Our Expertise"
              title="Industries We Serve"
              desc="We deliver exceptional results across diverse sectors, helping businesses achieve their marketing and growth objectives"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {industries.map((industry, index) => {
                const IconComponent = industry.icon;
                return (
                  <div
                    key={index}
                    className="group flex flex-col items-center justify-center p-7 bg-gradient-to-br from-slate-50 to-white rounded-2xl
                             hover:from-emerald-50 hover:to-white hover:shadow-xl transition-all duration-500 border border-slate-200 hover:border-emerald-300
                             hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4 
                                 group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:scale-105
                                 transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <IconComponent className="text-emerald-700" size={26} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                        {industry.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{industry.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
              <IconPill icon={CheckCircle2} label="ISO 9001 Certified" />
              <IconPill icon={Award} label="10+ Industry Awards" />
              <IconPill icon={Star} label="4.9/5 Client Rating" />
              <IconPill icon={Target} label="Measurable ROI" />
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />

          <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
            <SectionHeader
              badgeIcon={Briefcase}
              badgeText="Our Expertise"
              title="What Do We Do?"
              desc="We provide comprehensive digital marketing, design, and analytics services to help your business grow"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-3xl overflow-hidden
                           transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 min-h-[600px] flex flex-col">
                    {/* Icon with Animation */}
                    <div className="mb-6">
                      <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${item.iconBg} 
                                   flex items-center justify-center shadow-2xl
                                   group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                                   animate-float`}
                        style={{ animationDelay: `${index * 0.2}s` }}>
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:bg-white/30 transition-colors" />
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-12 h-12 relative z-10 filter brightness-0 invert"
                        />
                      </div>
                    </div>

                    {/* Stat Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      <div className="text-2xl font-extrabold text-white">{item.stat}</div>
                      <div className="text-xs text-white/90 font-medium">{item.statLabel}</div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-4 leading-tight group-hover:text-emerald-100 transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 leading-relaxed mb-6 text-base font-light flex-1">
                      {item.desc}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {item.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-white/95 font-medium
                                   group-hover:text-white transition-colors
                                   animate-slide-up"
                          style={{ animationDelay: `${(index * 0.1) + (i * 0.05)}s` }}
                        >
                          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center 
                                       group-hover:bg-emerald-500/50 transition-all duration-300
                                       group-hover:scale-110">
                            <CheckCircle2 className="text-white shrink-0" size={14} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      to="/services#our-services"
                      onClick={() => {
                        setTimeout(() => {
                          const element = document.getElementById('our-services');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                      className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 
                               bg-white text-emerald-700 rounded-xl font-bold text-sm
                               hover:bg-emerald-50 transition-all duration-300
                               hover:scale-105 hover:shadow-xl hover:shadow-emerald-200/50
                               border-2 border-transparent hover:border-emerald-100"
                    >
                      <span>View Details</span>
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATISTICS ================= */}
        <StatsSection />

        {/* ================= PROCESS ================= */}
        <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
            <SectionHeader
              badgeIcon={Rocket}
              badgeText="Our Process"
              title="How We Work"
              desc="A proven methodology that ensures exceptional results at every stage"
            />

            {/* Process Steps with Connecting Lines */}
            <div className="relative">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden lg:block absolute top-32 left-0 right-0 h-1">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 rounded-full opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                {processSteps.map((step, index) => {
                  const gradients = [
                    "from-amber-400 via-orange-400 to-amber-500",
                    "from-emerald-400 via-teal-400 to-emerald-500",
                    "from-blue-400 via-cyan-400 to-blue-500",
                    "from-purple-400 via-pink-400 to-purple-500",
                  ];
                  const bgGradients = [
                    "from-amber-50 to-orange-50",
                    "from-emerald-50 to-teal-50",
                    "from-blue-50 to-cyan-50",
                    "from-purple-50 to-pink-50",
                  ];
                  const iconColors = [
                    "text-amber-600",
                    "text-emerald-600",
                    "text-blue-600",
                    "text-purple-600",
                  ];

                  return (
                    <div
                      key={index}
                      className="relative group"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {/* Connecting Arrow (Desktop Only) */}
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-32 -right-3 z-0">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <ArrowRight className="text-emerald-400 opacity-50 group-hover:opacity-100 group-hover:text-emerald-500 transition-all duration-300" size={24} />
                          </div>
                        </div>
                      )}

                      {/* Card */}
                      <div className="relative h-full">
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${gradients[index]} rounded-3xl blur-xl 
                                     opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                        {/* Main Card */}
                        <div className={`relative bg-white rounded-3xl p-8 lg:p-10 
                                     border-2 border-slate-200 hover:border-emerald-300 
                                     hover:shadow-2xl hover:shadow-emerald-100/50
                                     transition-all duration-500 h-full hover:-translate-y-2
                                     group-hover:scale-[1.02]`}>
                          {/* Content */}
                          <div className="relative z-10">
                            {/* Icon */}
                            <div className="mb-6">
                              <div className={`relative w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm
                                           flex items-center justify-center shadow-xl
                                           group-hover:scale-110 group-hover:rotate-12
                                           transition-all duration-500
                                           border-2 border-white/50 group-hover:border-white`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} 
                                             rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <step.icon className={`${iconColors[index]} relative z-10 group-hover:scale-110 
                                                    transition-transform duration-300`} size={36} strokeWidth={2} />
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className={`text-2xl font-extrabold mb-4 leading-tight
                                         ${index === 0 ? 'text-amber-900' : index === 1 ? 'text-emerald-900' : index === 2 ? 'text-blue-900' : 'text-purple-900'}
                                         group-hover:scale-105 transition-transform duration-300`}>
                              {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-700 leading-relaxed text-base font-light mb-6">
                              {step.desc}
                            </p>

                            {/* Decorative Element */}
                            <div className={`w-12 h-1 bg-gradient-to-r ${gradients[index]} 
                                         rounded-full group-hover:w-20 transition-all duration-500`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 
                         text-white rounded-xl font-bold text-base
                         hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 
                         shadow-xl hover:shadow-2xl hover:shadow-emerald-200/50
                         hover:scale-105 hover:-translate-y-1
                         border-2 border-transparent hover:border-emerald-500"
              >
                <Calendar size={20} className="shrink-0" />
                <span>Start Your Project</span>
                <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= OUR SUCCESS STORIES ================= */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <SectionHeader
              badgeIcon={Sparkles}
              badgeText="Success Stories"
              title="Our Success Stories"
              desc="Real results from real clients. Discover how our team of digital marketing specialists, graphic designers, and campaign managers have transformed businesses across industries."
            />

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {successStories.map((story) => (
                <div
                  key={story.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200
                           hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col
                           shadow-md hover:shadow-emerald-100/50"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10 group-hover:from-black/70 transition-all duration-500" />
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-5 left-5 z-20">
                      <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-sm">
                        {story.category}
                      </span>
                    </div>
                    {/* Overlay gradient for better text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Briefcase className="text-emerald-600 shrink-0" size={16} />
                      </div>
                      <span className="text-sm text-slate-700 font-semibold">{story.company}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-1">
                      {story.description}
                    </p>
                    <div className="pt-5 border-t border-slate-100 group-hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <TrendingUp className="text-emerald-600 shrink-0" size={16} />
                        </div>
                        <span className="text-sm font-bold text-emerald-700">{story.metrics}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Stories Button */}
            <div className="text-center mt-16">
              <Link
                to="/projects"
                onClick={() => {
                  // Scroll to top when navigating to projects page
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-xl font-bold text-base
                         hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-200/50
                         hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-emerald-500"
              >
                <span>View All Stories</span>
                <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full text-emerald-700 text-sm font-semibold mb-6 border border-emerald-100 shadow-sm">
                <Users size={16} className="shrink-0" />
                <span>Client Success</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Trusted by Industry Leaders</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">Real results from clients who've achieved measurable growth</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group bg-white rounded-2xl p-6 border-2 border-slate-200
                           hover:border-emerald-300 hover:shadow-xl transition-all duration-500 flex flex-col
                           hover:-translate-y-2"
                >
                  {/* Client Photo & Info */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-200 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="relative w-16 h-16 rounded-full object-cover border-3 border-emerald-100 shadow-md group-hover:border-emerald-200 transition-all duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 truncate mb-0.5">{testimonial.name}</div>
                      <div className="text-xs text-slate-600 font-semibold truncate">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  {/* Quote Paragraph */}
                  <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5 font-light italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Rating Stars */}
                  <div className="flex gap-1 pt-5 border-t border-slate-100 group-hover:border-emerald-100 transition-colors">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform duration-300" size={16} style={{ transitionDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
