import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";
import { PageTransition } from "@/components/layout/PageTransition";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "Kidspire | Play · Explore · Shine",
  description: "Make Every Weekend Special with engaging sports, arts, and hobby activities for youth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <head>
        {/* 
          NOTE: PWA Service Worker registration is temporarily disabled during active development 
          to prevent stale browser caching of CSS/JS build hashes. 
          Re-enable before production deployment.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                // Force unregister all active service workers during development
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </div>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
