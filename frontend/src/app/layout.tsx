import { FloatingNav } from "@/components/ui/floating-navbar";
import "./globals.css";

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
        <FloatingNav navItems={navItems} />
        {children}
      </body>
    </html>
  );
}