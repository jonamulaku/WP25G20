import HeroImage from "@/assets/images/unsplash_Hcfwew744z4.png";

import StrategyIcon from "@/assets/icons/strategic.svg";
import MarketingIcon from "@/assets/icons/marketing.svg";
import DesignIcon from "@/assets/icons/design.svg";
import ResearchIcon from "@/assets/icons/research.svg";

import ProfilePic from "@/assets/images/Ellipse 1.png";
import Brands from "@/assets/images/brands.png";

import Relax from "@/assets/images/Relax.png";
import Music from "@/assets/images/Music.png";
import Nature from "@/assets/images/Nature.png";
import {
  ArrowRight,
  Play,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* ================= LUXURY HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <TrendingUp size={16} />
                <span>Innovation Driven</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-slate-900">Provide Solutions</span>
                <br />
                <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  With Creativity
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Transform your vision into reality with our strategic approach.
                We combine innovation, expertise, and creativity to deliver
                exceptional results that drive growth and success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/projects"
                  className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold 
                                             shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 
                                             transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  className="group px-8 py-4 bg-white text-emerald-600 rounded-2xl font-semibold 
                                                 border-2 border-emerald-600 hover:bg-emerald-50 
                                                 transition-all duration-300 flex items-center justify-center gap-3
                                                 shadow-md hover:shadow-lg"
                >
                  <div
                    className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center
                                                  group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                  >
                    <Play size={16} className="ml-0.5" />
                  </div>
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-slate-900">860+</div>
                  <div className="text-sm text-slate-600">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">55+</div>
                  <div className="text-sm text-slate-600">Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">10+</div>
                  <div className="text-sm text-slate-600">Awards</div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur-2xl opacity-20"></div>
                <img
                  src={HeroImage}
                  alt="Hero"
                  className="relative rounded-3xl shadow-2xl w-full object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Award className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">100%</div>
                    <div className="text-xs text-slate-600">
                      Repeat Client Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <span>Our Expertise</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              What Do We Help?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: StrategyIcon,
                title: "Strategic Planning",
                desc: "Data-driven strategies for sustainable growth",
              },
              {
                icon: MarketingIcon,
                title: "Marketing & PR",
                desc: "Amplify your brand presence and reach",
              },
              {
                icon: DesignIcon,
                title: "Design & Production",
                desc: "Stunning visuals that captivate audiences",
              },
              {
                icon: ResearchIcon,
                title: "Research & Training",
                desc: "Deep insights and skill development",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-100/50
                                         transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/0 
                                              group-hover:from-emerald-50/50 group-hover:to-transparent rounded-3xl 
                                              transition-all duration-500"
                ></div>
                <div className="relative z-10">
                  <div
                    className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6
                                                  group-hover:bg-emerald-100 group-hover:scale-110 transition-transform duration-300"
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-12 h-12"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "860+",
                label: "Projects Completed",
                icon: CheckCircle2,
              },
              { value: "55+", label: "Happy Clients", icon: Users },
              { value: "10+", label: "Awards Won", icon: Award },
              { value: "100%", label: "Repeat Client Rate", icon: TrendingUp },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20
                                         hover:bg-white/20 hover:scale-105 transition-all duration-300
                                         text-center group"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center
                                              group-hover:bg-white/30 transition-colors"
                >
                  <stat.icon className="text-white" size={32} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-emerald-50 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL SECTION ================= */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <span>Client Success</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              We Shared Value With Our Clients
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Testimonial Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
                <div className="flex justify-center -mt-20 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50"></div>
                    <img
                      src={ProfilePic}
                      alt="Client"
                      className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 text-lg leading-relaxed text-center mb-8 italic">
                  "Working with this team has been transformative. Their
                  strategic approach and creative solutions have exceeded our
                  expectations and delivered measurable results for our
                  business."
                </p>

                <div className="border-t border-slate-200 pt-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Sally Lo, MBE
                  </h3>
                  <p className="text-slate-600">Sally Production Ltd.</p>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="lg:block hidden">
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                  Trusted By Industry Leaders
                </h3>
                <img
                  src={Brands}
                  alt="Brands"
                  className="w-full opacity-80 grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWS SECTION ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-24 xl:px-32">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <span>Latest Updates</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                News & Insights
              </h2>
            </div>
            <Link
              to="/news"
              className="group hidden lg:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="space-y-6">
            {[
              {
                img: Relax,
                date: "August 27, 2023",
                title: "Winner � Innovative Use of Technology Marketing Award",
                desc: "Recognized for groundbreaking digital marketing strategies that transformed client engagement.",
              },
              {
                img: Music,
                date: "August 20, 2023",
                title: "New Partnership with Global Tech Leaders",
                desc: "Expanding our reach through strategic collaborations with industry pioneers.",
              },
              {
                img: Nature,
                date: "August 15, 2023",
                title: "Sustainability Initiative Launch",
                desc: "Leading the way in eco-friendly business practices and sustainable growth solutions.",
              },
            ].map((item, i) => (
              <Link
                key={i}
                to="/news"
                className="group block bg-white rounded-2xl p-6 border border-slate-200 
                                         hover:border-emerald-300 hover:shadow-xl transition-all duration-300
                                         hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-emerald-100 rounded-xl blur group-hover:blur-md transition-all"></div>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="relative w-32 h-32 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-slate-500">
                        {item.date}
                      </span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-2">{item.desc}</p>
                  </div>
                  <ArrowRight
                    size={24}
                    className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-2 
                                                 transition-all flex-shrink-0 hidden lg:block"
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 lg:hidden">
            <Link
              to="/news"
              className="block w-full text-center px-6 py-3 bg-emerald-600 text-white rounded-xl 
                                     font-semibold hover:bg-emerald-700 transition-all duration-300"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
