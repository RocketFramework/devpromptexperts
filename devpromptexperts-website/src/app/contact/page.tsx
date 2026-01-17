"use client";

import React, { useState } from "react";
import { HiEnvelope, HiMapPin, HiPhone } from "react-icons/hi2";
import { sendContactEmail } from "./actions";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const result = await sendContactEmail(formData);
            setSubmitStatus(result);
            if (result.success) {
                // Optional: Reset form here if needed, but managing FormData reset with server actions logic usually requires useRef or controlled inputs.
                // For simplicity, we'll leave it or user can reload.
                const form = document.querySelector('form') as HTMLFormElement;
                form?.reset();
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus({ success: false, message: "Something went wrong. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6">Contact Us</h2>
                    <p className="text-xl text-blue-100 leading-relaxed">
                        Have questions? We&#39;d love to hear from you. Send us a message and we&#39;ll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-6">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                Whether you&#39;re looking for expert AI consultants or want to join our network, our team is here to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <HiEnvelope className="text-2xl text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">Email Us</h4>
                                    <p className="text-slate-500 mb-2">Our friendly team is here to help.</p>
                                    <a href="mailto:support@devpromptexperts.com" className="text-blue-600 font-semibold hover:text-blue-700">
                                        support@devpromptexperts.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <HiMapPin className="text-2xl text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">Office</h4>
                                    <p className="text-slate-500 mb-2">Come say hello at our office headquarters.</p>
                                    <p className="text-slate-900 font-medium">
                                        100 Innovation Drive<br />
                                        San Francisco, CA 94105
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <HiPhone className="text-2xl text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">Phone</h4>
                                    <p className="text-slate-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                                    <a href="tel:+15550000000" className="text-blue-600 font-semibold hover:text-blue-700">
                                        +1 (555) 000-0000
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 outline-none resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>

                            {submitStatus && (
                                <div className={`p-4 rounded-xl text-sm font-semibold text-center ${submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {submitStatus.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
