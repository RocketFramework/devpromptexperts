import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
      </body>
    </html>
  );
}
