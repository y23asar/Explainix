import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import "../styles/animations.css";
import { PreferencesApplier } from "@/components/PreferencesApplier";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Explainix",
  description: "AI-powered learning content generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <PreferencesApplier />
        <div className="flex min-h-screen items-center justify-center bg-transparent">
          {/* Mobile device frame for desktop users, full width for actual mobile */}
          <div className="relative w-full max-w-md min-h-screen overflow-hidden bg-white/15 shadow-2xl backdrop-blur-xl dark:bg-slate-950/55 sm:border-x sm:border-white/25 dark:sm:border-white/10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
