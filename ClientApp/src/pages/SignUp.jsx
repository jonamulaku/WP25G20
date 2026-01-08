import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Building2,
    Phone,
    ArrowRight,
    Sparkles,
    Shield,
    CheckCircle2,
    Check
} from "lucide-react";
import Logo from "../assets/logos/Group.svg";

export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = "Full name must be at least 2 characters";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = "Phone number is invalid";
        }

        if (!formData.company.trim()) {
            newErrors.company = "Company name is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain uppercase, lowercase, and number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Handle signup logic here
            console.log("Signup attempt:", formData);
            // In real app, you would make an API call here
            alert("Account created successfully! Redirecting to login...");
            navigate("/login");
        }
    };

    const passwordRequirements = [
        { text: "At least 8 characters", met: formData.password.length >= 8 },
        { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
        { text: "One lowercase letter", met: /[a-z]/.test(formData.password) },
        { text: "One number", met: /\d/.test(formData.password) }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    {/* Left Side - Branding */}
                    <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 p-8 lg:p-12 relative overflow-hidden hidden lg:flex flex-col justify-between">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>

                        <div className="relative z-10">
                            <Link to="/" className="inline-block mb-8">
                                <img
                                    src={Logo}
                                    alt="logo"
                                    className="h-12 brightness-0 invert"
                                />
                            </Link>

                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                Join Us Today
                            </h1>
                            <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                                Create your account and start managing your marketing agency with powerful tools and insights.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Free Trial</div>
                                        <div className="text-emerald-50 text-sm">
                                            Start with a 14-day free trial, no credit card required
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Shield className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Secure & Private</div>
                                        <div className="text-emerald-50 text-sm">
                                            Your data is encrypted and protected with industry-leading security
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-emerald-50 text-sm">
                                <CheckCircle2 size={16} />
                                <span>Join 55+ agencies already using our platform</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign Up Form */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="lg:hidden mb-8">
                            <Link to="/" className="inline-block mb-6">
                                <img
                                    src={Logo}
                                    alt="logo"
                                    className="h-10"
                                />
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Create Account
                            </h1>
                            <p className="text-slate-600">
                                Sign up to get started
                            </p>
                        </div>

                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 hidden lg:block">
                                    Create Account
                                </h2>
                                <p className="text-slate-600 hidden lg:block">
                                    Fill in your details to create your account
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name Field */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.fullName 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.email 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.phone 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="+44 7700 900000"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Company Field */}
                                <div>
                                    <label htmlFor="company" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Company Name *
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.company 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="Your Company Ltd"
                                        />
                                    </div>
                                    {errors.company && (
                                        <p className="mt-2 text-sm text-red-600">{errors.company}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.password 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                    
                                    {/* Password Requirements */}
                                    {formData.password && (
                                        <div className="mt-3 p-4 bg-slate-50 rounded-xl space-y-2">
                                            <div className="text-xs font-semibold text-slate-700 mb-2">Password requirements:</div>
                                            {passwordRequirements.map((req, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? "bg-emerald-500" : "bg-slate-300"}`}>
                                                        {req.met && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <span className={req.met ? "text-emerald-700" : "text-slate-600"}>{req.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.confirmPassword 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                                        />
                                        <span className="text-sm text-slate-600">
                                            I agree to the{" "}
                                            <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                                Terms and Conditions
                                            </Link>
                                            {" "}and{" "}
                                            <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                                Privacy Policy
                                            </Link>
                                        </span>
                                    </label>
                                    {errors.agreeToTerms && (
                                        <p className="mt-2 text-sm text-red-600">{errors.agreeToTerms}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold
                                             hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20
                                             hover:shadow-xl hover:shadow-emerald-600/30 flex items-center justify-center gap-2 mt-6"
                                >
                                    <span>Create Account</span>
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-8 text-center">
                                <p className="text-slate-600">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-sm text-slate-500">or</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {/* Social Sign Up (Optional) */}
                            <div className="mt-6 space-y-3">
                                <button
                                    type="button"
                                    className="w-full px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold
                                             hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Sign up with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
