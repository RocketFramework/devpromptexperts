import React from "react";
import Link from 'next/link';
import { featuredConsultants } from '@/data/consultants';
import { keycustomers } from '@/data/customers';
import { blogposts } from '@/data/blogposts';
import FeaturedConsultantsCarousel from "@/components/FeaturedConsultantsCarousel";

// Mock data
const keyMetrics = {
  totalConsultants: 150,
  totalCustomers: 500,
  projectsCompleted: 1200,
  averageCSAT: 4.8
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white py-20 px-6">
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
              <button className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all group">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-2xl font-bold mb-3">Become a Consultant</h3>
                <p className="text-blue-50">Join our elite network and connect with clients seeking your expertise</p>
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
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">👥</div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{keyMetrics.totalConsultants}+</div>
              <div className="text-gray-600">Expert Consultants</div>
            </div>
            
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
          {/* ...rest of section... */}
        </div>
      </div>

      {/* Key Customers */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Trusted By Leading Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {keycustomers.map((customer, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-xl transition">
                <div className="text-5xl mb-3">{customer.logo}</div>
                <div className="text-sm font-semibold text-gray-700 text-center">{customer.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">Latest Insights & Guides</h3>
            <button className="text-blue-600 hover:text-blue-800 inline-flex items-center">
              View All <span className="ml-2">→</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogposts.map(post => (
              <div key={post.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-500 transition cursor-pointer">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 flex items-center justify-center text-6xl">
                  📝
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                  <h4 className="text-xl font-bold mb-3">{post.title}</h4>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}