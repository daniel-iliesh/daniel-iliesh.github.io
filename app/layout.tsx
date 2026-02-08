import "./global.css";
import "yet-another-react-lightbox-lite/styles.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import Script from "next/script";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { PageTransition } from "./components/PageTransition";
import { OptimizedParallax } from "./components/OptimizedParallax";
import { LazyAnalytics } from "./components/LazyAnalytics";
import GoogleCalPopupBtn from "./components/googlecalpopupbtn";
import dynamic from "next/dynamic";

const SantaLayer = dynamic(() =>
  import("./components/SantaLayer").then((mod) => mod.SantaLayer),
);
const SnowOverlay = dynamic(() =>
  import("./components/SnowOverlay").then((mod) => mod.SnowOverlay),
);
const Lightrope = dynamic(() =>
  import("./components/Lightrope").then((mod) => mod.Lightrope),
);
const SantaLoadingOverlay = dynamic(() =>
  import("./components/SantaLoadingOverlay").then(
    (mod) => mod.SantaLoadingOverlay,
  ),
);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Daniel Iliesh - Web Developer",
    template: "%s | Daniel Iliesh - Web Developer",
  },
  description: "Skilled specialist in web development",
  openGraph: {
    title: "Daniel Iliesh - Web Developer",
    description: "Skilled specialist in web development",
    url: baseUrl,
    siteName: "Daniel Iliesh - Web Developer",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  const month = now.getMonth(); // 0-based
  const isSeasonDefault = month === 11 || month === 0; // December or January

  const parseSeasonalFlag = (
    value: string | undefined,
    seasonalDefault: boolean,
  ) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "auto") return seasonalDefault;
    return seasonalDefault; // undefined or anything else falls back to seasonal
  };

  const isSnowEnabled = parseSeasonalFlag(
    process.env.NEXT_PUBLIC_ENABLE_SNOW,
    isSeasonDefault,
  );
  const isSantaEnabled = parseSeasonalFlag(
    process.env.NEXT_PUBLIC_ENABLE_SANTA,
    isSeasonDefault,
  );
  const isLightsEnabled = parseSeasonalFlag(
    process.env.NEXT_PUBLIC_ENABLE_LIGHTROPE,
    isSeasonDefault,
  );

  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black mx-auto",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="antialiased max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-3 sm:px-4 mt-4 sm:mt-8">
        {isSantaEnabled && <SantaLoadingOverlay />}
        <OptimizedParallax />
        {isLightsEnabled && <Lightrope />}
        {isSnowEnabled && <SnowOverlay enabled={isSnowEnabled} />}
        {isSantaEnabled && <SantaLayer />}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-W1GYW7S8EV"
              strategy="afterInteractive"
            />
            <Script id="ga-gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-W1GYW7S8EV');
              `}
            </Script>
          </>
        )}
        <PageTransition>
          <main className="flex-auto min-w-0 mt-4 sm:mt-6 flex flex-col">
            <Navbar />
            {children}
            <Footer />
          </main>
        </PageTransition>
        {/* Load analytics and third-party scripts after page interaction */}
        <LazyAnalytics />
        {/* Booking button - loads immediately */}
        <GoogleCalPopupBtn />
      </body>
    </html>
  );
}
