import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    Shield,
    CheckCircle2
} from "lucide-react";
import Logo from "../assets/logos/Group.svg";
import { authAPI } from "../services/api";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one digit";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await authAPI.login(formData.email, formData.password);
                console.log('Login successful:', response);
                
                // Small delay to ensure state is updated
                setTimeout(() => {
                    // Redirect based on user role
                    const user = authAPI.getCurrentUser();
                    if (user && user.roles) {
                        if (user.roles.includes('Client')) {
                            navigate("/client-dashboard");
                        } else if (user.roles.includes('Admin')) {
                            navigate("/dashboard");
                        } else {
                            navigate("/");
                        }
                    } else {
                        navigate("/");
                    }
                }, 100);
            } catch (error) {
                console.error('Login error:', error);
                setSubmitError(error.message || "Invalid email or password. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
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
                                Welcome Back
                            </h1>
                            <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                                Sign in to access your marketing agency dashboard and manage your campaigns, clients, and projects.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Shield className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Secure Access</div>
                                        <div className="text-emerald-50 text-sm">
                                            Your data is protected with enterprise-grade security
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Powerful Tools</div>
                                        <div className="text-emerald-50 text-sm">
                                            Manage all your marketing activities from one place
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-emerald-50 text-sm">
                                <CheckCircle2 size={16} />
                                <span>Trusted by 55+ agencies worldwide</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
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
                                Welcome Back
                            </h1>
                            <p className="text-slate-600">
                                Sign in to your account
                            </p>
                        </div>

                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 hidden lg:block">
                                    Sign In
                                </h2>
                                <p className="text-slate-600 hidden lg:block">
                                    Enter your credentials to access your account
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Email Address
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

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Password
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
                                            placeholder="Enter your password"
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
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                                        />
                                        <span className="text-sm text-slate-600">Remember me</span>
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Error */}
                                {submitError && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm text-red-600">{submitError}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold
                                             hover:bg-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-600/20
                                             hover:shadow-xl hover:shadow-emerald-600/30 flex items-center justify-center gap-2
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-slate-600">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/signup"
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-sm text-slate-500">or</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {/* Social Login (Optional) */}
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
                                    <span>Continue with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
