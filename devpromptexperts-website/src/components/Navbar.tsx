"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaGraduationCap, // Added for induction icon
} from "react-icons/fa";

// Navigation configuration
const getMainNavigation = (userRole: string) => {
  const baseLinks = [
    { href: "/", label: "Home" },
    { href: "/findconsultants", label: "Find Consultants" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  // Only show "Become a Consultant" for non-consultant users
  if (userRole !== "consultant") {
    baseLinks.splice(2, 0, {
      href: "/onboarding",
      label: "Become a Consultant",
    });
  }

  return baseLinks;
};

const getDashboardNavigation = (userRole: string, userId?: string) => {
  const roleBasedLinks = {
    consultant: [
      {
        name: "Dashboard",
        href: `/consultant/dashboard`,
        icon: "📊",
      },
      {
        name: "Induction", // ADDED INDUCTION LINK
        href: `/consultant/induction`,
        icon: "🎓",
      },
      {
        name: "Projects",
        href: `/consultant/dashboard/projects`,
        icon: "🚀",
      },
      {
        name: "Earnings",
        href: `/consultant/dashboard/earnings`,
        icon: "💰",
      },
      {
        name: "Network",
        href: `/consultant/dashboard/network`,
        icon: "👥",
      },
    ],
    client: [
      {
        name: "My Projects",
        href: `/client/projects`,
        icon: "📋",
      },
      {
        name: "Induction", // ADDED INDUCTION LINK
        href: `/client/induction`,
        icon: "🎓",
      },
      {
        name: "Find Consultants",
        href: `/client/consultants`,
        icon: "🔍",
      },
    ],
    seller: [
      {
        name: "Leads",
        href: `/seller/leads`,
        icon: "🎯",
      },
      {
        name: "Induction", // ADDED INDUCTION LINK
        href: `/seller/induction`,
        icon: "🎓",
      },
      {
        name: "Commissions",
        href: `/seller/commissions`,
        icon: "💸",
      },
    ],
  };

  const commonLinks = [
    {
      name: "Quick Actions",
      href: "/actions",
      icon: "⚡",
    },
  ];

  return [
    ...(roleBasedLinks[userRole as keyof typeof roleBasedLinks] || []),
    ...commonLinks,
  ];
};

// NEW: Check if user has completed induction
const hasCompletedInduction = (completedSteps: string[], totalSteps: number) => {
  return completedSteps.length >= totalSteps;
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [inductionProgress, setInductionProgress] = useState<{completed: number; total: number} | null>(null);

  const userRole = session?.user?.role || "client";
  const userId = session?.user?.id || "";

  const mainNavigation = getMainNavigation(userRole);
  const dashboardNavigation = getDashboardNavigation(userRole, userId);

  // NEW: Fetch induction progress
  useEffect(() => {
    if (session?.user?.id) {
      // You might want to fetch actual induction progress from your API
      // For now, we'll use a mock or you can integrate with your InductionService
      const fetchInductionProgress = async () => {
        try {
          // Example: Replace with actual API call
          // const progress = await InductionService.getInductionProgress(session.user.id, userRole);
          // setInductionProgress({completed: progress.completed, total: progress.total});
          
          // Mock data for demonstration
          setInductionProgress({completed: 1, total: 4});
        } catch (error) {
          console.error("Failed to fetch induction progress:", error);
        }
      };
      
      fetchInductionProgress();
    }
  }, [session, userRole]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsAuthDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    closeAllMenus();
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // NEW: Get induction badge for desktop
  const getInductionBadge = () => {
    if (!inductionProgress) return null;
    
    const { completed, total } = inductionProgress;
    const isCompleted = completed >= total;
    
    if (isCompleted) {
      return (
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2">
          ✓ Complete
        </span>
      );
    } else {
      return (
        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full ml-2">
          {completed}/{total}
        </span>
      );
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown") && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
      if (!target.closest(".auth-dropdown") && isAuthDropdownOpen) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileDropdownOpen, isAuthDropdownOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-950 to-black text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🎯</span>
            <h1 className="text-2xl font-bold">DevPromptExperts</h1>
          </div>

          {/* Desktop Navigation - Only Main Links */}
          <div className="hidden md:flex items-center space-x-6">
            {mainNavigation.map((link) => (
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
              <div className="hidden md:flex items-center">
                {/* Induction Progress Badge - NEW */}
                {inductionProgress && !hasCompletedInduction(
                  Array(inductionProgress.completed).fill('step'), 
                  inductionProgress.total
                ) && (
                  <Link 
                    href={`/${userRole}/induction`}
                    className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 px-3 py-2 rounded-lg mr-4 transition"
                  >
                    <FaGraduationCap className="text-sm" />
                    <span className="text-sm font-medium">Complete Induction</span>
                    <span className="bg-white text-amber-600 text-xs px-2 py-1 rounded-full">
                      {inductionProgress.completed}/{inductionProgress.total}
                    </span>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <div
                    className="flex items-center space-x-3 cursor-pointer hover:bg-blue-900 p-2 rounded-lg transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
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
                      <span className="text-xs text-blue-300 capitalize">
                        {userRole}
                      </span>
                    </div>
                    <FaChevronDown className="text-blue-300 text-xs" />
                  </div>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-xl z-50 border border-slate-200">
                      {/* User Info */}
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getUserInitials(session.user.name || "U")}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {session.user.name || "User"}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">
                              {userRole}
                            </p>
                            {inductionProgress && getInductionBadge()}
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Links */}
                      <div className="p-2 border-b border-slate-200">
                        <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          My Dashboard
                        </p>
                        {dashboardNavigation.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center space-x-3 px-3 py-2 text-sm hover:bg-slate-100 rounded transition"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <span className="text-base">{link.icon}</span>
                            <span>{link.name}</span>
                            {link.name === "Induction" && inductionProgress && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                inductionProgress.completed >= inductionProgress.total 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {inductionProgress.completed}/{inductionProgress.total}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Settings & Sign Out */}
                      <div className="p-2">
                        <Link
                          href="/settings"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-slate-100 rounded transition"
                          onClick={closeAllMenus}
                        >
                          <span>⚙️</span>
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition mt-2"
                        >
                          <FaSignOutAlt className="text-xs" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Not logged in - Desktop
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative auth-dropdown">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition flex items-center space-x-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAuthDropdownOpen(!isAuthDropdownOpen);
                    }}
                  >
                    <span>Sign In</span>
                    <FaChevronDown className="text-xs" />
                  </button>
                  
                  {isAuthDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-xl z-50 border border-slate-200 py-2">
                      <Link 
                        href="/auth/login/client" 
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-slate-100 transition text-sm"
                        onClick={closeAllMenus}
                      >
                        <span className="text-lg">👤</span>
                        <span className="font-medium">Client Login</span>
                      </Link>
                      <Link 
                        href="/auth/login/consultant" 
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-slate-100 transition text-sm"
                        onClick={closeAllMenus}
                      >
                        <span className="text-lg">💼</span>
                        <span className="font-medium">Consultant Login</span>
                      </Link>
                      <Link 
                        href="/auth/login/seller" 
                        className="flex items-center space-x-4 px-4 py-3 hover:bg-slate-100 transition text-sm"
                        onClick={closeAllMenus}
                      >
                        <span className="text-lg">🏪</span>
                        <span className="font-medium">Seller Login</span>
                      </Link>
                    </div>
                  )}
                </div>
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
              {/* Main Navigation Links */}
              {mainNavigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 px-4 hover:bg-blue-900 rounded-lg transition"
                  onClick={closeAllMenus}
                >
                  {link.label}
                </Link>
              ))}

              {/* Induction Progress for Mobile - NEW */}
              {session?.user && inductionProgress && !hasCompletedInduction(
                Array(inductionProgress.completed).fill('step'), 
                inductionProgress.total
              ) && (
                <Link
                  href={`/${userRole}/induction`}
                  className="flex items-center justify-between py-3 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg transition"
                  onClick={closeAllMenus}
                >
                  <div className="flex items-center space-x-3">
                    <FaGraduationCap />
                    <span className="font-medium">Complete Induction</span>
                  </div>
                  <span className="bg-white text-amber-600 text-xs px-2 py-1 rounded-full font-bold">
                    {inductionProgress.completed}/{inductionProgress.total}
                  </span>
                </Link>
              )}

              {/* AUTH LINKS FOR MOBILE */}
              {!session?.user && (
                <div className="pt-2 border-t border-blue-800">
                  <p className="px-4 py-2 text-blue-300 text-sm font-semibold uppercase">
                    Sign In As
                  </p>
                  <Link
                    href="/auth/login/client"
                    className="flex items-center space-x-3 py-3 px-4 hover:bg-blue-900 rounded-lg transition"
                    onClick={closeAllMenus}
                  >
                    <span className="text-lg">👤</span>
                    <span className="font-medium">Client</span>
                  </Link>
                  <Link
                    href="/auth/login/consultant"
                    className="flex items-center space-x-3 py-3 px-4 hover:bg-blue-900 rounded-lg transition"
                    onClick={closeAllMenus}
                  >
                    <span className="text-lg">💼</span>
                    <span className="font-medium">Consultant</span>
                  </Link>
                  <Link
                    href="/auth/login/seller"
                    className="flex items-center space-x-3 py-3 px-4 hover:bg-blue-900 rounded-lg transition"
                    onClick={closeAllMenus}
                  >
                    <span className="text-lg">🏪</span>
                    <span className="font-medium">Seller</span>
                  </Link>
                </div>
              )}

              {/* Dashboard Links for Logged-in Users */}
              {session?.user && (
                <div className="pt-2 border-t border-blue-800">
                  <p className="px-4 py-2 text-blue-300 text-sm font-semibold uppercase">
                    My Dashboard
                  </p>
                  {dashboardNavigation.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between py-2 px-4 hover:bg-blue-900 rounded-lg transition"
                      onClick={closeAllMenus}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      {link.name === "Induction" && inductionProgress && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          inductionProgress.completed >= inductionProgress.total 
                            ? 'bg-green-500 text-white' 
                            : 'bg-amber-500 text-white'
                        }`}>
                          {inductionProgress.completed}/{inductionProgress.total}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* User Section - Mobile */}
              <div className="pt-4 border-t border-blue-800">
                {status === "loading" ? (
                  <div className="flex items-center space-x-3 animate-pulse p-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-600 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ) : session?.user ? (
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
                        <p className="text-sm text-blue-300 capitalize">
                          {userRole}
                        </p>
                        {inductionProgress && (
                          <p className="text-xs text-amber-300 mt-1">
                            Induction: {inductionProgress.completed}/{inductionProgress.total}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <Link
                        href="/settings"
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-600 hover:bg-gray-700 rounded transition"
                        onClick={closeAllMenus}
                      >
                        <span>⚙️</span>
                        <span>Settings</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600 hover:bg-red-700 rounded transition"
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </div>
                ) : (
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
            onClick={closeAllMenus}
          />
        )}
      </div>
    </nav>
  );
}