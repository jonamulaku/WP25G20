import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Award, Search, Linkedin, Mail, Sparkles, Briefcase, Target, Heart, Globe, Filter, Lightbulb, Rocket, CheckCircle2 } from "lucide-react";

import teamImage from "@/assets/images/text-image-team.png";
import employeeImg from "@/assets/images/Mask Group.png";
import Ellipse1 from "@/assets/images/Ellipse 1.png";
import Ellipse13 from "@/assets/images/Ellipse 13.png";
import Image14 from "@/assets/images/image 14.png";
import Image15 from "@/assets/images/image 15.png";
import Image16 from "@/assets/images/image 16.png";
import Image17 from "@/assets/images/image 17.png";
import Image18 from "@/assets/images/image 18.png";
import Image19 from "@/assets/images/image 19.png";
import Image20 from "@/assets/images/image 20.png";
import Image21 from "@/assets/images/image 21.png";
import Image5 from "@/assets/images/image 5.png";
import Image6 from "@/assets/images/image 6.png";

const departments = ["All", "Leadership", "Marketing", "Design", "Strategy", "Research"];

const teamMembers = [
  { id: 1, name: "Sarah Johnson", role: "Chief Executive Officer", department: "Leadership", image: employeeImg, bio: "Visionary leader with 15+ years of experience in marketing and business strategy.", email: "sarah.johnson@marketingagency.co", linkedin: "sarah-johnson", featured: true },
  { id: 2, name: "Michael Chen", role: "Chief Marketing Officer", department: "Leadership", image: Ellipse1, bio: "Expert in digital marketing and brand development with proven track record.", email: "michael.chen@marketingagency.co", linkedin: "michael-chen", featured: true },
  { id: 3, name: "Emily Rodriguez", role: "Creative Director", department: "Design", image: Ellipse13, bio: "Award-winning creative professional specializing in visual identity and campaigns.", email: "emily.rodriguez@marketingagency.co", linkedin: "emily-rodriguez", featured: false },
  { id: 4, name: "David Thompson", role: "Head of Strategy", department: "Strategy", image: Image14, bio: "Strategic thinker with expertise in market analysis and growth planning.", email: "david.thompson@marketingagency.co", linkedin: "david-thompson", featured: false },
  { id: 5, name: "Lisa Anderson", role: "Senior Marketing Manager", department: "Marketing", image: Image15, bio: "Results-driven marketer with expertise in campaign management and analytics.", email: "lisa.anderson@marketingagency.co", linkedin: "lisa-anderson", featured: false },
  { id: 6, name: "James Wilson", role: "Lead Designer", department: "Design", image: Image16, bio: "Creative designer passionate about creating compelling visual experiences.", email: "james.wilson@marketingagency.co", linkedin: "james-wilson", featured: false },
  { id: 7, name: "Rachel Kim", role: "Research Director", department: "Research", image: Image17, bio: "Data-driven researcher with expertise in market insights and consumer behavior.", email: "rachel.kim@marketingagency.co", linkedin: "rachel-kim", featured: false },
  { id: 8, name: "Robert Martinez", role: "Marketing Specialist", department: "Marketing", image: Image18, bio: "Digital marketing expert specializing in social media and content strategy.", email: "robert.martinez@marketingagency.co", linkedin: "robert-martinez", featured: false },
  { id: 9, name: "Amanda White", role: "Senior Strategist", department: "Strategy", image: Image19, bio: "Strategic consultant with focus on brand positioning and market entry.", email: "amanda.white@marketingagency.co", linkedin: "amanda-white", featured: false },
  { id: 10, name: "Christopher Lee", role: "Design Manager", department: "Design", image: Image20, bio: "Creative leader managing design teams and overseeing visual brand consistency.", email: "christopher.lee@marketingagency.co", linkedin: "christopher-lee", featured: false },
  { id: 11, name: "Jessica Brown", role: "Marketing Analyst", department: "Marketing", image: Image21, bio: "Analytics expert providing insights to drive data-informed marketing decisions.", email: "jessica.brown@marketingagency.co", linkedin: "jessica-brown", featured: false },
  { id: 12, name: "Daniel Garcia", role: "Research Analyst", department: "Research", image: employeeImg, bio: "Research professional conducting market studies and competitive analysis.", email: "daniel.garcia@marketingagency.co", linkedin: "daniel-garcia", featured: false },
];

const teamStats = [
  { label: "Team Members", value: "55+", icon: Users },
  { label: "Departments", value: "6", icon: Briefcase },
  { label: "Years Experience", value: "15+", icon: Award },
  { label: "Countries", value: "12+", icon: Globe },
];

