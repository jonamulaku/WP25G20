import { useMemo, useState, useEffect, useCallback, useRef, startTransition } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  Calendar,
  MapPin,
  ExternalLink,
  Eye,
  Sparkles,
  Briefcase,
  Zap,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";

import { projects as projectsData } from "@/data/projectsData";

// Navbar height constant (matches NavBar.jsx h-20 = 80px = 5rem)
const NAVBAR_HEIGHT = "5rem"; // 80px

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

// Skeleton Loading Component
const ProjectCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
    <div className="w-full h-64 bg-slate-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-6 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
      <div className="flex gap-2">
        <div className="h-6 bg-slate-200 rounded w-20" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>
    </div>
  </div>
);

// Image Component with Loading Safety
const SafeImage = ({ src, alt, className, onError, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center`}
      >
        <div className="text-center p-4">
          <ImageIcon className="text-slate-400 mx-auto mb-2" size={32} />
          <p className="text-xs text-slate-500">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`absolute inset-0 ${className} bg-slate-200 animate-pulse flex items-center justify-center`}
        >
          <Loader2 className="text-slate-400 animate-spin" size={24} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingUrlRef = useRef(false);

  // Initialize state from URL params
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "All");
  const [activeType, setActiveType] = useState(() => searchParams.get("type") || "All");
  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") || "");
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search input (300ms delay)
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync state when searchParams change externally (e.g., browser back/forward)
  // Skip if we're the ones updating the URL to prevent circular updates
  useEffect(() => {
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }

    const category = searchParams.get("category") || "All";
    const type = searchParams.get("type") || "All";
    const search = searchParams.get("search") || "";

    // Use startTransition to mark these as non-urgent updates
    // This prevents cascading renders and satisfies React's requirements
    startTransition(() => {
      setActiveCategory((prev) => (prev !== category ? category : prev));
      setActiveType((prev) => (prev !== type ? type : prev));
      setSearchInput((prev) => (prev !== search ? search : prev));
    });
  }, [searchParams]); // Only depend on searchParams

  // Update URL when filters change
  useEffect(() => {
    const currentCategory = searchParams.get("category") || "All";
    const currentType = searchParams.get("type") || "All";
    const currentSearch = searchParams.get("search") || "";

    // Only update URL if state differs from current URL params
    const needsUpdate =
      activeCategory !== currentCategory ||
      activeType !== currentType ||
      debouncedSearch.trim() !== currentSearch;

    if (needsUpdate) {
      isUpdatingUrlRef.current = true;
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (activeType !== "All") params.set("type", activeType);
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

      setSearchParams(params, { replace: true });
    }
  }, [activeCategory, activeType, debouncedSearch, searchParams, setSearchParams]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const projectCategories = useMemo(() => {
    const cats = Array.from(new Set(projectsData.map((p) => p.category))).filter(Boolean);
    return ["All", ...cats];
  }, []);

  const projectTypes = useMemo(() => {
    const types = Array.from(new Set(projectsData.map((p) => p.type))).filter(Boolean);
    return ["All", ...types];
  }, []);

  const filteredProjects = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return projectsData.filter((project) => {
      const matchesCategory = activeCategory === "All" || project.category === activeCategory;
      const matchesType = activeType === "All" || project.type === activeType;

      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        String(project.client || "").toLowerCase().includes(q) ||
        String(project.location || "").toLowerCase().includes(q);

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [activeCategory, activeType, debouncedSearch]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleTypeChange = useCallback((type) => {
    setActiveType(type);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setActiveCategory("All");
    setActiveType("All");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* HERO */}
      <section
        className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 overflow-hidden min-h-[85vh] flex items-center"
        aria-label="Projects page header"
      >
        <PatternBg />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-20 lg:py-32 relative z-10">
          <nav
            className="flex items-center gap-2 text-sm text-emerald-50 mb-8 animate-fade-in"
            aria-label="Breadcrumb navigation"
          >
            <Link
              to="/"
              className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              aria-label="Navigate to home page"
            >
              Home
            </Link>
            <span className="text-emerald-200" aria-hidden="true">
              /
            </span>
            <span className="text-white font-medium" aria-current="page">
              Our Projects
            </span>
          </nav>

          <div className="max-w-4xl animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg hover:bg-white/25 transition-all duration-300 mb-6"
              role="status"
              aria-label="Portfolio section"
            >
              <Briefcase size={16} aria-hidden="true" className="shrink-0" />
              <span>Portfolio</span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-white tracking-tight mb-6">
              Our Projects
            </h1>

            <p className="text-xl lg:text-2xl text-emerald-50/95 leading-relaxed max-w-xl font-light mb-8">
              Explore our portfolio of successful campaigns, innovative strategies, and measurable outcomes.
            </p>

            <div className="relative max-w-2xl animate-fade-in-right">
              <label htmlFor="project-search" className="sr-only">
                Search projects by title, client, or location
              </label>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={20}
                aria-hidden="true"
              />
              <input
                id="project-search"
                type="search"
                placeholder="Search projects by title, client, location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-0 shadow-xl 
                           text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-300 
                           focus:outline-none text-lg transition-all duration-200"
                aria-label="Search projects"
                aria-describedby="search-description"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 
                             transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
              <span id="search-description" className="sr-only">
                Search will filter projects as you type
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section
        className="w-full bg-white/98 backdrop-blur-lg border-b border-slate-200 shadow-md"
        role="search"
        aria-label="Project filters"
      >
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-600 font-semibold flex items-center gap-2" id="category-label">
                <Filter size={18} aria-hidden="true" className="text-emerald-600" />
                <span>Category:</span>
              </span>

              <div role="group" aria-labelledby="category-label" className="flex flex-wrap gap-3">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2
                      hover:scale-105 hover:-translate-y-0.5
                      ${
                        activeCategory === category
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    aria-pressed={activeCategory === category}
                    aria-label={`Filter by ${category} category`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-600 font-semibold flex items-center gap-2" id="type-label">
                <Zap size={18} aria-hidden="true" className="text-emerald-600" />
                <span>Type:</span>
              </span>

              <div role="group" aria-labelledby="type-label" className="flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2
                      hover:scale-105 hover:-translate-y-0.5
                      ${
                        activeType === type
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    aria-pressed={activeType === type}
                    aria-label={`Filter by ${type} type`}
                  >
                    {type === "All" ? "All Types" : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-24 bg-slate-50" aria-label="All projects">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <SectionHeader
            badgeIcon={Briefcase}
            badgeText="Portfolio"
            title="All Projects"
            desc="Browse through our comprehensive collection of successful campaigns and innovative projects"
          />

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="status" aria-label="Loading projects">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div
                className="text-center mb-10 text-slate-600 font-medium"
                aria-live="polite"
                aria-atomic="true"
              >
                Showing <span className="font-extrabold text-emerald-600">{filteredProjects.length}</span>{" "}
                {filteredProjects.length === 1 ? "project" : "projects"}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <article
                    key={project.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 
                               hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                               hover:-translate-y-2 flex flex-col animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="flex flex-col flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 rounded-2xl"
                      aria-label={`View project: ${project.title}`}
                    >
                      <div className="relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/70 transition-all"
                          aria-hidden="true"
                        />
                        <SafeImage
                          src={project.image}
                          alt={`${project.title} project image`}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                          <span
                            className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-semibold"
                            aria-label={`Category: ${project.category}`}
                          >
                            {project.category}
                          </span>
                          <span
                            className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold"
                            aria-label={`Type: ${project.type}`}
                          >
                            {project.type}
                          </span>
                        </div>

                        <div className="absolute top-4 right-4 z-20">
                          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ExternalLink className="text-emerald-700" size={16} aria-hidden="true" />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2.5 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={11} aria-hidden="true" />
                            <time dateTime={project.year}>{project.year}</time>
                          </div>
                          <span aria-hidden="true">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin size={11} aria-hidden="true" />
                            <span className="line-clamp-1">{project.location}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                          {project.title}
                        </h3>

                        <p className="text-slate-600 text-xs mb-1 font-medium">
                          <span className="font-bold">Client:</span> {project.client}
                        </p>

                        <p className="text-slate-600 text-xs mb-3 line-clamp-2 flex-1 font-light leading-relaxed">
                          {project.description}
                        </p>

                        <dl className="flex items-center gap-4 mb-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <dt className="sr-only">Reach</dt>
                            <TrendingUp size={12} aria-hidden="true" />
                            <dd className="font-semibold">{project.results?.reach}</dd>
                          </div>
                          <div className="flex items-center gap-1">
                            <dt className="sr-only">Engagement</dt>
                            <Users size={12} aria-hidden="true" />
                            <dd className="font-semibold">{project.results?.engagement}</dd>
                          </div>
                          <div className="flex items-center gap-1">
                            <dt className="sr-only">Conversion</dt>
                            <Target size={12} aria-hidden="true" />
                            <dd className="font-semibold">{project.results?.conversion}</dd>
                          </div>
                        </dl>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.tags || []).slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold"
                              aria-label={`Tag: ${tag}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                          <span className="group inline-flex items-center gap-2 text-emerald-600 font-bold">
                            <span>View Details</span>
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform duration-300"
                              aria-hidden="true"
                            />
                          </span>

                          <span
                            className="p-2 text-slate-400 group-hover:text-emerald-600 transition-colors"
                            aria-hidden="true"
                          >
                            <Eye size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-20" role="status" aria-live="polite">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <Search className="text-slate-400" size={40} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No projects found</h3>
                  <p className="text-slate-600 mb-4 font-light">
                    Try adjusting your search or selecting different filters
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base
                             hover:bg-emerald-700 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                             shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    aria-label="Clear all filters and search"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden"
        aria-label="Call to action"
      >
        <PatternBg />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30 shadow-lg mb-6">
              <Sparkles size={16} className="shrink-0" />
              <span>Get Started</span>
            </div>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-emerald-50/95 leading-relaxed max-w-2xl mx-auto font-light mb-10">
              Let's discuss how we can help you achieve your marketing goals and drive exceptional results.
            </p>
            <div className="flex justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-bold text-base
                         shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5
                         border-2 border-transparent hover:border-emerald-100
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
                aria-label="Get started with your project"
              >
                <Calendar size={20} className="shrink-0" />
                <span className="leading-none">Get Started</span>
                <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}