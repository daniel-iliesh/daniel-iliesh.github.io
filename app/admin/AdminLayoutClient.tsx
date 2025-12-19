"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { AdminSidebar } from "./_components/admin-sidebar";
import { cn } from "@/lib/utils";

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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login/");
    router.refresh();
  };

  // Allow login page to render without any auth check
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden z-50">
        {children}
      </div>
    );
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children (proxy will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render admin content with sidebar using shadcn sidebar components
  return (
    <SidebarProvider>
      <AdminSidebar user={user} onLogout={handleLogout} />
      <SidebarInset>
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear",
            "sticky top-0 z-50 overflow-hidden rounded-t-[inherit] bg-background/50 backdrop-blur-md"
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              )}
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6 overflow-y-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

