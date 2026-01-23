import { useState } from "react";
import { Link } from "react-router-dom";
import { messagesAPI } from "../services/api";
import {
    Mail,
    User,
    MessageSquare,
    ArrowRight,
    Sparkles,
    Shield,
    CheckCircle2,
    Phone,
    MapPin
} from "lucide-react";
import Logo from "../assets/logos/Group.svg";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

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

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.trim().length < 3) {
            newErrors.subject = "Subject must be at least 3 characters";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitSuccess(false);
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                await messagesAPI.create({
                    subject: formData.subject,
                    content: formData.message,
                    type: "ContactForm",
                    senderName: formData.name,
                    senderEmail: formData.email
                });
                
                setSubmitSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
                
                // Reset success message after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } catch (error) {
                console.error('Error submitting contact form:', error);
                setErrors({ submit: error.message || "Failed to send message. Please try again." });
            } finally {
                setIsLoading(false);
            }
        }
    };

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
                                Get In Touch
                            </h1>
                            <p className="text-emerald-50 text-lg leading-relaxed mb-8">
                                Have a question or want to discuss your marketing needs? We're here to help. Send us a message and we'll get back to you as soon as possible.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Mail className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Email Us</div>
                                        <div className="text-emerald-50 text-sm">
                                            info@marketingagency.com
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <Phone className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Call Us</div>
                                        <div className="text-emerald-50 text-sm">
                                            +1 (555) 123-4567
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <MapPin className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold mb-1">Visit Us</div>
                                        <div className="text-emerald-50 text-sm">
                                            123 Marketing Street, Business City, BC 12345
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-emerald-50 text-sm">
                                <CheckCircle2 size={16} />
                                <span>We typically respond within 24 hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
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
                                Get In Touch
                            </h1>
                            <p className="text-slate-600">
                                Send us a message and we'll get back to you
                            </p>
                        </div>

                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 hidden lg:block">
                                    Contact Us
                                </h2>
                                <p className="text-slate-600 hidden lg:block">
                                    Fill out the form below and we'll respond as soon as possible
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.name 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
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

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Subject *
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900
                                                ${errors.subject 
                                                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                }`}
                                            placeholder="What is this regarding?"
                                        />
                                    </div>
                                    {errors.subject && (
                                        <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none text-slate-900 resize-none
                                            ${errors.message 
                                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                                                : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                            }`}
                                        placeholder="Tell us about your project or question..."
                                    />
                                    {errors.message && (
                                        <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm text-red-600">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Success */}
                                {submitSuccess && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                        <p className="text-sm text-emerald-600">
                                            Thank you! Your message has been sent successfully. We'll get back to you soon.
                                        </p>
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
                                    <span>{isLoading ? "Sending..." : "Send Message"}</span>
                                    {!isLoading && <ArrowRight size={18} />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
