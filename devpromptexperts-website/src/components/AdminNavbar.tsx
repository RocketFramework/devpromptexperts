"use client";

import { useSession, signOut } from "next-auth/react";
import  Image  from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <aside className="w-64 bg-gray-200 text-black p-4 flex flex-col h-screen">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-300 rounded-lg">
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-4 bg-gray-400 rounded w-20"></div>
              <div className="h-3 bg-gray-400 rounded w-16"></div>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2 pl-4 border-l-2 border-gray-400 flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-400 rounded animate-pulse"></div>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-200 text-black p-4 flex flex-col h-screen">
      {/* User Profile Section with Logout */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gray-300 rounded-lg">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
          )}
          {/* User Info */}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {session?.user?.name || 'Admin'}
            </span>
            <span className="text-xs text-gray-600">Administrator</span>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
          title="Logout"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </button>
      </div>

      {/* Panel Title */}
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      
      {/* Navigation */}
      <nav className="space-y-2 pl-4 border-l-2 border-gray-400 flex-1">
        <a
          href="/admin/dashboard"
          className="block hover:bg-white p-2 rounded transition"
        >
          Dashboard
        </a>
        <a
          href="/admin/users"
          className="block hover:bg-white p-2 rounded transition"
        >
          Users
        </a>
        <a
          href="/admin/consultants-onboardings"
          className="block hover:bg-white p-2 rounded transition"
        >
          Consultants
        </a>
        <a
          href="/admin/consultation-requests"
          className="block hover:bg-white p-2 rounded transition"
        >
          Consultation Requests
        </a>
        <a
          href="/admin/payments"
          className="block hover:bg-white p-2 rounded transition"
        >
          Payments
        </a>
        <a
          href="/admin/blog-management"
          className="block hover:bg-white p-2 rounded transition"
        >
          Blog Management
        </a>
      </nav>
    </aside>
  );
}