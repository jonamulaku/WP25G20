import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Linkedin, Mail, Rocket, CheckCircle2, X, FileText, Upload, MapPin, Clock, DollarSign, Briefcase } from "lucide-react";

import teamImage from "@/assets/images/text-image-team.png";

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

// Using real Unsplash photos for team members - Three for each position
const teamMembers = [
  // Graphic Designers (3)
  { id: 1, name: "Sarah Chen", role: "Graphic Designer", department: "Design", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face", bio: "Creative professional with a passion for visual storytelling. Sarah transforms brand visions into compelling designs that captivate audiences and strengthen brand recognition.", email: "sarah.chen@marketingagency.co", linkedin: "sarah-chen" },
  { id: 2, name: "Emily Rodriguez", role: "Graphic Designer", department: "Design", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", bio: "Award-winning creative professional specializing in visual identity and campaigns. Emily brings innovative design solutions that elevate brand presence.", email: "emily.rodriguez@marketingagency.co", linkedin: "emily-rodriguez" },
  { id: 3, name: "James Wilson", role: "Graphic Designer", department: "Design", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", bio: "Creative designer passionate about creating compelling visual experiences. James combines artistic vision with strategic thinking to deliver exceptional design work.", email: "james.wilson@marketingagency.co", linkedin: "james-wilson" },
  
  // Digital Marketing Specialists (3)
  { id: 4, name: "Michael Thompson", role: "Digital Marketing Specialist", department: "Marketing", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", bio: "Expert in digital marketing strategies with a proven track record of driving measurable results. Michael specializes in SEO, social media management, and data-driven campaign optimization.", email: "michael.thompson@marketingagency.co", linkedin: "michael-thompson" },
  { id: 5, name: "Lisa Anderson", role: "Digital Marketing Specialist", department: "Marketing", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face", bio: "Results-driven marketer with expertise in campaign management and analytics. Lisa helps businesses achieve their online marketing goals through strategic planning and execution.", email: "lisa.anderson@marketingagency.co", linkedin: "lisa-anderson" },
  { id: 6, name: "David Kim", role: "Digital Marketing Specialist", department: "Marketing", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", bio: "Digital marketing expert specializing in social media and content strategy. David creates engaging campaigns that drive brand awareness and customer acquisition.", email: "david.kim@marketingagency.co", linkedin: "david-kim" },
  
  // Campaign Managers (3)
  { id: 7, name: "Robert Martinez", role: "Campaign Manager", department: "Campaign", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face", bio: "Strategic campaign manager with expertise in orchestrating end-to-end marketing campaigns. Robert ensures seamless execution and optimal performance across all channels.", email: "robert.martinez@marketingagency.co", linkedin: "robert-martinez" },
  { id: 8, name: "Amanda White", role: "Campaign Manager", department: "Campaign", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", bio: "Experienced campaign manager specializing in multi-channel marketing execution. Amanda delivers campaigns that exceed client expectations and drive measurable ROI.", email: "amanda.white@marketingagency.co", linkedin: "amanda-white" },
  { id: 9, name: "Christopher Lee", role: "Campaign Manager", department: "Campaign", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face", bio: "Results-oriented campaign manager with a focus on performance optimization. Christopher manages complex campaigns from strategy to execution and analysis.", email: "christopher.lee@marketingagency.co", linkedin: "christopher-lee" },
];

// Open positions data
const openPositions = [
  {
    id: 1,
    title: "Senior Graphic Designer",
    department: "Design",
    location: "Remote / London, UK",
    type: "Full-time",
    salary: "£45,000 - £60,000",
    description: "We're looking for an experienced graphic designer to join our creative team. You'll work on diverse projects including brand identity, marketing materials, and digital graphics.",
    requirements: [
      "5+ years of experience in graphic design",
      "Proficiency in Adobe Creative Suite",
      "Strong portfolio showcasing brand identity work",
      "Excellent communication and collaboration skills",
      "Experience with digital and print design"
    ],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote / New York, USA",
    type: "Full-time",
    salary: "$55,000 - $75,000",
    description: "Join our digital marketing team to drive online presence and campaign performance. You'll manage social media, SEO, paid advertising, and analytics for our clients.",
    requirements: [
      "4+ years of experience in digital marketing",
      "Expertise in SEO, SEM, and social media marketing",
      "Strong analytical skills and data-driven mindset",
      "Experience with Google Analytics and advertising platforms",
      "Excellent written and verbal communication skills"
    ],
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Campaign Manager",
    department: "Campaign Management",
    location: "Hybrid / London, UK",
    type: "Full-time",
    salary: "£50,000 - £70,000",
    description: "We're seeking a strategic campaign manager to orchestrate end-to-end marketing campaigns. You'll work closely with clients and internal teams to deliver exceptional results.",
    requirements: [
      "5+ years of experience in campaign management",
      "Proven track record of successful multi-channel campaigns",
      "Strong project management and organizational skills",
      "Experience with campaign analytics and ROI tracking",
      "Excellent client relationship management skills"
    ],
    posted: "3 days ago"
  }
];

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

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center
                 hover:bg-emerald-100 hover:text-emerald-700 transition-colors shrink-0"
    >
      {children}
    </a>
  );
}

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvFormData, setCvFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
    file: null
  });

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teamMembers.filter((m) => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [searchQuery]);

  const handleCVSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("CV Form submitted:", cvFormData);
    alert("Thank you! Your CV has been submitted. We'll be in touch soon.");
    setShowCVModal(false);
    setCvFormData({ name: "", email: "", phone: "", position: "", message: "", file: null });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFormData({ ...cvFormData, file });
    }
  };

  return (
    <>
      <style>{styles}</style>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* ================= HERO ================= */}
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
                <span className="text-white font-medium">Our Team</span>
              </nav>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300">
                <Users size={16} className="shrink-0" />
                <span>Meet Our Team</span>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight">
                The People Behind
                <br />
                <span className="bg-gradient-to-r from-emerald-100 via-white to-emerald-100 bg-clip-text text-transparent">
                  Your Growth
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light">
                Our dynamic team keeps your brand on the pulse. Strategy, creativity, and execution—working together to deliver measurable results.
              </p>

              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, role, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-0 shadow-xl
                             text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-300
                             focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative lg:block hidden animate-fade-in-right">
              <div className="relative group">
                <div className="absolute -inset-6 bg-white/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-200/50 transition-shadow duration-500">
                  <img
                    src={teamImage}
                    alt="Team"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEAM GRID ================= */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animation: "pulse 4s ease-in-out infinite" }} />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animation: "pulse 4s ease-in-out infinite", animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 rounded-full text-emerald-700 text-sm font-semibold mb-6 border border-emerald-100 shadow-sm">
              <Users size={16} className="shrink-0" />
              <span>Our Team</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
              Meet Our Expert Team
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Talented professionals dedicated to delivering exceptional results for your business
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-slate-200
                           hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 
                           transition-all duration-500 hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 group-hover:from-black/80 transition-all duration-700"></div>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-sm">
                      {member.department}
                    </span>
                  </div>
                </div>

                  <div className="p-6">
                    <h3 className="text-lg lg:text-xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors leading-tight">
                    {member.name}
                  </h3>
                    <p className="text-sm text-emerald-600 font-bold mb-3">{member.role}</p>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed font-light line-clamp-3">{member.bio}</p>

                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100 group-hover:border-emerald-100 transition-colors">
                    <a
                      href={`mailto:${member.email}`}
                        className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all duration-300 shadow-sm"
                      aria-label="Email"
                    >
                        <Mail size={18} className="shrink-0" />
                    </a>

                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all duration-300 shadow-sm"
                      aria-label="LinkedIn"
                    >
                        <Linkedin size={18} className="shrink-0" />
                    </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="text-slate-400" size={40} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No team members found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search query</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <PatternBg />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                  <Rocket size={16} className="shrink-0" />
                  <span>Join Our Team</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Want to Be Part of Our Team?</h2>
                <p className="text-emerald-50 text-lg">
                  We're always looking for talented individuals who share our passion for excellence and innovation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setShowPositionsModal(true)}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                             shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                             border-2 border-transparent hover:border-emerald-100"
                >
                  <Briefcase size={20} className="shrink-0" />
                  <span className="leading-none">View Open Positions</span>
                  <Rocket size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCVModal(true)}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-base
                             border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                             shadow-lg hover:shadow-xl"
                >
                  <Upload size={20} className="shrink-0" />
                  <span className="leading-none">Send Your CV</span>
                  <Rocket size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-emerald-50/90 text-sm">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" /> Remote-friendly
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" /> Growth-focused culture
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" /> Creative + strategic teams
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODAL: VIEW OPEN POSITIONS ================= */}
      {showPositionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-slate-200">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 border-b border-emerald-400">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white mb-2">Open Positions</h2>
                  <p className="text-emerald-50 text-sm">Join our team and help us deliver exceptional results</p>
                </div>
                <button
                  onClick={() => setShowPositionsModal(false)}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
              <div className="space-y-6">
                {openPositions.map((position) => (
                  <div
                    key={position.id}
                    className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200
                             hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            {position.department}
                          </span>
                          <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {position.type}
                          </span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="text-emerald-600" size={16} />
                            <span>{position.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-emerald-600" size={16} />
                            <span>{position.salary}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-emerald-600" size={16} />
                            <span>{position.posted}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-6 leading-relaxed font-light">{position.description}</p>

                    <div className="mb-6">
                      <h4 className="text-lg font-extrabold text-slate-900 mb-4">Requirements:</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={18} />
                            <span className="text-slate-700 text-sm font-light">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:careers@marketingagency.co?subject=Application for ${position.title}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold
                                 hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Mail size={18} />
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SEND YOUR CV ================= */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-slate-200">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 border-b border-emerald-400">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white mb-2">Send Your CV</h2>
                  <p className="text-emerald-50 text-sm">We'd love to hear from you</p>
                </div>
                <button
                  onClick={() => setShowCVModal(false)}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCVSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={cvFormData.name}
                      onChange={(e) => setCvFormData({ ...cvFormData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={cvFormData.email}
                      onChange={(e) => setCvFormData({ ...cvFormData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={cvFormData.phone}
                      onChange={(e) => setCvFormData({ ...cvFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Position Interested In *</label>
                    <select
                      required
                      value={cvFormData.position}
                      onChange={(e) => setCvFormData({ ...cvFormData, position: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900"
                    >
                      <option value="">Select a position</option>
                      <option value="Graphic Designer">Graphic Designer</option>
                      <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                      <option value="Campaign Manager">Campaign Manager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Upload CV/Resume *</label>
                  <div className="relative">
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Upload className="text-emerald-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">
                          {cvFormData.file ? cvFormData.file.name : "Click to upload or drag and drop"}
                        </div>
                        <div className="text-xs text-slate-500">PDF, DOC, DOCX (Max 10MB)</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Message (Optional)</label>
                  <textarea
                    value={cvFormData.message}
                    onChange={(e) => setCvFormData({ ...cvFormData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-slate-900 resize-none"
                    placeholder="Tell us why you'd be a great fit for our team..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold
                             hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <FileText size={20} />
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCVModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold
                             hover:bg-slate-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
