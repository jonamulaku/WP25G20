import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            role="contentinfo"
            className="bg-[#14b85a] mt-[150px] px-[120px] py-16
                       flex items-center max-md:block max-md:px-5"
        >
            {/* LOGO + SLOGAN */}
            <div className="flex items-center gap-[95px] flex-1
                            max-md:flex-col max-md:items-start max-md:gap-8">

                {/* SVG LOGO */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="121"
                    height="83"
                    viewBox="0 0 121 83"
                    fill="none"
                >
                    <path
                        d="M66.1622 82.1801H77.3922C78.7895 82.1801 79.6984 80.7153 79.0803 79.4635L41.4582 3.53363C40.7674 2.13637 38.7676 2.14157 38.0819 3.53883L0.87017 79.4687C0.257246 80.7205 1.16624 82.1801 2.55831 82.1801H46.5902C47.9874 82.1801 48.8964 80.7101 48.2731 79.4583L43.4009 69.7139C43.084 69.075 42.4295 68.675 41.7179 68.675H23.8912C22.4835 68.675 21.5745 67.1843 22.2186 65.9324L38.2689 34.8135C38.9753 33.4423 40.944 33.4578 41.6296 34.8447L64.474 81.1361C64.7909 81.775 65.4454 82.1801 66.1622 82.1801Z"
                        fill="#FBFDF7"
                    />
                </svg>

                <h1 className="text-white text-2xl font-semibold whitespace-nowrap">
                    Ready to talk growth.
                </h1>
            </div>

            {/* LINKS + CONTACT */}
            <div className="flex flex-1 justify-between items-center max-md:block mt-10">

                {/* NAV LINKS */}
                <ul className="grid grid-cols-5 gap-4 text-white
                               max-md:grid-cols-4 max-md:gap-2">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/team">Team</Link></li>
                    <li><Link to="/projects">Projects</Link></li>
                    <li><Link to="/news">News</Link></li>
                    <li><Link to="/projects">Contact</Link></li>
                </ul>

                {/* CONTACT + SOCIAL */}
                <div className="flex flex-col gap-4 max-md:mt-6 text-white">

                    <a href="tel:+4407772452848" className="max-md:hidden">
                        +44 0777 245 2848
                    </a>

                    <a href="mailto:info@marketingagency.co" className="max-md:hidden">
                        info@marketingagency.co
                    </a>

                    <div className="flex gap-4 mt-2">
                        <a href="#" aria-label="Facebook"><Facebook size={32} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={32} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={32} /></a>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm text-white/90 mb-2">
                            New to our platform?
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold
                                     transition-all duration-300 text-sm"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
