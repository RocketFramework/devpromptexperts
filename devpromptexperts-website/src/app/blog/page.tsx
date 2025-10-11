import { blogposts, gradients } from '@/data/blogposts';
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-300 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">DevPromptExperts Blog</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Stay ahead with expert advice, trends, and tips in AI and prompt engineering.
          </p>
        </div>
      </div>

      {/* Latest Insights & Guides */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">Latest Insights & Guides</h3>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {blogposts.map((post, index) => (
              <a
                key={post.id}
                href={post.link || "#"}          // Use the individual post link
                target="_blank"                  // Opens in a new tab
                rel="noopener noreferrer"        // Security best practice
                className="block"
              >
                <div
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-500 transition cursor-pointer"
                >
                  {/* Icon / Image */}
                  <div
                    className={`bg-gradient-to-r ${gradients[index % gradients.length]} h-48 flex items-center justify-center text-6xl`}
                  >
                    📝
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="text-sm text-blue-600 mb-2">{post.category || "Blog"}</div>
                    <h4 className="text-xl font-bold mb-3">{post.title}</h4>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.author || "DevPromptExperts"}</span>
                      <span>{post.date || "2025-10-11"}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}
