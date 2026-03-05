import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // We'll create this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INTEGRA - International Journal of Advanced Research and Studies",
  description: "Ilmiy tadqiqotlar va ilg‘ar izlanishlar xalqaro jurnali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p className="mb-2">INTEGRA: International Journal of Advanced Research and Studies</p>
            <p className="text-blue-200">ISSN 1234-5678 | DOI: 10.56789/integra</p>
            <p className="mt-4 text-blue-300">© 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}