import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logos/Group.svg";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/team", label: "Team" },
        { path: "/projects", label: "Projects" },
        { path: "/news", label: "News" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
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

                    {/* CONTACT & LOGIN BUTTONS - Desktop */}
                    <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-white text-emerald-600 rounded-xl font-semibold border-2 border-emerald-600
                                     hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
                        >
                            Login
                        </Link>
                        <a
                            href="mailto:test@test.com"
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold
                                     hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20
                                     hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105"
                        >
                            Contact
                        </a>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
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
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="block w-full mt-4 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold border-2 border-emerald-600
                                     text-center hover:bg-emerald-50 transition-all duration-300"
                        >
                            Login
                        </Link>
                        <a
                            href="mailto:test@test.com"
                            onClick={() => setOpen(false)}
                            className="block w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                                     text-center hover:bg-emerald-700 transition-all duration-300"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
