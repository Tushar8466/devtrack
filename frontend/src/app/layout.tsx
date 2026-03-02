import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-black">

        {/* Background Layer */}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

      </body>
    </html>
  );
}