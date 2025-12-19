"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from "./components/nav";
import Footer from "./components/footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  // For admin routes, don't render navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For public routes, render with navbar and footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

