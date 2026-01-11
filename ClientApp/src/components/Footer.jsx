import { Facebook, Instagram, Linkedin, Calendar, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            role="contentinfo"
            className="bg-[#14b85a] mt-[150px]"
        >
            {/* CONVERSION CTA BANNER */}
            <div className="border-b border-white/20">
                <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                                    Ready to Transform Your Business?
                                </h2>
                                <p className="text-emerald-50 text-lg">
                                    Join 55+ companies achieving measurable results. Let's discuss your strategy.
                                </p>
                            </div>
                            <Link
                                to="/contact"
                                data-cta-id="footer-primary"
                                data-cta-variant="strategy-call"
                                data-cta-location="footer-banner"
                                onClick={() => {
                                    if (window.gtag) {
                                        window.gtag('event', 'cta_click', {
                                            'cta_id': 'footer-primary',
                                            'cta_variant': 'strategy-call',
                                            'location': 'footer-banner'
                                        });
                                    }
                                }}
                                className="group px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold 
                                         hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl
                                         flex items-center gap-2 whitespace-nowrap"
                            >
                                <Calendar size={20} />
                                <span>Request a Strategy Call</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN FOOTER CONTENT */}
            <div className="container mx-auto px-6 lg:px-24 xl:px-32 py-16">
                <div className="grid lg:grid-cols-4 gap-12 mb-12">
                    {/* BRAND COLUMN */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="121"
                                height="83"
                                viewBox="0 0 121 83"
                                fill="none"
                                className="mb-6"
                            >
                                <path
                                    d="M66.1622 82.1801H77.3922C78.7895 82.1801 79.6984 80.7153 79.0803 79.4635L41.4582 3.53363C40.7674 2.13637 38.7676 2.14157 38.0819 3.53883L0.87017 79.4687C0.257246 80.7205 1.16624 82.1801 2.55831 82.1801H46.5902C47.9874 82.1801 48.8964 80.7101 48.2731 79.4583L43.4009 69.7139C43.084 69.075 42.4295 68.675 41.7179 68.675H23.8912C22.4835 68.675 21.5745 67.1843 22.2186 65.9324L38.2689 34.8135C38.9753 33.4423 40.944 33.4578 41.6296 34.8447L64.474 81.1361C64.7909 81.775 65.4454 82.1801 66.1622 82.1801Z"
                                    fill="#FBFDF7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-white text-xl font-semibold mb-4">
                            Ready to talk growth.
                        </h3>
                        <p className="text-emerald-50 text-sm leading-relaxed mb-6">
                            Transform your vision into reality with our strategic approach. We combine innovation, expertise, and creativity to deliver exceptional results.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Facebook size={20} className="text-white" />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Instagram size={20} className="text-white" />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            >
                                <Linkedin size={20} className="text-white" />
                            </a>
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/team" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link to="/news" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* SERVICES */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/projects" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Strategic Planning
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Marketing & PR
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Design & Production
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    Research & Training
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT INFO */}
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Get In Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="text-white mt-1 flex-shrink-0" size={18} />
                                <a href="tel:+4407772452848" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    +44 0777 245 2848
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="text-white mt-1 flex-shrink-0" size={18} />
                                <a href="mailto:info@marketingagency.co" className="text-emerald-50 hover:text-white transition-colors text-sm">
                                    info@marketingagency.co
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="text-white mt-1 flex-shrink-0" size={18} />
                                <span className="text-emerald-50 text-sm">
                                    London, UK
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-white/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-emerald-50 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Marketing Agency. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/contact" className="text-emerald-50 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/contact" className="text-emerald-50 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}