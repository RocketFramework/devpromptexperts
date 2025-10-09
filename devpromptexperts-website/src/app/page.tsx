import React from 'react';
import Link from 'next/link';

// Mock data
const keyMetrics = {
  totalConsultants: 150,
  totalCustomers: 500,
  projectsCompleted: 1200,
  averageCSAT: 4.8
};

const featuredConsultants = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'AI Prompt Engineering Expert',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 4.9,
    expertise: ['GPT-4', 'Claude AI', 'Prompt Engineering'],
    availability: 'Weekends - 10 hours',
    projectsCompleted: 89
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Full-Stack AI Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rating: 4.8,
    expertise: ['React', 'Next.js', 'AI Integration'],
    availability: 'Evenings - 15 hours/week',
    projectsCompleted: 62
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Machine Learning Consultant',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.9,
    expertise: ['PyTorch', 'TensorFlow', 'MLOps'],
    availability: 'Flexible - 20 hours/week',
    projectsCompleted: 94
  }
];

const keyCustomers = [
  { name: 'TechCorp', logo: '🏢' },
  { name: 'AI Innovations', logo: '🤖' },
  { name: 'StartupHub', logo: '🚀' },
  { name: 'DataScience Co', logo: '📊' },
  { name: 'CloudTech', logo: '☁️' },
  { name: 'InnovateAI', logo: '💡' }
];

const blogPosts = [
  {
    id: '1',
    title: 'Mastering Prompt Engineering',
    excerpt: 'Learn the fundamentals of creating effective prompts for AI models.',
    author: 'Sarah Johnson',
    date: '2024-09-15',
    category: 'Tutorials'
  },
  {
    id: '2',
    title: 'AI Integration Best Practices',
    excerpt: 'How to seamlessly integrate AI into your existing applications.',
    author: 'Michael Chen',
    date: '2024-09-10',
    category: 'Best Practices'
  },
  {
    id: '3',
    title: 'The Future of AI Consulting',
    excerpt: 'Exploring emerging trends in AI consulting and development.',
    author: 'Emily Rodriguez',
    date: '2024-09-05',
    category: 'Industry Insights'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Connect with Top AI & Prompt Engineering Experts</h2>
          <p className="text-xl mb-12 text-blue-100">Your gateway to world-class AI consultants and developers</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button className="bg-white text-blue-900 p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all group">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Find a Consultant</h3>
              <p className="text-gray-700">Browse our network of verified AI experts and hire the perfect consultant for your project</p>
              <div className="text-2xl mt-4">→</div>
            </button>
            
            <button className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all group">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-3">Become a Consultant</h3>
              <p className="text-blue-50">Join our elite network and connect with clients seeking your expertise</p>
              <div className="text-2xl mt-4">→</div>
            </button>
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
          <div className="grid md:grid-cols-3 gap-8">
            {featuredConsultants.map(consultant => (
              <div key={consultant.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-500 transition cursor-pointer">
                <img src={consultant.image} alt={consultant.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="text-xl font-bold text-center mb-2">{consultant.name}</h4>
                <p className="text-gray-600 text-center mb-4 text-sm">{consultant.title}</p>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="ml-2 font-semibold">{consultant.rating}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {consultant.expertise.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                  <span className="mr-2">🕐</span>
                  {consultant.availability}
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  {consultant.projectsCompleted} projects completed
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center">
              View All Consultants
              <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Customers */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Trusted By Leading Companies</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {keyCustomers.map((customer, i) => (
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
            {blogPosts.map(post => (
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