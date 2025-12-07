"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";
import { BREADCRUMB_LABELS, HIDDEN_BREADCRUMB_SEGMENTS } from "@/config/breadcrumbs";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter((segment) => segment !== "");
    
    // Filter out hidden segments (like route groups if they appear in path, though usually they don't)
    const filteredSegments = segments.filter(
      (segment) => !HIDDEN_BREADCRUMB_SEGMENTS.includes(segment)
    );

    return filteredSegments.map((segment, index) => {
      const href = `/${filteredSegments.slice(0, index + 1).join("/")}`;
      
      // Resolve label
      let label = BREADCRUMB_LABELS[segment];
      
      // Fallback for dynamic segments (UUIDs or unknown)
      if (!label) {
        // Check if it looks like a UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
        if (isUuid) {
          label = `${segment.substring(0, 8)}...`; // Truncate UUID
        } else {
          // Capitalize first letter as generic fallback
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
      }

      return {
        href,
        label,
        isLast: index === filteredSegments.length - 1,
      };
    });
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${typeof window !== "undefined" ? window.location.origin : ""}${crumb.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol role="list" className="flex items-center space-x-2">
          <li>
            <div>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {crumb.isLast ? (
                    <span
                      className="ml-2 text-sm font-medium text-gray-700"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              </li>
            </Fragment>
          ))}
        </ol>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </nav>
  );
}
