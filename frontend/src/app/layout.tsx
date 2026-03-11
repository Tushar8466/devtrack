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
    { name: "OS Tracker", link: "/opensource" },
    { name: "Explore", link: "/explore" },
    { name: "Compare", link: "/compare" },
    { name: "Feedback", link: "/#feedback" },
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