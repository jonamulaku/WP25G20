import { useState } from "react";
import { Menu, X, Mail, Phone, MapPin, Send, X as XIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logos/Group.svg";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
    });
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/team", label: "Team" },
        { path: "/projects", label: "Projects" },
        { path: "/news", label: "News" },
    ];

    const isActive = (path) => location.pathname === path;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
        // You can add API call here
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            subject: "",
            message: ""
        });
        setContactModalOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
                <nav className="container mx-auto px-6 lg:px-24 xl:px-32">
                    <div className="flex items-center justify-between h-20">
                        {/* NAV LINKS - Desktop */}
                        <div className="hidden lg:flex items-center gap-8 flex-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-3 py-2 font-medium transition-all duration-300
                                        ${isActive(link.path)
                                            ? "text-emerald-600"
                                            : "text-slate-700 hover:text-emerald-600"
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.path) && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* LOGO */}
                        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
                            <Link to="/" className="flex items-center group">
                                <img
                                    src={Logo}
                                    alt="logo"
                                    className="h-10 transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* CONTACT BUTTON - Desktop */}
                        <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
                            <button
                                type="button"
                                onClick={() => setContactModalOpen(true)}
                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold
                                         hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20
                                         hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105"
                            >
                                Contact
                            </button>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            type="button"
                            aria-label="Toggle navigation menu"
                            className="lg:hidden text-slate-700 hover:text-emerald-600 transition-colors p-2"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* MOBILE MENU */}
                    <div
                        className={`lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl
                            transition-all duration-300 ease-in-out ${open ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                    >
                        <div className="container mx-auto px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setOpen(false)}
                                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        ${isActive(link.path)
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setContactModalOpen(true);
                                }}
                                className="block w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                                         text-center hover:bg-emerald-700 transition-all duration-300"
                            >
                                Contact
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* ================= CONTACT MODAL ================= */}
            {contactModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={() => setContactModalOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                    {/* Modal Content */}
                    <div
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setContactModalOpen(false)}
                            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 
                                     flex items-center justify-center transition-colors text-slate-700 hover:text-slate-900"
                            aria-label="Close modal"
                        >
                            <XIcon size={20} />
                        </button>

                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Left Side - Contact Info */}
                            <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 p-8 lg:p-12 relative overflow-hidden">
                                {/* Decorative Background */}
                                <div className="absolute inset-0 opacity-10" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }}></div>

                                <div className="relative z-10">
                                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                        Get In Touch
                                    </h2>
                                    <p className="text-emerald-50 text-lg mb-8 leading-relaxed">
                                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                                <Mail className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold mb-1">Email</div>
                                                <a href="mailto:info@marketingagency.co" className="text-emerald-50 hover:text-white transition-colors">
                                                    info@marketingagency.co
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                                <Phone className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold mb-1">Phone</div>
                                                <a href="tel:+4407772452848" className="text-emerald-50 hover:text-white transition-colors">
                                                    +44 0777 245 2848
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                                <MapPin className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold mb-1">Location</div>
                                                <div className="text-emerald-50">
                                                    London, United Kingdom
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-white/20">
                                        <p className="text-emerald-50 text-sm">
                                            Our team typically responds within 24 hours during business days.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Contact Form */}
                            <div className="p-8 lg:p-12 bg-white">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h3>
                                <p className="text-slate-600 mb-8">Fill out the form below and we'll get back to you.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                         outline-none transition-all text-slate-900"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                         outline-none transition-all text-slate-900"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                         outline-none transition-all text-slate-900"
                                                placeholder="+44 7700 900000"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                         outline-none transition-all text-slate-900"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                     outline-none transition-all text-slate-900"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 
                                                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 
                                                     outline-none transition-all resize-none text-slate-900"
                                            placeholder="Tell us about your project or inquiry..."
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold
                                                     hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20
                                                     hover:shadow-xl hover:shadow-emerald-600/30 flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} />
                                            <span>Send Message</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setContactModalOpen(false)}
                                            className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold
                                                     hover:bg-slate-200 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}