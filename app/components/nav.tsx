'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement } from 'react';
import { IoMdDownload } from "react-icons/io";

const navItems: Record<string, {name: string, target?: string, icon?: ReactElement}> = {
  '/': {
    name: 'me',
  },
  '/blog': {
    name: 'blog',
  },
  '/projects': {
    name: 'projects',
  },
  '/hire-me': {
    name: 'hire me',
  },
  '/resume': {
    name: 'resume',
    icon: <IoMdDownload />
  },
}

export function Navbar() {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, '') || '/';

  return (
    <aside className="-ml-1 sm:-ml-2 mb-8 sm:mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative pb-0 overflow-x-auto scrollbar-hide -mx-1 sm:-mx-2 px-1 sm:px-2"
          id="nav"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex flex-row space-x-0 sm:pr-10">
            {Object.entries(navItems).map(([path, { name, target, icon }]) => {
              const entryPath = path === '/' ? '/' : path.replace(/\/$/, '');
              const isProjects = entryPath === '/projects' && normalizedPath.startsWith('/projects');
              const isBlog = entryPath === '/blog' && normalizedPath.startsWith('/blog');
              const isExact = normalizedPath === entryPath;
              const isActive = isProjects || isBlog || isExact;
              return (
                <Link
                  key={path}
                  href={path}
                  target={target}
                  data-nav-item
                  className={`transition-all duration-200 flex align-middle items-center relative py-2 px-2 sm:py-1 sm:px-2 sm:m-1 group touch-manipulation min-h-[44px] sm:min-h-0 ${
                    isActive
                      ? 'text-black dark:text-white font-medium'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  <span className="relative whitespace-nowrap text-sm sm:text-base">
                    {name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-black dark:bg-white" />
                    )}
                  </span>
                  {icon && (
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-y-0.5 flex-shrink-0">
                      {icon}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
