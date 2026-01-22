import CarnivalImg from "@/assets/images/carnival.png";
import MusicEventImg from "@/assets/images/music event.png";
import CampaignImg from "@/assets/images/campaign.png";

import Image1 from "@/assets/images/image 1.png";
import Image5 from "@/assets/images/image 5.png";
import Image6 from "@/assets/images/image 6.png";
import Image7 from "@/assets/images/image 7.png";
import Image11 from "@/assets/images/image 11.png";
import Image12 from "@/assets/images/image 12.png";

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const projects = [
  {
    id: 1,
    slug: "carnival-community-engagement",
    title: "Carnival Community Engagement",
    category: "Events",
    type: "Campaigns",
    image: CarnivalImg,
    heroImage: Image1,
    client: "Community Foundation",
    year: "2023",
    location: "London, UK",
    duration: "6 months",
    description:
      "A comprehensive community engagement campaign that brought together diverse audiences through innovative event marketing strategies.",
    results: {
      reach: "250K+",
      engagement: "45K+",
      conversion: "12%",
      roi: "340%",
      events: "15+",
      participants: "12K+",
    },
    featured: true,
    tags: ["Event Marketing", "Community", "Engagement"],
    challenge:
      "The client needed to increase community participation in local events by 40% while building stronger connections between diverse demographic groups.",
    solution:
      "We developed a multi-channel campaign combining digital marketing, strategic partnerships, and immersive event experiences.",
    services: ["Digital marketing", "Strategy", "Content", "PR", "Design & branding"],
    process: [
      {
        phase: "Discovery",
        title: "Research & Strategy",
        desc: "Market research and community surveys to understand audience needs and interests.",
        duration: "2 weeks",
      },
      {
        phase: "Development",
        title: "Creative Development",
        desc: "Campaign identity, messaging framework and multi-channel content plan.",
        duration: "4 weeks",
      },
      {
        phase: "Execution",
        title: "Campaign Launch",
        desc: "Integrated rollout across digital, partners, and on-ground activities.",
        duration: "3 months",
      },
      {
        phase: "Optimization",
        title: "Analysis & Growth",
        desc: "Continuous improvement based on analytics and engagement signals.",
        duration: "Ongoing",
      },
    ],
    gallery: [],
    events: [],
    testimonial: {
      quote:
        "This campaign exceeded all our expectations. Strategic approach and creative execution transformed our community engagement.",
      author: "Sarah Mitchell",
      role: "Community Engagement Director",
      company: "Community Foundation",
      rating: 5,
    },
  },

  {
    id: 2,
    slug: "music-festival-brand-launch",
    title: "Music Festival Brand Launch",
    category: "Events",
    type: "Brand Strategy",
    image: MusicEventImg,
    heroImage: MusicEventImg,
    client: "Festival Co.",
    year: "2023",
    location: "Manchester, UK",
    duration: "3 months",
    description:
      "Complete brand identity and launch campaign for a major music festival, creating buzz and driving ticket sales.",
    results: {
      reach: "180K+",
      engagement: "32K+",
      conversion: "18%",
      roi: "210%",
      events: "8+",
      participants: "6K+",
    },
    featured: false,
    tags: ["Branding", "Events", "Social Media"],
    challenge: "Needed to stand out in a saturated events market and drive early ticket sales.",
    solution: "Brand narrative + social-first launch plan + partnerships with creators.",
    services: ["Brand strategy", "Design system", "Social media", "Campaigns"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "Excellent delivery and creativity. The launch momentum was exactly what we needed.",
      author: "Alex Reed",
      role: "Marketing Lead",
      company: "Festival Co.",
      rating: 5,
    },
  },

  {
    id: 3,
    slug: "digital-transformation-campaign",
    title: "Digital Transformation Campaign",
    category: "Corporate",
    type: "Digital Marketing",
    image: CampaignImg,
    heroImage: CampaignImg,
    client: "TechCorp Global",
    year: "2023",
    location: "Birmingham, UK",
    duration: "4 months",
    description:
      "Strategic digital marketing campaign that transformed brand perception and increased market share.",
    results: {
      reach: "500K+",
      engagement: "85K+",
      conversion: "15%",
      roi: "280%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Digital Marketing", "Strategy", "B2B"],
    challenge: "Low inbound demand and unclear positioning across channels.",
    solution: "Full-funnel messaging + performance marketing + landing optimization.",
    services: ["Performance", "Content", "Analytics", "CRO"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "Results exceeded expectations. Strong strategy, clean execution, measurable impact.",
      author: "Jordan Hayes",
      role: "CMO",
      company: "TechCorp",
      rating: 5,
    },
  },

  {
    id: 4,
    slug: "educational-platform-launch",
    title: "Educational Platform Launch",
    category: "Education",
    type: "Content Creation",
    image: Image1,
    heroImage: Image1,
    client: "EduTech Solutions",
    year: "2023",
    location: "Edinburgh, UK",
    duration: "3 months",
    description:
      "Multi-channel content strategy and launch campaign for an innovative educational technology platform.",
    results: {
      reach: "320K+",
      engagement: "58K+",
      conversion: "22%",
      roi: "380%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Education", "Content", "Platform"],
    challenge: "Build awareness fast and convert early adopters into active users.",
    solution: "Content-led launch + creator partnerships + performance retargeting loops.",
    services: ["Content strategy", "Paid social", "Landing pages", "Analytics"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "We saw immediate traction and sign-ups. Clear strategy and excellent delivery.",
      author: "Dr. Sarah Chen",
      role: "Director",
      company: "EduTech Solutions",
      rating: 5,
    },
  },

  {
    id: 5,
    slug: "luxury-brand-rebranding",
    title: "Luxury Brand Rebranding",
    category: "Branding",
    type: "Brand Strategy",
    image: Image5,
    heroImage: Image5,
    client: "Luxury Brands Ltd",
    year: "2023",
    location: "London, UK",
    duration: "2 months",
    description:
      "Complete brand overhaul and repositioning strategy for a luxury goods company targeting premium markets.",
    results: {
      reach: "150K+",
      engagement: "28K+",
      conversion: "25%",
      roi: "250%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Branding", "Luxury", "Strategy"],
    challenge: "Modernize the brand without losing legacy and premium perception.",
    solution: "Visual identity refresh + tone-of-voice system + premium launch assets.",
    services: ["Brand identity", "Guidelines", "Design system", "Campaign assets"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "The rebrand elevated our positioning. Everything feels premium and consistent now.",
      author: "Sophie Grant",
      role: "Brand Manager",
      company: "Luxury Brands Ltd",
      rating: 5,
    },
  },

  {
    id: 6,
    slug: "social-media-campaign-suite",
    title: "Social Media Campaign Suite",
    category: "Technology",
    type: "Social Media",
    image: Image6,
    heroImage: Image6,
    client: "Startup Inc",
    year: "2023",
    location: "Bristol, UK",
    duration: "2 months",
    description:
      "Comprehensive social media strategy and execution across multiple platforms, driving brand awareness and growth.",
    results: {
      reach: "420K+",
      engagement: "95K+",
      conversion: "20%",
      roi: "300%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Social Media", "Growth", "Awareness"],
    challenge: "Increase awareness and engagement with limited creative resources.",
    solution: "Modular content system + weekly iteration + UGC and micro-influencers.",
    services: ["Content calendar", "Creative templates", "Community", "Reporting"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "Engagement and followers jumped quickly. Very clean process and fast execution.",
      author: "Nina Patel",
      role: "Founder",
      company: "Startup Inc",
      rating: 5,
    },
  },

  {
    id: 7,
    slug: "corporate-sustainability-initiative",
    title: "Corporate Sustainability Initiative",
    category: "Corporate",
    type: "Campaigns",
    image: Image7,
    heroImage: Image7,
    client: "GreenCorp",
    year: "2023",
    location: "Leeds, UK",
    duration: "3 months",
    description:
      "Purpose-driven marketing campaign highlighting corporate sustainability efforts and environmental responsibility.",
    results: {
      reach: "280K+",
      engagement: "52K+",
      conversion: "14%",
      roi: "190%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Sustainability", "Corporate", "Purpose"],
    challenge: "Communicate impact without sounding generic or performative.",
    solution: "Story-led messaging + proof points + stakeholder-focused landing pages.",
    services: ["Messaging", "Content", "PR", "Design"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "The campaign felt authentic and measurable. Great stakeholder response.",
      author: "Martin Cole",
      role: "Comms Lead",
      company: "GreenCorp",
      rating: 5,
    },
  },

  {
    id: 8,
    slug: "ecommerce-platform-launch",
    title: "E-commerce Platform Launch",
    category: "Technology",
    type: "Digital Marketing",
    image: Image11,
    heroImage: Image11,
    client: "RetailTech",
    year: "2023",
    location: "Liverpool, UK",
    duration: "4 months",
    description:
      "Full-funnel digital marketing campaign for a new e-commerce platform, from awareness to conversion.",
    results: {
      reach: "600K+",
      engagement: "120K+",
      conversion: "16%",
      roi: "260%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["E-commerce", "Digital", "Conversion"],
    challenge: "Launch in a competitive market and keep CAC controlled.",
    solution: "Performance structure + CRO + retargeting + lifecycle email flows.",
    services: ["Paid search", "Paid social", "CRO", "Analytics"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "Strong results with clear reporting. Conversion improvements were the big win.",
      author: "Olivia Stone",
      role: "Growth Manager",
      company: "RetailTech",
      rating: 5,
    },
  },

  {
    id: 9,
    slug: "healthcare-awareness-campaign",
    title: "Healthcare Awareness Campaign",
    category: "Education",
    type: "Content Creation",
    image: Image12,
    heroImage: Image12,
    client: "Health Foundation",
    year: "2023",
    location: "Glasgow, UK",
    duration: "3 months",
    description:
      "Educational content campaign raising awareness about important health issues in underserved communities.",
    results: {
      reach: "380K+",
      engagement: "68K+",
      conversion: "19%",
      roi: "220%",
      events: "—",
      participants: "—",
    },
    featured: false,
    tags: ["Healthcare", "Education", "Awareness"],
    challenge: "Reach communities effectively with trusted, simple messaging.",
    solution: "Community-first content + partnerships + multi-language assets.",
    services: ["Content", "Partnerships", "Design", "Distribution"],
    process: [],
    gallery: [],
    events: [],
    testimonial: {
      quote: "The messaging landed perfectly. Engagement and shares were very strong.",
      author: "Emma Brooks",
      role: "Program Manager",
      company: "Health Foundation",
      rating: 5,
    },
  },
];

export const getProjectById = (id) => projects.find((p) => String(p.id) === String(id));

export const getProjectBySlug = (slug) => {
  if (!slug) return null;
  const direct = projects.find((p) => p.slug === slug);
  if (direct) return direct;

  const normalized = slugify(slug);
  return projects.find((p) => slugify(p.slug || p.title) === normalized) || null;
};

export const getRelatedProjects = (projectId, category) =>
  projects
    .filter((p) => p.id !== projectId && (category ? p.category === category : true))
    .slice(0, 2);
