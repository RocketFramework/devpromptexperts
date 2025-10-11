import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { featuredConsultants } from '@/data/consultants';
import { keycompanies } from '@/data/companies';
import { blogposts } from '@/data/blogposts';
import FeaturedConsultantsCarousel from "@/components/FeaturedConsultantsCarousel";

// Mock data
const keyMetrics = {
  totalConsultants: 150,
  totalCustomers: 500,
  projectsCompleted: 1200,
  averageCSAT: 4.8
};

// Helper to pick N random unique blog posts
function getRandomPosts(posts: typeof blogposts, count: number) {
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface Customer {
  name: string;
  logo: string;
  link?: string;
}


export default function HomePage() {
  const randomPosts = getRandomPosts(blogposts, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-black to-blue-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Connect with Top AI & Prompt Engineering Experts</h2>
          <p className="text-xl mb-12 text-blue-100">Your gateway to world-class AI consultants and developers</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/consumer">
              <button className="bg-white text-blue-900 p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all group">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3">Find a Consultant</h3>
                <p className="text-gray-700">Browse our network of verified AI experts and hire the perfect consultant for your project</p>
                <div className="text-2xl mt-4">→</div>
              </button>
            </Link>
            <Link href="/onboarding">
              <button className="bg-gradient-to-br from-white to-gray-500 text-black p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all group">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-2xl font-bold mb-3">Become a Consultant</h3>
                <p className="text-black">Join our elite network and connect with clients seeking your expertise</p>
                <div className="text-2xl mt-4">→</div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Impact</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <Link href='/consumer'>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
                <div className="text-5xl mb-4">👥</div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{keyMetrics.totalConsultants}+</div>
                <div className="text-gray-600">Expert Consultants</div>
              </div>
            </Link>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">💼</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{keyMetrics.totalCustomers}+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">🏆</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{keyMetrics.projectsCompleted}+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">⭐</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{keyMetrics.averageCSAT}+</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Consultants */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Consultants</h3>
          <FeaturedConsultantsCarousel />
        </div>
      </div>

      {/* Key Customers */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Trusted By Leading Companies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 justify-items-center">
            {keycompanies.map((customer, i) => (
              <Link
                key={i}
                href={customer.link || "#"}
                target="_blank"
                className="block w-full"
              >
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-xl transition text-center">
                  <div className="mb-3">
                    <Image
                      src={customer.logo}
                      alt={customer.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {customer.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">Latest Insights & Guides</h3>
            <Link href="/blog">
              <button className="text-gray-600 hover:text-blue-700 inline-flex items-center">
                View All <span className="ml-2">→</span>
              </button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {randomPosts.map(post => (
              <Link
                key={post.id}
                href={post.link || "#"}
                target="_blank"           
                className="block border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-500 transition cursor-pointer"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 flex items-center justify-center text-6xl">
                  📝
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{post.category || "Blog"}</div>
                  <h4 className="text-xl font-bold mb-3">{post.title}</h4>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author || "DevPromptExperts"}</span>
                    <span>{post.date || "2025-10-11"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
