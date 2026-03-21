'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Usage', path: '/admin/usage' },
    { name: 'Consultations', path: '/admin/consultations' },
    { name: 'Account', path: '/admin/account' },
    { name: 'Review', path: '/admin/review' },
    { name: 'Security', path: '/admin/security' },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-white p-4 px-6 border-b border-gray-200">
      {/* Left side - Logo and Navigation */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 text-gray-600">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${isActive(item.path)
                ? 'font-medium text-blue-600 border-b-2 border-blue-600 pb-1'
                : 'hover:text-gray-900 cursor-pointer transition'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side - User Menu */}
      <div className="flex items-center gap-4">
        <Link href="/admin/profile" className="w-10 h-10 bg-sky-800 rounded-full flex items-center justify-center text-white font-semibold hover:bg-sky-700 transition">
          JD
        </Link>
      </div>
    </div>
  );
}