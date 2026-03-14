import { FloatingNav } from "@/components/ui/floating-navbar";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AtlasAssistant } from "@/components/AtlasAssistant";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTrack | Neural Intelligence Core",
  description: "Advanced GitHub Contribution Tracker & DNA Analyzer",
  icons: {
    icon: "/logo/devtrack-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Pulse", link: "/pulse" },
    { name: "Code DNA", link: "/dna" },
    { name: "Projects", link: "/projects" },
    { name: "OS Tracker", link: "/opensource" },
    { name: "Explore", link: "/explore" },
    { name: "DevTrack AI", link: "/ai" },
    { name: "Compare", link: "/compare" },
  ];

  return (
    <html lang="en">
      <body className="bg-black text-white selection:bg-violet-500/30">
        <SessionProvider>
          <FloatingNav navItems={navItems} />
          {children}
          <AtlasAssistant />
        </SessionProvider>
      </body>
    </html>
  );
}