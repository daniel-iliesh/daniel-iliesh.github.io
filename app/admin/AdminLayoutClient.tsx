"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./_components/sidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );

  // Normalize pathname (handle trailing slash from next.config.js)
  const normalizedPath = pathname?.replace(/\/$/, '') || '/';
  const isLoginPage = normalizedPath === "/admin/login";

  useEffect(() => {
    // Skip auth check for login page
    if (isLoginPage) {
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          // Proxy will handle redirect, we just don't render content
        }
      } catch (err) {
        setIsAuthenticated(false);
        // Proxy will handle redirect, we just don't render content
      }
    };

    checkAuth();
  }, [pathname, isLoginPage]);

  // Allow login page to render without any auth check
  if (isLoginPage) {
    return (
      <div className="flex items-center justify-center bg-white dark:bg-black">
        {children}
      </div>
    );
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children (proxy will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render admin content with sidebar and logout button
  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-900/50 px-6">
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-neutral-400">Welcome, {user.username}</span>
            )}
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/admin/login/");
              router.refresh();
            }}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-700 hover:text-white"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

