import { FloatingNav } from "@/components/ui/floating-navbar";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AtlasAssistant } from "@/components/AtlasAssistant";

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
    { name: "Compare", link: "/compare" },
  ];

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SessionProvider>
          <FloatingNav navItems={navItems} />
          {children}
          <AtlasAssistant />
        </SessionProvider>
      </body>
    </html>
  );
}