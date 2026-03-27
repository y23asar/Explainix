import type { Metadata } from "next";
import "./globals.css";
import "../styles/animations.css";

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
      <body>{children}</body>
    </html>
  );
}
