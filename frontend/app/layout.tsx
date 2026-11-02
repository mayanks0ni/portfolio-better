import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mayank soni — engineer & creative technologist",
  description:
    "software engineer focusing on high-concurrency systems, reinforcement learning data planes, agentic ai guardrails, and digital craftsmanship.",
  openGraph: {
    title: "mayank soni — engineer & creative technologist",
    description:
      "software engineer and creative technologist. high-concurrency systems, reinforcement learning, autonomous agent security, and visual design.",
    type: "website",
    url: "https://mayanksoni.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved ? saved : (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.remove('dark', 'light');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable} bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[#f3b73e] selection:text-[#08090d]`}
      >
        {children}
      </body>
    </html>
  );
}
