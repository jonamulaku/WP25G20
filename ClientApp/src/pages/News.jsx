import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  Search,
  TrendingUp,
  Download,
  Mail,
  Share2,
  FileText,
  Sparkles,
  Newspaper,
  Filter,
} from "lucide-react";

import Relax from "@/assets/images/Relax.png";
import Music from "@/assets/images/Music.png";
import Nature from "@/assets/images/Nature.png";

const categories = ["All", "Education", "Corporate", "Technology", "Awards", "Press Releases"];

const trendingTags = ["Digital Marketing", "Brand Strategy", "Content Creation", "Social Media", "SEO", "Analytics"];

const newsArticles = [
  {
    id: 1,
    img: Relax,
    date: "August 27, 2023",
    category: "Awards",
    title: "Winner – Innovative Use of Technology Marketing Award",
    excerpt:
      "We are thrilled to announce our recognition for groundbreaking digital marketing strategies that have transformed client engagement and delivered exceptional results across multiple industries.",
    readTime: "5 min read",
    featured: true,
    views: "2.4K",
  },
  {
    id: 2,
    img: Music,
    date: "August 20, 2023",
    category: "Corporate",
    title: "New Partnership with Global Tech Leaders",
    excerpt:
      "Expanding our reach through strategic collaborations with industry pioneers. This partnership enables us to deliver cutting-edge solutions to our clients worldwide.",
    readTime: "4 min read",
    featured: false,
    views: "1.8K",
  },
  {
    id: 3,
    img: Nature,
    date: "August 15, 2023",
    category: "Corporate",
    title: "Sustainability Initiative Launch",
    excerpt:
      "Leading the way in eco-friendly business practices and sustainable growth solutions. Our commitment to environmental responsibility drives innovation in every project.",
    readTime: "6 min read",
    featured: false,
    views: "1.5K",
  },
  {
    id: 4,
    img: Relax,
    date: "August 10, 2023",
    category: "Education",
    title: "Digital Transformation Workshop Series",
    excerpt:
      "Empowering businesses with the knowledge and tools needed to navigate the digital landscape successfully. Join our comprehensive workshop series.",
    readTime: "3 min read",
    featured: false,
    views: "1.2K",
  },
  {
    id: 5,
    img: Music,
    date: "August 5, 2023",
    category: "Technology",
    title: "AI-Powered Marketing Solutions",
    excerpt:
      "Revolutionizing marketing strategies with artificial intelligence. Discover how our AI solutions are helping clients achieve unprecedented growth.",
    readTime: "7 min read",
    featured: false,
    views: "2.1K",
  },
  {
    id: 6,
    img: Nature,
    date: "July 28, 2023",
    category: "Awards",
    title: "Excellence in Client Service Award",
    excerpt:
      "Recognized for outstanding client satisfaction and service delivery. This award reflects our commitment to exceeding expectations.",
    readTime: "4 min read",
    featured: false,
    views: "950",
  },
];

const pressReleases = [
  { id: 1, title: "Q3 2023 Financial Results", date: "September 15, 2023", category: "Press Releases" },
  { id: 2, title: "New Office Opening in London", date: "September 10, 2023", category: "Press Releases" },
  { id: 3, title: "Partnership Announcement with TechCorp", date: "September 5, 2023", category: "Press Releases" },
];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredArticle = useMemo(() => newsArticles.find((a) => a.featured) || null, []);
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return newsArticles.filter((article) => {
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const gridArticles = filteredArticles.filter((a) => !a.featured);
  const showFeatured = featuredArticle && (activeCategory === "All" || featuredArticle.category === activeCategory);

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
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-emerald-200">/</span>
            <span className="text-white font-medium">News & Press</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Newspaper size={16} />
              <span>Media Center</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">News & Insights</h1>

            <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
              Stay informed with our latest achievements, industry insights, press releases, and thought leadership content.
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search articles, press releases, and insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-0 shadow-xl
                           text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-emerald-300
                           focus:outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS + TRENDING */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2
                  ${activeCategory === "All"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                <Filter size={16} />
                All
              </button>

              {categories
                .filter((cat) => cat !== "All")
                .map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300
                      ${activeCategory === category
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    {category}
                  </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
                <TrendingUp size={16} />
                Trending:
              </span>

              {trendingTags.slice(0, 4).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium
                           hover:bg-emerald-100 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {showFeatured && (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-6 lg:px-24 xl:px-32">
            <div className="mb-8 flex items-center gap-3">
              <Sparkles className="text-emerald-600" size={24} />
              <h2 className="text-3xl font-bold text-slate-900">Featured Story</h2>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-96 lg:h-[500px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                    <img
                      src={featuredArticle.img}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 z-20 flex gap-3">
                      <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                        Featured
                      </span>
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-semibold">
                        {featuredArticle.views} views
                      </span>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{featuredArticle.date}</span>
                      </div>
                      <span className="opacity-50">•</span>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                        <Tag size={14} />
                        {featuredArticle.category}
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">{featuredArticle.excerpt}</p>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                                 hover:bg-emerald-700 transition-all duration-300 w-fit shadow-lg hover:shadow-xl"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                        aria-label="Share article"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Latest Articles</h2>
            <span className="text-slate-600 text-sm">{gridArticles.length} articles</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                           hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                           hover:-translate-y-2 flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 group-hover:from-black/70 transition-all" />
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                      {article.views} views
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{article.date}</span>
                    </div>
                    <span className="opacity-50">•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="text-slate-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or selecting a different category</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PRESS RELEASES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="flex items-center gap-3 mb-10">
            <FileText className="text-emerald-600" size={28} />
            <h2 className="text-3xl font-bold text-slate-900">Press Releases</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pressReleases.map((release) => (
              <button
                key={release.id}
                type="button"
                className="group text-left bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200
                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                    Press Release
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <Download size={18} />
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {release.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={14} />
                  <span>{release.date}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              className="px-7 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                       hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Press Releases
            </button>
          </div>
        </div>
      </section>

      {/* MEDIA KIT + PRESS CONTACT */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Download className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Media Kit</h3>
                  <p className="text-emerald-50 text-sm">Download our brand assets</p>
                </div>
              </div>
              <p className="text-emerald-50 mb-6 leading-relaxed">
                Access our logo files, brand guidelines, high-resolution images, and company information for media use.
              </p>
              <button
                type="button"
                className="w-full px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold
                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Download Media Kit
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Press Inquiries</h3>
                  <p className="text-emerald-50 text-sm">Get in touch with our team</p>
                </div>
              </div>
              <p className="text-emerald-50 mb-6 leading-relaxed">
                For media inquiries, interview requests, or press-related questions, please contact our communications team.
              </p>
              <a
                href="mailto:press@marketingagency.co"
                className="block w-full px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold
                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                Contact Press Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-12 border border-emerald-100 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <Mail size={16} />
                <span>Stay Connected</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Never Miss an Update</h2>
              <p className="text-lg text-slate-600">
                Subscribe to our newsletter and be the first to know about our latest news, insights, and industry updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-emerald-500
                         focus:border-emerald-500 text-slate-900 placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold
                         hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
