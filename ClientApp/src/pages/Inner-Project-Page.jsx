import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  Play,
  Share2,
  Clock,
  Briefcase,
  Lightbulb,
  Rocket,
  BarChart3,
  Star,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

import { getProjectBySlug, getRelatedProjects } from "@/data/projectsData";

export default function InnerProjectPage() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const prevSlugRef = useRef(slug);

  const project = useMemo(() => getProjectBySlug(slug), [slug]);
  const related = useMemo(() => {
    if (!project) return [];
    return getRelatedProjects(project.id, project.category);
  }, [project]);

  // ✅ Scroll në TOP sa herë ndërron projekti (backup edhe nëse s'përdor ScrollToTop global)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [slug]);

  // Reset tab when slug changes - separate effect to avoid cascading renders
  useEffect(() => {
    if (prevSlugRef.current !== slug) {
      prevSlugRef.current = slug;
      // Schedule state update in next event loop to avoid synchronous setState warning
      Promise.resolve().then(() => {
        setActiveTab("overview");
      });
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Project not found</h1>
            <p className="text-slate-600 mb-8">This project doesn't exist or the link is incorrect.</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              <span>Back to Projects</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Reach", value: project.results?.reach, icon: TrendingUp },
    { label: "Engagement", value: project.results?.engagement, icon: Users },
    { label: "Conversion", value: project.results?.conversion, icon: Target },
    { label: "ROI", value: project.results?.roi, icon: BarChart3 },
    { label: "Events", value: project.results?.events, icon: Award },
    { label: "Participants", value: project.results?.participants, icon: Users },
  ].filter((s) => s.value && s.value !== "—");

  const tabs = [
    { id: "overview", label: "Overview", show: true },
    { id: "challenge", label: "Challenge", show: Boolean(project.challenge) },
    { id: "solution", label: "Solution", show: Boolean(project.solution) },
    { id: "process", label: "Process", show: Array.isArray(project.process) && project.process.length > 0 },
    { id: "results", label: "Results", show: Boolean(project.results) },
    { id: "gallery", label: "Gallery", show: Array.isArray(project.gallery) && project.gallery.length > 0 },
  ].filter((t) => t.show);

  // për Overview: i marrim disa outcomes prej results
  const outcomes = Object.entries(project.results || {}).filter(([, v]) => v && v !== "—").slice(0, 4);

  // Objectives: i nxjerrim “smart” prej services/tags (fallback nqs s’ka)
  const objectives =
    (project.services && project.services.length > 0
      ? project.services.slice(0, 4)
      : (project.tags || []).slice(0, 4)
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-28 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-emerald-50 mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-emerald-200">/</span>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <span className="text-emerald-200">/</span>
            <span className="text-white font-medium">{project.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Briefcase size={16} />
                <span>{project.category}</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h1>

              <p className="text-xl text-emerald-50 mb-8 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-8 text-emerald-50">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{project.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{project.location}</span>
                </div>
                {project.duration && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{project.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="group px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold 
                           shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] 
                           flex items-center justify-center gap-2"
                >
                  <Play size={20} className="ml-0.5" />
                  <span>Watch Case Study</span>
                </button>

                <button
                  type="button"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold 
                           hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  <span>Share Project</span>
                </button>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl opacity-50" />
                <img
                  src={project.heroImage || project.image}
                  alt={project.title}
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-200 -mt-1">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.slice(0, 6).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <stat.icon className="text-emerald-600" size={24} />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TABS */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="flex flex-wrap gap-3 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // optional: në mobile me i qit tabat në fokus
                  const tabsEl = document.getElementById("project-tabs");
                  if (tabsEl) tabsEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div id="project-tabs" />

      {/* OVERVIEW (UPGRADED) */}
      {activeTab === "overview" && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* MAIN */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="text-emerald-600" size={22} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight">Project Overview</h2>
                    <p className="text-slate-600 mt-1">
                      A quick snapshot of goals, execution, and impact.
                    </p>
                  </div>
                </div>

                {/* Quick Summary Card */}
                <div className="relative mb-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-emerald-600 rounded-3xl blur-2xl opacity-15" />
                  <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-200 shadow-xl">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                        {project.type}
                      </span>
                      <span className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-semibold">
                        {project.category}
                      </span>
                      {(project.tags || []).slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-lg text-slate-700 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Outcomes mini-grid */}
                    {outcomes.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-6">
                        {outcomes.map(([k, v], i) => (
                          <div
                            key={i}
                            className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between"
                          >
                            <div className="text-sm text-slate-600 capitalize">{k}</div>
                            <div className="text-xl font-bold text-emerald-600">{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Objectives + Services */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Target className="text-emerald-600" size={18} />
                      Key Objectives
                    </h3>

                    <ul className="space-y-3">
                      {(objectives.length > 0 ? objectives : ["Increase brand awareness", "Improve engagement", "Drive conversions", "Strengthen trust"]).map(
                        (item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
                            <span className="text-slate-700">{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 border border-emerald-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Briefcase className="text-emerald-600" size={18} />
                      What We Delivered
                    </h3>

                    <ul className="space-y-3">
                      {(project.services || []).slice(0, 6).map((s, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
                          <span className="text-slate-700">{s}</span>
                        </li>
                      ))}

                      {(!project.services || project.services.length === 0) && (
                        <li className="text-slate-600">
                          Add <span className="font-semibold">services</span> in your project data to show deliverables here.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Optional: Teasers për Challenge/Solution */}
                {(project.challenge || project.solution) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.challenge && (
                      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-700 text-sm font-semibold mb-4 border border-slate-200">
                          <Lightbulb size={16} className="text-emerald-600" />
                          Challenge
                        </div>
                        <p className="text-slate-700 leading-relaxed line-clamp-6">{project.challenge}</p>
                        <button
                          className="mt-5 text-emerald-700 font-semibold inline-flex items-center gap-2 hover:text-emerald-800"
                          onClick={() => setActiveTab("challenge")}
                          type="button"
                        >
                          Read full challenge <ArrowRight size={16} />
                        </button>
                      </div>
                    )}

                    {project.solution && (
                      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-slate-700 text-sm font-semibold mb-4 border border-slate-200">
                          <Rocket size={16} className="text-emerald-600" />
                          Solution
                        </div>
                        <p className="text-slate-700 leading-relaxed line-clamp-6">{project.solution}</p>
                        <button
                          className="mt-5 text-emerald-700 font-semibold inline-flex items-center gap-2 hover:text-emerald-800"
                          onClick={() => setActiveTab("solution")}
                          type="button"
                        >
                          Read full solution <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="space-y-6 lg:sticky lg:top-32 h-fit">
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-5">Project Snapshot</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Client</div>
                      <div className="font-semibold text-slate-900">{project.client}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs text-slate-600 mb-1">Category</div>
                        <div className="font-semibold text-slate-900">{project.category}</div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs text-slate-600 mb-1">Type</div>
                        <div className="font-semibold text-slate-900">{project.type}</div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs text-slate-600 mb-1">Year</div>
                        <div className="font-semibold text-slate-900">{project.year}</div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="text-xs text-slate-600 mb-1">Duration</div>
                        <div className="font-semibold text-slate-900">{project.duration || "—"}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4">
                      <div className="text-xs text-slate-600 mb-1">Location</div>
                      <div className="font-semibold text-slate-900">{project.location}</div>
                    </div>
                  </div>
                </div>

                {(project.tags || []).length > 0 && (
                  <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-3xl p-7 text-white shadow-lg">
                  <div className="font-bold text-lg mb-2">Want similar results?</div>
                  <p className="text-emerald-50 text-sm mb-5">
                    Let’s plan a strategy tailored to your business goals.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 bg-white text-emerald-700 rounded-2xl font-semibold hover:bg-emerald-50 transition"
                  >
                    Get in touch <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHALLENGE */}
      {activeTab === "challenge" && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <Lightbulb size={16} />
                <span>The Challenge</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Understanding the Problem</h2>

              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl">
                <p className="text-lg text-slate-700 leading-relaxed">{project.challenge}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SOLUTION */}
      {activeTab === "solution" && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <Rocket size={16} />
                <span>Our Solution</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8">Strategic Approach</h2>

              <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-xl">
                <p className="text-lg text-slate-700 leading-relaxed">{project.solution}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {activeTab === "process" && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <Rocket size={16} />
                <span>Our Process</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How We Delivered</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {project.process.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative bg-white rounded-3xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-5xl font-bold text-emerald-100 group-hover:text-emerald-200 transition-colors">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Rocket className="text-emerald-600" size={24} />
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4 text-sm">{step.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock size={14} />
                      <span>{step.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULTS */}
      {activeTab === "results" && (
        <section className="py-16 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-4">
                <BarChart3 size={16} />
                <span>Results & Impact</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Measurable Success</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(project.results || {}).map(([key, value], i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20
                           hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 text-center"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{value}</div>
                  <div className="text-emerald-50 text-sm font-medium capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {activeTab === "gallery" && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <ImageIcon size={16} />
                <span>Project Gallery</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Visual Showcase</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.gallery.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition" />
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {project.testimonial && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-20" />
                <div className="relative bg-white rounded-3xl p-12 border border-slate-100 shadow-2xl">
                  <div className="flex justify-center mb-6">
                    <div className="flex gap-1">
                      {Array.from({ length: project.testimonial.rating || 5 }).map((_, i) => (
                        <Star key={i} className="text-amber-400 fill-amber-400" size={24} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xl text-slate-700 leading-relaxed text-center mb-8 italic">
                    "{project.testimonial.quote}"
                  </p>

                  <div className="border-t border-slate-200 pt-6 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{project.testimonial.author}</h3>
                    <p className="text-slate-600">
                      {project.testimonial.role}, {project.testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Related Projects</h2>
                <p className="text-slate-600 mt-2">Explore more campaigns in the same category</p>
              </div>
              <Link
                to="/projects"
                className="group hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                         font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>View All Projects</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="group relative block bg-white rounded-2xl overflow-hidden border border-slate-200 
                           hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 group-hover:from-black/80 transition-all" />
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold">
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="text-white font-bold text-lg mb-1">{p.title}</div>
                      <div className="text-emerald-200 text-sm">{p.results?.reach} Reach</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
            <p className="text-emerald-50 text-lg mb-8">
              Let’s discuss how we can help you achieve similar results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/projects"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold 
                         hover:bg-white/20 transition-all duration-300"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
