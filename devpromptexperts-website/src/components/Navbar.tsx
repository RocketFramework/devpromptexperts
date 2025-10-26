"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    closeMobileMenu();
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/findconsultants", label: "Find Consultants" },
    { href: "/onboarding", label: "Become a Consultant" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-black text-white p-4 shadow-lg relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl">🎯</span>
          <h1 className="text-2xl font-bold">DevPromptExperts</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-blue-300 transition duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Section & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {/* User Profile - Desktop */}
          {status === "loading" ? (
            // Loading state
            <div className="hidden md:flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div className="hidden lg:flex flex-col">
                <div className="h-4 w-20 bg-gray-600 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-600 rounded"></div>
              </div>
            </div>
          ) : session?.user ? (
            // Logged-in user - Desktop
            <div className="hidden md:flex items-center space-x-3 relative">
              <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-blue-900 p-2 rounded-lg transition"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                )}
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium">
                    {session.user.name || "User"}
                  </span>
                  <span className="text-xs text-blue-300">
                    {session.user.role || "Member"}
                  </span>
                </div>
                <FaChevronDown className="text-blue-300 text-xs" />
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-sm">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-sm hover:bg-gray-100 rounded transition"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-sm hover:bg-gray-100 rounded transition"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not logged in - Desktop (No auth links)
            <div className="hidden md:flex items-center space-x-4">
              {/* No login/register links as requested */}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-900 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-950 to-black border-t border-blue-800 shadow-lg z-40">
          <div className="p-4 space-y-4">
            {/* Navigation Links */}
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-4 hover:bg-blue-900 rounded-lg transition"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            {/* User Section - Mobile */}
            <div className="pt-4 border-t border-blue-800">
              {status === "loading" ? (
                // Loading state
                <div className="flex items-center space-x-3 animate-pulse p-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                  </div>
                </div>
              ) : session?.user ? (
                // Logged-in user - Mobile
                <div className="p-4 bg-blue-900 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-sm text-blue-300">
                        {session.user.role || "Member"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block py-2 px-3 bg-blue-800 hover:bg-blue-700 rounded transition text-center"
                      onClick={closeMobileMenu}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2 px-3 bg-blue-800 hover:bg-blue-700 rounded transition text-center"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600 hover:bg-red-700 rounded transition"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                // Not logged in - Mobile (No auth links)
                <div className="text-center py-4 text-blue-300 text-sm">
                  Welcome to DevPromptExperts
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </nav>
  );
}