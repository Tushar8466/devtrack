import { FloatingNav } from "@/components/ui/floating-navbar";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Explore", link: "/explore" },
  ];

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <SessionProvider>
          <FloatingNav navItems={navItems} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}