import { Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    // Scroll to top when navigating
    const handleNavClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });
    };

    return (
        <footer
            role="contentinfo"
            className="relative mt-[150px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 overflow-hidden"
        >
            {/* Pattern Background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

            <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:gap-10">
                    {/* LOGO + SLOGAN SECTION */}
                    <div className="flex-1 space-y-3 pt-[83px]">
                        <div className="flex items-center gap-6">
                            {/* SVG LOGO */}
                            <div className="group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="121"
                                    height="83"
                                    viewBox="0 0 121 83"
                                    fill="none"
                                    className="transition-transform duration-300 group-hover:scale-105"
                                >
                                    <path
                                        d="M66.1622 82.1801H77.3922C78.7895 82.1801 79.6984 80.7153 79.0803 79.4635L41.4582 3.53363C40.7674 2.13637 38.7676 2.14157 38.0819 3.53883L0.87017 79.4687C0.257246 80.7205 1.16624 82.1801 2.55831 82.1801H46.5902C47.9874 82.1801 48.8964 80.7101 48.2731 79.4583L43.4009 69.7139C43.084 69.075 42.4295 68.675 41.7179 68.675H23.8912C22.4835 68.675 21.5745 67.1843 22.2186 65.9324L38.2689 34.8135C38.9753 33.4423 40.944 33.4578 41.6296 34.8447L64.474 81.1361C64.7909 81.775 65.4454 82.1801 66.1622 82.1801Z"
                                        fill="#FBFDF7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
                            Ready to talk growth.
                        </h2>

                        <p className="text-emerald-50/90 text-base font-light leading-relaxed max-w-md">
                            Transform your vision into reality with our strategic approach. We combine innovation, expertise, and creativity to deliver exceptional results.
                        </p>
                    </div>

                    {/* NAVIGATION LINKS */}
                    <div className="flex-1 pt-[83px]">
                        <h3 className="text-white font-bold text-base mb-3 tracking-wide">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    onClick={handleNavClick}
                                    className="text-emerald-50/90 hover:text-white transition-colors duration-300 font-medium text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    onClick={handleNavClick}
                                    className="text-emerald-50/90 hover:text-white transition-colors duration-300 font-medium text-sm"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    onClick={handleNavClick}
                                    className="text-emerald-50/90 hover:text-white transition-colors duration-300 font-medium text-sm"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/projects"
                                    onClick={handleNavClick}
                                    className="text-emerald-50/90 hover:text-white transition-colors duration-300 font-medium text-sm"
                                >
                                    Projects
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT + SOCIAL SECTION */}
                    <div className="flex-1 space-y-3 pt-[83px]">
                        <h3 className="text-white font-bold text-base mb-3 tracking-wide">Get In Touch</h3>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <a
                                href="tel:+4407772452848"
                                className="flex items-center gap-2 text-emerald-50/90 hover:text-white transition-colors duration-300 text-sm"
                            >
                                <Phone className="text-white shrink-0" size={16} strokeWidth={2} />
                                <span>+44 0777 245 2848</span>
                            </a>

                            <a
                                href="mailto:info@marketingagency.co"
                                className="flex items-center gap-2 text-emerald-50/90 hover:text-white transition-colors duration-300 text-sm"
                            >
                                <Mail className="text-white shrink-0" size={16} strokeWidth={2} />
                                <span className="break-all">info@marketingagency.co</span>
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="pt-3">
                            <div className="text-sm text-emerald-50/80 font-medium mb-3">Follow Us</div>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                                >
                                    <Facebook className="text-white group-hover:scale-110 transition-transform duration-300" size={20} strokeWidth={2} />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                                >
                                    <Instagram className="text-white group-hover:scale-110 transition-transform duration-300" size={20} strokeWidth={2} />
                                </a>
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                                >
                                    <Linkedin className="text-white group-hover:scale-110 transition-transform duration-300" size={20} strokeWidth={2} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className="mt-8 pt-4 border-t border-white/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-emerald-50/70 text-sm font-medium">
                            © {new Date().getFullYear()} Marketing Agency. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
