import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
