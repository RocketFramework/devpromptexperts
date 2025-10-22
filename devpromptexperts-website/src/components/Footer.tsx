"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
        <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl">🎯</span>
            <h3 className="text-xl font-bold">DevPromptExperts</h3>
        </div>
        <p className="text-gray-400">Connecting businesses with top AI consultants worldwide.</p>
        </div>
        
        <div>
        <h4 className="font-bold mb-4">For Clients</h4>
        <div className="space-y-2">
            <Link href="/sales">
                <div className="text-gray-400 hover:text-white cursor-pointer">Find Consultants</div>
            </Link>
            <div className="text-gray-400 hover:text-white cursor-pointer">How It Works</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Pricing</div>
        </div>
        </div>
        
        <div>
        <h4 className="font-bold mb-4">For Consultants</h4>
        <div className="space-y-2">
            <Link href="/onboarding">
                <div className="text-gray-400 hover:text-white cursor-pointer">Join Network</div>
            </Link>
            <div className="text-gray-400 hover:text-white cursor-pointer">Benefits</div>
            <div className="text-gray-400 hover:text-white cursor-pointer">Resources</div>
        </div>
        </div>
        
        <div>
        <h4 className="font-bold mb-4">Company</h4>
        <div className="space-y-2">
            <Link href="/about">
                <div className="text-gray-400 hover:text-white cursor-pointer">About Us</div>
            </Link>
            <Link href="/blog">
                <div className="text-gray-400 hover:text-white cursor-pointer">Blog</div>
            </Link>
            <div className="text-gray-400 hover:text-white cursor-pointer">Contact</div>
        </div>
        </div>
    </div>

    <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2024 DevPromptExperts. All rights reserved.</p>
    </div>
    </footer>
  );
}