  // About Page
  const AboutPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">About DevPromptExperts</h2>
          <p className="text-xl text-blue-100">Connecting world-class AI experts with businesses that need them</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            DevPromptExperts is dedicated to bridging the gap between innovative businesses and top-tier AI consultants. We believe that every organization should have access to world-class AI expertise to transform their operations and unlock new possibilities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform carefully vets each consultant to ensure they meet our high standards of technical excellence, professionalism, and communication skills. We're not just a marketplace - we're a community of experts committed to advancing AI adoption worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">For Businesses</h3>
            <p className="text-gray-700">
              Find pre-vetted AI experts who can deliver results. From prompt engineering to full-scale AI integration, our consultants have the skills you need.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">For Consultants</h3>
            <p className="text-gray-700">
              Join a thriving network of AI professionals. Connect with clients who value your expertise and work on projects that challenge and inspire you.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Award className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Verified Experts</h4>
                <p className="text-blue-100 text-sm">All consultants are thoroughly vetted for skills and experience</p>
              </div>
            </div>
            <div className="flex items-start">
              <TrendingUp className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Quality Assurance</h4>
                <p className="text-blue-100 text-sm">Client satisfaction guaranteed with our rating system</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Fast Matching</h4>
                <p className="text-blue-100 text-sm">Find the right consultant for your project quickly</p>
              </div>
            </div>
            <div className="flex items-start">
              <Target className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Project Success</h4>
                <p className="text-blue-100 text-sm">Dedicated support to ensure project completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  export default AboutPage();