const companyValues = [
  { icon: Lightbulb, title: "Innovation", desc: "We embrace new ideas and cutting-edge solutions to stay ahead of the curve." },
  { icon: Heart, title: "Collaboration", desc: "We believe in the power of teamwork and building strong relationships." },
  { icon: Target, title: "Excellence", desc: "We strive for perfection in everything we do, delivering exceptional results." },
  { icon: Rocket, title: "Growth", desc: "We're committed to continuous learning and professional development." },
];

const awards = [
  { year: "2016", image: Image6, title: "The Golden Globe Tigers Awards", achievements: ["Best Use of Social Media in Marketing"] },
  { year: "2015", image: Image5, title: "The Marketing Excellence Awards", achievements: ["Excellence in Event Marketing - Gold", "Excellence in Partnership - Gold"] },
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
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return teamMembers.filter((m) => {
      const matchesDepartment = activeDepartment === "All" || m.department === activeDepartment;
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q);

      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, searchQuery]);

  const leadershipTeam = filteredMembers.filter((m) => m.department === "Leadership");
  const regularTeam = filteredMembers.filter((m) => m.department !== "Leadership");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden">
        <PatternBg />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-28 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-emerald-50 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-emerald-200">/</span>
            <span className="text-white font-medium">Our Team</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Users size={16} className="shrink-0" />
                <span>Meet Our Team</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The People Behind
                <br />
                <span className="bg-gradient-to-r from-emerald-100 to-white bg-clip-text text-transparent">
                  Your Growth
                </span>
              </h1>

              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
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

            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50"></div>
                <img src={teamImage} alt="Team" className="relative rounded-3xl shadow-2xl w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {teamStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <stat.icon className="text-emerald-700" size={24} />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FILTERS (sticky) ================= */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
              <Filter size={16} className="shrink-0" />
              Department:
            </span>

            {departments.map((department) => (
              <button
                key={department}
                onClick={() => setActiveDepartment(department)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeDepartment === department
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP ================= */}
      {leadershipTeam.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="text-emerald-700" size={24} />
                <h2 className="text-3xl font-bold text-slate-900">Leadership Team</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {leadershipTeam.map((member) => (
                <div key={member.id} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50"></div>
                        <img
                          src={member.image}
                          alt={member.name}
                          className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                            Leadership
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
                          {member.name}
                        </h3>
                        <p className="text-emerald-700 font-semibold mb-3">{member.role}</p>
                        <p className="text-slate-600 text-sm mb-5 leading-relaxed">{member.bio}</p>

                        <div className="flex items-center gap-3">
                          <IconButton href={`mailto:${member.email}`} label="Email">
                            {/* fix: icons don't squish */}
                            <Mail size={18} className="shrink-0" />
                          </IconButton>

                          <IconButton href={`https://linkedin.com/in/${member.linkedin}`} label="LinkedIn">
                            <Linkedin size={18} className="shrink-0" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TEAM GRID ================= */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="flex items-center justify-between mb-10 gap-6">
            <h2 className="text-3xl font-bold text-slate-900">Our Team</h2>
            <span className="text-slate-600 text-sm whitespace-nowrap">{regularTeam.length} team members</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {regularTeam.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                           hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent z-10 group-hover:from-black/70 transition-all"></div>
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-800 rounded-full text-xs font-semibold">
                      {member.department}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-emerald-700 font-semibold mb-3">{member.role}</p>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{member.bio}</p>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <a
                      href={`mailto:${member.email}`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      aria-label="Email"
                    >
                      <Mail size={16} className="shrink-0" />
                    </a>

                    <a
                      href={`https://linkedin.com/in/${member.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={16} className="shrink-0" />
                    </a>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No team members found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or selecting a different department</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveDepartment("All");
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <Heart size={16} className="shrink-0" />
              <span>Our Culture</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">What We Stand For</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our values guide everything we do and shape how we work together as a team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200
                           hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="text-emerald-700" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AWARDS ================= */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <Award size={16} className="shrink-0" />
              <span>Recognition</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Awards & Recognition</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Celebrating our achievements and industry recognition</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {awards.map((award, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <img src={award.image} alt={award.title} className="w-32 h-32 rounded-xl object-cover shadow-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-full text-sm font-semibold">
                        {award.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                      {award.title}
                    </h3>
                    <ul className="space-y-2">
                      {award.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="text-emerald-700 mt-0.5 shrink-0" size={16} />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <PatternBg />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
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
                <a
                  href="mailto:careers@marketingagency.co"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-xl font-semibold
                             hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  View Open Positions
                </a>

                <button
                  type="button"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold
                             hover:bg-white/20 transition-all duration-300"
                >
                  Send Your CV
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
    </div>
  );
}
