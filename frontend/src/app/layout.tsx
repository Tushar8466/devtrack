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
    { name: "Docs", link: "/docs" },
    { name: "Pricing", link: "/pricing" },
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