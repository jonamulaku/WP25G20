import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Target,
  CheckCircle2,
  Clock,
  Briefcase,
  Lightbulb,
  Rocket,
  BarChart3,
  Image as ImageIcon,
  Sparkles,
  Users,
  Globe,
  Zap,
} from "lucide-react";

import { getProjectBySlug } from "@/data/projectsData";

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
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  .animate-fade-in-right {
    animation: fade-in-right 1s ease-out;
  }
  .animate-slide-up {
    animation: slide-up 0.6s ease-out;
  }
`;

// Section Header Component (matching Home.jsx style)
function SectionHeader({ badgeIcon: BadgeIcon, badgeText, title, desc, align = "center" }) {
  const isCenter = align === "center";
  return (
    <div className={`${isCenter ? "text-center" : ""} mb-16 animate-fade-in`}>
      <div
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 ${
          isCenter ? "mx-auto" : ""
        } bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300`}
      >
        {BadgeIcon ? <BadgeIcon size={16} className="shrink-0" /> : null}
        <span>{badgeText}</span>
      </div>
      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
        {title}
      </h2>
      {desc ? (
        <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">{desc}</p>
      ) : null}
    </div>
  );
}

// Pattern Background Component
function PatternBg() {
  return (
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}

// Navbar height constant (matches NavBar.jsx h-20 = 80px = 5rem)
const NAVBAR_HEIGHT = "5rem";

export default function InnerProjectPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const project = useMemo(() => getProjectBySlug(slug), [slug]);

  // Scroll to top when project changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-xl">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Project not found</h1>
            <p className="text-slate-600 mb-8 font-light">This project doesn't exist or the link is incorrect.</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <span>Back to Projects</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user count from results (participants or reach as fallback)
  const userCount = project.results?.participants || project.results?.reach || "10K+";

  // Objectives from services or tags
  const objectives =
    (project.services && project.services.length > 0
      ? project.services.slice(0, 6)
      : (project.tags || []).slice(0, 6)
    ) || [];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden min-h-[85vh] flex items-center">
          <PatternBg />

          <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-32 relative z-10">
            <nav
              className="flex items-center gap-2 text-sm text-emerald-50 mb-8 animate-fade-in"
              aria-label="Breadcrumb navigation"
            >
              <Link to="/" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                Home
              </Link>
              <span className="text-emerald-200" aria-hidden="true">
                /
              </span>
              <Link to="/projects" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                Projects
              </Link>
              <span className="text-emerald-200" aria-hidden="true">
                /
              </span>
              <span className="text-white font-medium" aria-current="page">
                {project.title}
              </span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-2xl animate-fade-in">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300 mb-6">
                  <Briefcase size={16} className="shrink-0" />
                  <span>{project.category}</span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white mb-6 tracking-tight">
                  {project.title}
                </h1>

                <p className="text-xl lg:text-2xl text-emerald-50/95 mb-8 leading-relaxed font-light">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-8 text-emerald-50">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} aria-hidden="true" />
                    <time dateTime={project.year}>{project.year}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} aria-hidden="true" />
                    <span>{project.location}</span>
                  </div>
                  {project.duration && (
                    <div className="flex items-center gap-2">
                      <Clock size={18} aria-hidden="true" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                </div>

              </div>

              <div className="relative lg:block hidden animate-fade-in-right">
                <div className="relative group">
                  <div className="absolute -inset-6 bg-white/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-emerald-200/50 transition-shadow duration-500">
                    <img
                      src={project.heroImage || project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* OVERVIEW - LUXURIOUS REDESIGN */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-6 lg:px-24 xl:px-32">
              {/* MAIN CONTENT GRID */}
              <div className="grid lg:grid-cols-3 gap-12">
                {/* LEFT COLUMN - MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-12">
                  {/* PROJECT DESCRIPTION */}
                  <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-lg">
                        <Sparkles className="text-emerald-700" size={24} />
                      </div>
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                          What We Did
                        </h2>
                        <p className="text-slate-600 mt-2 font-light">A comprehensive overview of our approach and execution</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-3xl blur-2xl opacity-15" />
                      <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-xl">
                        <p className="text-lg lg:text-xl text-slate-700 leading-relaxed font-light">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* KEY OBJECTIVES */}
                  <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-md">
                          <Target className="text-emerald-700" size={22} />
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Key Objectives</h3>
                      </div>

                      <ul className="space-y-4">
                        {(objectives.length > 0
                          ? objectives
                          : ["Increase brand awareness", "Improve engagement", "Drive conversions", "Strengthen trust", "Expand market reach", "Enhance user experience"]
                        ).map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 group animate-slide-up"
                            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300 mt-0.5">
                              <CheckCircle2 className="text-emerald-600" size={18} />
                            </div>
                            <span className="text-lg text-slate-700 font-medium pt-1 group-hover:text-emerald-700 transition-colors">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* WHAT WE DELIVERED */}
                  <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 lg:p-10 border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center shadow-md">
                          <Briefcase className="text-emerald-700" size={22} />
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">What We Delivered</h3>
                      </div>

                      <ul className="space-y-4">
                        {(project.services || []).slice(0, 8).map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 group animate-slide-up"
                            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border-2 border-emerald-200 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 group-hover:border-emerald-300 group-hover:scale-110 transition-all duration-300 mt-0.5">
                              <Rocket className="text-emerald-600" size={16} />
                            </div>
                            <span className="text-lg text-slate-700 font-medium pt-1 group-hover:text-emerald-700 transition-colors">
                              {s}
                            </span>
                          </li>
                        ))}

                        {(!project.services || project.services.length === 0) && (
                          <li className="text-slate-600 font-light italic">
                            Services information will be displayed here when available.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - SIDEBAR */}
                <div className="space-y-6 lg:sticky lg:top-32 h-fit">
                  {/* PROJECT DETAILS CARD */}
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-200 shadow-lg animate-fade-in-right">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <BarChart3 className="text-emerald-600" size={20} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900">Project Details</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Year */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
                            <Calendar className="text-emerald-600" size={18} />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Year</div>
                            <div className="text-lg font-extrabold text-slate-900">{project.year}</div>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
                            <MapPin className="text-emerald-600" size={18} />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</div>
                            <div className="text-lg font-extrabold text-slate-900">{project.location}</div>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      {project.duration && (
                        <div className="group">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
                              <Clock className="text-emerald-600" size={18} />
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Duration</div>
                              <div className="text-lg font-extrabold text-slate-900">{project.duration}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Users/Platform Usage */}
                      <div className="group pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-emerald-200 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 group-hover:scale-110 transition-all duration-300 shadow-md">
                            <Users className="text-emerald-700" size={18} />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Platform Users</div>
                            <div className="text-2xl font-extrabold text-emerald-600">{userCount}</div>
                            <div className="text-xs text-slate-600 font-medium mt-1">Active users</div>
                          </div>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="pt-4 border-t border-slate-200">
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Client</div>
                        <div className="text-lg font-bold text-slate-900">{project.client}</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA CARD */}
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl animate-fade-in-right" style={{ animationDelay: "0.3s" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="text-white" size={22} />
                      </div>
                      <div className="font-extrabold text-xl">Want Similar Results?</div>
                    </div>
                    <p className="text-emerald-50 text-sm mb-6 font-light leading-relaxed">
                      Let's plan a strategy tailored to your business goals and drive exceptional outcomes.
                    </p>
                    <Link
                      to="/contact"
                      className="group inline-flex items-center justify-center w-full gap-3 px-6 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-base
                               hover:bg-emerald-50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                               shadow-lg hover:shadow-xl"
                    >
                      <span>Get in Touch</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
          <PatternBg />

          <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg mb-6">
                <Sparkles size={16} className="shrink-0" />
                <span>Get Started</span>
              </div>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-emerald-50/95 leading-relaxed max-w-2xl mx-auto font-light mb-10">
                Let's discuss how we can help you achieve similar results for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                           shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                           border-2 border-transparent hover:border-emerald-100"
                >
                  <Calendar size={20} className="shrink-0" />
                  <span className="leading-none">Get Started</span>
                  <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button
                  onClick={() => {
                    navigate("/projects");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-base
                           border-2 border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                           shadow-lg hover:shadow-xl"
                >
                  <Briefcase size={20} className="shrink-0" />
                  <span className="leading-none">View All Projects</span>
                  <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}