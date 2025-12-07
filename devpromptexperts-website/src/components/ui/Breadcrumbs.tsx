"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  BREADCRUMB_LABELS,
  HIDDEN_BREADCRUMB_SEGMENTS,
  NON_NAVIGABLE_SEGMENTS,
} from "@/config/breadcrumbs";
import { ChevronRightIcon, HomeIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { resolveBreadcrumbLabel } from "@/app/actions/breadcrumbs";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});

  const segments = useMemo(() => {
    if (!pathname || pathname === "/") return [];
    return pathname.split("/").filter((segment) => segment !== "");
  }, [pathname]);

  const filteredSegments = useMemo(() => {
    return segments.filter(
      (segment) => !HIDDEN_BREADCRUMB_SEGMENTS.includes(segment)
    );
  }, [segments]);

  // Effect to resolve dynamic labels
  useEffect(() => {
    const resolveLabels = async () => {
      const newLabels: Record<string, string> = {};
      let needsUpdate = false;

      for (let i = 0; i < filteredSegments.length; i++) {
        const segment = filteredSegments[i];
        
        // Skip if already resolved or static
        if (resolvedLabels[segment] || BREADCRUMB_LABELS[segment]) continue;

        // Check if it looks like a UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
        
        if (isUuid) {
          // Determine type based on previous segment or context
          const prevSegment = i > 0 ? filteredSegments[i - 1] : null;
          let type = "";
          
          if (prevSegment === "client") type = "client";
          else if (prevSegment === "rfp") type = "rfp";

          if (type) {
            const label = await resolveBreadcrumbLabel(segment, type);
            if (label) {
              newLabels[segment] = label;
              needsUpdate = true;
            }
          }
        }
      }

      if (needsUpdate) {
        setResolvedLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    resolveLabels();
  }, [filteredSegments, resolvedLabels]);

  const breadcrumbs = useMemo(() => {
    return filteredSegments.map((segment, index) => {
      const href = `/${filteredSegments.slice(0, index + 1).join("/")}`;
      
      // Resolve label priority: Resolved Dynamic -> Static Config -> Formatted Fallback
      let label = resolvedLabels[segment] || BREADCRUMB_LABELS[segment];
      
      if (!label) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
        if (isUuid) {
          label = `${segment.substring(0, 8)}...`;
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
      }

      let isNavigable = !NON_NAVIGABLE_SEGMENTS.includes(segment);

      const prevSegment = index > 0 ? filteredSegments[index - 1] : null;
      if (prevSegment === "client" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
        isNavigable = false;
      }

      return {
        href,
        label,
        isLast: index === filteredSegments.length - 1,
        isNavigable,
      };
    });
  }, [filteredSegments, resolvedLabels]);

  if (breadcrumbs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.isNavigable ? `${typeof window !== "undefined" ? window.location.origin : ""}${crumb.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mr-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

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
                    {crumb.isLast || !crumb.isNavigable ? (
                      <span
                        className={`ml-2 text-sm font-medium ${crumb.isLast ? "text-gray-700" : "text-gray-400"}`}
                        aria-current={crumb.isLast ? "page" : undefined}
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
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </nav>
  );
}
