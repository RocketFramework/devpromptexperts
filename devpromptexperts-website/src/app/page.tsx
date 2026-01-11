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
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight">
            Connect with Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI & Prompt</span> Engineering Experts
          </h1>
          <p className="text-xl md:text-2xl mb-16 text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Your gateway to world-class AI consultants and developers to accelerate your business transformation.
          </p>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <Link href="/findconsultants" className="group">
              <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-10 rounded-[2rem] shadow-2xl hover:bg-slate-800/80 hover:border-blue-500/50 hover:shadow-blue-900/20 transition-all duration-300 text-left flex flex-col">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                  <HiMagnifyingGlass className="text-4xl text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors">Find a Consultant</h3>
                <p className="text-lg text-slate-400 font-medium mb-8 flex-1 leading-relaxed">
                  Browse our network of verified AI experts and hire the perfect consultant for your project.
                </p>
                <div className="flex items-center text-blue-400 font-bold uppercase tracking-widest text-sm">
                  Browse Experts <HiArrowRight className="ml-3 text-lg group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/consultant" className="group">
              <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-10 rounded-[2rem] shadow-2xl hover:bg-slate-800/80 hover:border-purple-500/50 hover:shadow-purple-900/20 transition-all duration-300 text-left flex flex-col">
                <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                  <HiUserPlus className="text-4xl text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">Become a Consultant</h3>
                <p className="text-lg text-slate-400 font-medium mb-8 flex-1 leading-relaxed">
                  Join our elite network and connect with global clients seeking your specialized AI expertise.
                </p>
                <div className="flex items-center text-purple-400 font-bold uppercase tracking-widest text-sm">
                  Join Network <HiArrowRight className="ml-3 text-lg group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Consultants - SPOTLIGHT SECTION */}
      <div className="relative py-32 px-6 bg-slate-900 overflow-hidden">
        {/* Decorative background effects for Spotlight feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-3xl">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3 block">World-Class Talent</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                Featured AI Experts
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                Work with the industry's top 1% of AI and prompt engineering professionals, vetted for their expertise and proven track record.
              </p>
            </div>
            <Link href="/findconsultants" className="hidden md:block">
              <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-blue-50 transition-all duration-300">
                View All Experts
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <HiArrowRight className="w-4 h-4 text-slate-900" />
                </div>
              </button>
            </Link>
          </div>

          <FeaturedConsultantsCarousel consultants={featuredConsultants} loading={loadingConsultants} />

          <div className="mt-12 text-center md:hidden">
            <Link href="/findconsultants">
              <button className="group inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                View All Experts <HiArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="bg-slate-50 py-32 px-6 relative overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Our Global Impact</h2>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">Empowering businesses worldwide with elite AI expertise and proven results.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Link href='/sales' className="group">
              <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <HiUsers className="text-4xl text-blue-600" />
                </div>
                <div className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">{keyMetrics.totalConsultants}+</div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Expert Consultants</div>
              </div>
            </Link>

            <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiBriefcase className="text-4xl text-emerald-600" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">{keyMetrics.totalCustomers}+</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Happy Clients</div>
            </div>

            <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiTrophy className="text-4xl text-purple-600" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">{keyMetrics.projectsCompleted}+</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Projects Completed</div>
            </div>

            <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 text-center hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <HiStar className="text-4xl text-amber-600" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-2 tracking-tight">{keyMetrics.averageCSAT}+</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Customers */}
      <div className="bg-slate-50 py-32 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Trusted By Leading Companies</h2>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">We partner with innovative organizations to deliver cutting-edge AI solutions.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 justify-items-center">
            {keycompanies.map((customer, i) => (
              <Link
                key={i}
                href={customer.link || "#"}
                target="_blank"
                className="block w-full group"
              >
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-lg hover:border-blue-500/20 transition-all duration-300 text-center h-full">
                  <div className="mb-6 w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={customer.logo}
                      alt={customer.name}
                      width={80}
                      height={80}
                      className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                    {customer.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Latest Insights & Guides</h2>
              <p className="text-xl text-slate-500 font-medium">Stay ahead of the curve with our expert analysis on AI trends and prompt engineering best practices.</p>
            </div>
            <Link href="/blog">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-all duration-200 shadow-xl shadow-slate-200 active:scale-95 flex items-center group">
                View All Posts <HiArrowRight className="ml-2 text-lg group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {randomPosts.map(post => (
              <Link
                key={post.id}
                href={post.link || "#"}
                target="_blank"
                className="group flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HiBriefcase className="text-4xl text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-xl uppercase tracking-wider shadow-sm">
                      {post.category || "Insight"}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-slate-500 text-base mb-8 line-clamp-2 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
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
