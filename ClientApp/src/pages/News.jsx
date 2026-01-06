import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import Relax from "@/assets/images/Relax.png";
import Music from "@/assets/images/Music.png";
import Nature from "@/assets/images/Nature.png";

const categories = ["All", "Education", "Corporate", "Technology", "Awards"];

const newsArticles = [
    {
        id: 1,
        img: Relax,
        date: "August 27, 2023",
        category: "Awards",
        title: "Winner – Innovative Use of Technology Marketing Award",
        excerpt: "We are thrilled to announce our recognition for groundbreaking digital marketing strategies that have transformed client engagement and delivered exceptional results across multiple industries.",
        readTime: "5 min read",
        featured: true,
    },
    {
        id: 2,
        img: Music,
        date: "August 20, 2023",
        category: "Corporate",
        title: "New Partnership with Global Tech Leaders",
        excerpt: "Expanding our reach through strategic collaborations with industry pioneers. This partnership enables us to deliver cutting-edge solutions to our clients worldwide.",
        readTime: "4 min read",
        featured: false,
    },
    {
        id: 3,
        img: Nature,
        date: "August 15, 2023",
        category: "Corporate",
        title: "Sustainability Initiative Launch",
        excerpt: "Leading the way in eco-friendly business practices and sustainable growth solutions. Our commitment to environmental responsibility drives innovation in every project.",
        readTime: "6 min read",
        featured: false,
    },
    {
        id: 4,
        img: Relax,
        date: "August 10, 2023",
        category: "Education",
        title: "Digital Transformation Workshop Series",
        excerpt: "Empowering businesses with the knowledge and tools needed to navigate the digital landscape successfully. Join our comprehensive workshop series.",
        readTime: "3 min read",
        featured: false,
    },
    {
        id: 5,
        img: Music,
        date: "August 5, 2023",
        category: "Technology",
        title: "AI-Powered Marketing Solutions",
        excerpt: "Revolutionizing marketing strategies with artificial intelligence. Discover how our AI solutions are helping clients achieve unprecedented growth.",
        readTime: "7 min read",
        featured: false,
    },
    {
        id: 6,
        img: Nature,
        date: "July 28, 2023",
        category: "Awards",
        title: "Excellence in Client Service Award",
        excerpt: "Recognized for outstanding client satisfaction and service delivery. This award reflects our commitment to exceeding expectations.",
        readTime: "4 min read",
        featured: false,
    },
];

export default function News() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredArticles = activeCategory === "All"
        ? newsArticles
        : newsArticles.filter(article => article.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* ================= HEADER SECTION ================= */}
            <section className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-emerald-600 font-medium">News</span>
                    </nav>

                    {/* Title */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                            <span>Latest Updates</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-4">
                            News & Insights
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Stay informed with our latest achievements, partnerships, and industry insights
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300
                                    ${activeCategory === category
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                                        : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= ARTICLES GRID ================= */}
            <section className="py-16">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32">
                    {/* Featured Article */}
                    {filteredArticles.length > 0 && filteredArticles[0]?.featured && (
                        <div className="mb-16">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                                    <div className="grid lg:grid-cols-2 gap-0">
                                        <div className="relative h-96 lg:h-auto overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                            <img
                                                src={filteredArticles[0].img}
                                                alt={filteredArticles[0].title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-6 left-6 z-20">
                                                <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg">
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    <span>{filteredArticles[0].date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    <span>{filteredArticles[0].readTime}</span>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                                                    <Tag size={12} />
                                                    {filteredArticles[0].category}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                                                {filteredArticles[0].title}
                                            </h2>
                                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                                {filteredArticles[0].excerpt}
                                            </p>
                                            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold 
                                                             hover:bg-emerald-700 transition-all duration-300 w-fit shadow-lg hover:shadow-xl">
                                                <span>Read Article</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Articles Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles
                            .filter(article => !article.featured)
                            .map((article) => (
                                <article
                                    key={article.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 
                                             hover:border-emerald-300 hover:shadow-2xl transition-all duration-300
                                             hover:-translate-y-2 flex flex-col"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 
                                                      group-hover:from-black/60 transition-all"></div>
                                        <img
                                            src={article.img}
                                            alt={article.title}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-semibold">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                <span>{article.date}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 
                                                      group-hover:text-emerald-600 transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                                            {article.excerpt}
                                        </p>

                                        <button className="group inline-flex items-center gap-2 text-emerald-600 font-semibold 
                                                         hover:text-emerald-700 transition-colors mt-auto">
                                            <span>Read More</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </article>
                            ))}
                    </div>

                    {/* Load More Button */}
                    {filteredArticles.length > 6 && (
                        <div className="mt-12 text-center">
                            <button className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl 
                                             font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300
                                             shadow-lg hover:shadow-xl">
                                Load More Articles
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredArticles.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                                <Tag className="text-slate-400" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
                            <p className="text-slate-600">Try selecting a different category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= NEWSLETTER CTA ================= */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Stay Updated with Our Latest News
                        </h2>
                        <p className="text-emerald-50 text-lg mb-8">
                            Subscribe to our newsletter and never miss an update
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50 
                                         text-slate-900 placeholder-slate-500"
                            />
                            <button className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                             hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
