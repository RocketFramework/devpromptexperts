import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We maintain the highest standards in vetting consultants and ensuring quality deliverables for every project.'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building lasting relationships through transparency, reliability, and consistent results.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Staying at the forefront of AI technology to provide cutting-edge solutions to our clients.'
    },
    {
      icon: '🌟',
      title: 'Growth',
      description: 'Empowering both consultants and clients to achieve their full potential through collaboration.'
    }
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: '15+ years in AI and software development. Previously led AI initiatives at Fortune 500 companies.'
    },
    {
      name: 'Maria Garcia',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Expert in building and scaling marketplace platforms. Former consultant at McKinsey.'
    },
    {
      name: 'David Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'MIT graduate specializing in machine learning and distributed systems. Published researcher.'
    },
    {
      name: 'Sarah Williams',
      role: 'Head of Consultant Relations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Passionate about connecting talent with opportunities. 10+ years in recruitment and talent management.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'DevPromptExperts Founded', description: 'Started with a vision to connect AI experts with businesses' },
    { year: '2021', event: '50 Consultants Milestone', description: 'Reached our first major consultant network milestone' },
    { year: '2022', event: '500 Projects Completed', description: 'Delivered half a thousand successful AI projects' },
    { year: '2023', event: 'Global Expansion', description: 'Expanded operations to serve clients in 25+ countries' },
    { year: '2024', event: '150+ Expert Network', description: 'Built a thriving community of elite AI consultants' }
  ];

  const stats = [
    { number: '150+', label: 'Expert Consultants', icon: '👥', page: '/sales' },
    { number: '500+', label: 'Happy Clients', icon: '😊', page: '/client' },
    { number: '1,200+', label: 'Projects Delivered', icon: '✅', page: '/projects'  },
    { number: '4.8/5', label: 'Average Rating', icon: '⭐', page: '/rating'  },
    { number: '95%', label: 'Client Retention', icon: '🔄', page: '/retention'  },
    { number: '25+', label: 'Countries Served', icon: '🌍', page: '/servings'  }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">About DevPromptExperts</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            We&#39;re on a mission to democratize access to world-class AI expertise, connecting innovative businesses with the brightest minds in artificial intelligence and prompt engineering.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To bridge the gap between innovative businesses and top-tier AI consultants, enabling organizations of all sizes to harness the transformative power of artificial intelligence. We believe every company deserves access to world-class AI expertise.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
            <div className="text-5xl mb-4">🔮</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the global leading platform where AI innovation meets business needs, fostering a thriving community of experts and creating meaningful impact through technology. We envision a future where AI expertise is accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Impact in Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <Link
                key={index}
                href={stat.page || "#"} // <-- use stat.page, not stats.page
                className="block bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h3>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            DevPromptExperts was born from a simple observation: as AI technology rapidly advanced, businesses struggled to find qualified experts who could help them leverage these powerful new tools effectively.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            Founded in 2020 by a team of AI practitioners and business leaders, we set out to create a platform that would solve this challenge. We carefully vet each consultant in our network, ensuring they possess not just technical expertise, but also the communication skills and business acumen needed to deliver real results.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Today, we&#39;re proud to have facilitated over 1,200 successful projects, connecting businesses with the perfect AI experts for their unique challenges. Our community continues to grow, bringing together the brightest minds in AI to drive innovation forward.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Our Journey</h3>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition">
                <div className="flex-shrink-0 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                </div>
                <div className="flex-1 text-white">
                  <h4 className="text-xl font-bold mb-2">{milestone.event}</h4>
                  <p className="text-blue-100">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Core Values</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:shadow-xl hover:border-blue-500 transition">
              <div className="text-5xl mb-4">{value.icon}</div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-800">Meet Our Team</h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our leadership team brings decades of combined experience in AI, technology, and business to help you succeed.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h4>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose DevPromptExperts?</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Rigorous Vetting Process</h4>
              <p className="text-gray-600">Every consultant undergoes thorough technical assessments and background checks to ensure top quality.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Perfect Matching</h4>
              <p className="text-gray-600">Our AI-powered matching system connects you with consultants who perfectly fit your project needs.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              💼
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Project Management Support</h4>
              <p className="text-gray-600">Dedicated support throughout your project lifecycle to ensure smooth collaboration and success.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Satisfaction Guarantee</h4>
              <p className="text-gray-600">We stand behind our consultants with a satisfaction guarantee on every project engagement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Business with AI?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies who trust DevPromptExperts to connect them with the best AI talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105">
              Find a Consultant
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition transform hover:scale-105">
              Become a Consultant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}