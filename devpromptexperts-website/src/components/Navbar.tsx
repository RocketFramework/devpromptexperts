"use client";
import favicon from '@/app/favicon.ico';
import Image from 'next/image';

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-950 to-black text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🎯
          </span>
          <h1 className="text-2xl font-bold">DevPromptExperts</h1>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-300 transition">
            Home
          </Link>
          <Link href="/consumer" className="hover:text-blue-300 transition">
            Find Consultants
          </Link>
          <Link href="/onboarding" className="hover:text-blue-300 transition">
            Become a Consultant
          </Link>
          <Link href="/about" className="hover:text-blue-300 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-blue-300 transition">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}
