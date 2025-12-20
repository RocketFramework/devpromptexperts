"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { keycompanies } from '@/data/companies';
import { blogposts } from '@/data/blogposts';
import FeaturedConsultantsCarousel from "@/components/FeaturedConsultantsCarousel";
import { HiMagnifyingGlass, HiUserPlus, HiUsers, HiBriefcase, HiTrophy, HiStar, HiArrowRight } from 'react-icons/hi2';
import { ConsultantsBusinessService } from '@/services/business/ConsultantBusinessService';
import { ConsultantDTO } from '@/types/dtos/Consultant.dto';

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
  const [featuredConsultants, setFeaturedConsultants] = useState<ConsultantDTO[]>([]);
  const [loadingConsultants, setLoadingConsultants] = useState(true);
  const randomPosts = getRandomPosts(blogposts, 3);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingConsultants(true);
        const response = await ConsultantsBusinessService.getConsultantsPaginated({
          featuredOnly: true,
          limit: 6
        });
        setFeaturedConsultants(response.consultants);
      } catch (error) {
        console.error("Error fetching featured consultants:", error);
      } finally {
        setLoadingConsultants(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-24 px-6">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
            Connect with Top <span className="text-blue-400">AI & Prompt</span> Engineering Experts
          </h1>
          <p className="text-lg md:text-xl mb-16 text-slate-400 max-w-2xl mx-auto font-medium">
            Your gateway to world-class AI consultants and developers to accelerate your business transformation.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/findconsultants" className="group">
              <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-10 rounded-3xl shadow-2xl hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 text-left flex flex-col">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <HiMagnifyingGlass className="text-3xl text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Find a Consultant</h3>
                <p className="text-slate-400 font-medium mb-8 flex-1">
                  Browse our network of verified AI experts and hire the perfect consultant for your project.
                </p>
                <div className="flex items-center text-blue-400 font-bold uppercase tracking-widest text-xs">
                  Browse Experts <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/consultant" className="group">
              <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-10 rounded-3xl shadow-2xl hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 text-left flex flex-col">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <HiUserPlus className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Become a Consultant</h3>
                <p className="text-slate-400 font-medium mb-8 flex-1">
                  Join our elite network and connect with global clients seeking your specialized AI expertise.
                </p>
                <div className="flex items-center text-purple-400 font-bold uppercase tracking-widest text-xs">
                  Join Network <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="bg-slate-50 py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">Our Global Impact</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Empowering businesses worldwide with elite AI expertise and proven results.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Link href='/sales' className="group">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <HiUsers className="text-3xl text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{keyMetrics.totalConsultants}+</div>
                <div className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Expert Consultants</div>
              </div>
            </Link>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiBriefcase className="text-3xl text-emerald-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{keyMetrics.totalCustomers}+</div>
              <div className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Happy Clients</div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiTrophy className="text-3xl text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{keyMetrics.projectsCompleted}+</div>
              <div className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Projects Completed</div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiStar className="text-3xl text-amber-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{keyMetrics.averageCSAT}+</div>
              <div className="text-slate-500 font-semibold uppercase tracking-widest text-[10px]">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Consultants */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">Featured AI Experts</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Hand-picked consultants with exceptional track records in AI and prompt engineering.</p>
          </div>
          <FeaturedConsultantsCarousel consultants={featuredConsultants} loading={loadingConsultants} />
        </div>
      </div>

      {/* Key Customers */}
      <div className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">Trusted By Leading Companies</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">We partner with innovative organizations to deliver cutting-edge AI solutions.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 justify-items-center">
            {keycompanies.map((customer, i) => (
              <Link
                key={i}
                href={customer.link || "#"}
                target="_blank"
                className="block w-full group"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md hover:border-blue-500/20 transition-all duration-300 text-center h-full">
                  <div className="mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={customer.logo}
                      alt={customer.name}
                      width={64}
                      height={64}
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                    {customer.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">Latest Insights & Guides</h2>
              <p className="text-slate-500 font-medium">Stay ahead of the curve with our expert analysis on AI trends and prompt engineering best practices.</p>
            </div>
            <Link href="/blog">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center">
                View All Posts <HiArrowRight className="ml-2" />
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {randomPosts.map(post => (
              <Link
                key={post.id}
                href={post.link || "#"}
                target="_blank"
                className="group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <HiBriefcase className="text-3xl text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                      {post.category || "Insight"}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{post.author || "DevPromptExperts"}</span>
                    <span>{post.date || "Oct 2025"}</span>
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

