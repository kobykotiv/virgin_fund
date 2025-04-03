"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNav = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
      },
      {
        title: "Getting Started",
        href: "/docs/getting-started",
      },
      {
        title: "Project Structure",
        href: "/docs/project-structure",
      },
      {
        title: "Deployment",
        href: "/docs/deployment",
      },
    ],
  },
  {
    title: "Portfolio Management",
    items: [
      {
        title: "Portfolio Overview",
        href: "/docs/portfolio-management",
      },
      {
        title: "Portfolio Models",
        href: "/docs/portfolio-models",
      },
      {
        title: "User Portfolio System",
        href: "/docs/user-portfolio-system",
      },
      {
        title: "Asset Holdings",
        href: "/docs/asset-holdings",
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        title: "API Routes",
        href: "/docs/api-routes",
      },
      {
        title: "API Documentation",
        href: "/docs/api-documentation-mvp",
      },
      {
        title: "API Access",
        href: "/docs/api-access",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        title: "Monitoring",
        href: "/docs/monitoring",
      },
      {
        title: "Implementation Guide",
        href: "/docs/implementation-guide",
      },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {sidebarNav.map((group, groupIndex) => (
        <div key={groupIndex} className="pb-8">
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {group.title}
          </h4>
          <div className="grid grid-flow-row auto-rows-max text-sm">
            {group.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                href={item.href}
                className={cn(
                  "flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                  item.href === pathname
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
