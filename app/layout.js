import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Study Task Manager",
  description: "Focused task manager for students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased app-body`}
      >
        <Providers>
          <div className="app-root">
            <header className="app-header">
              <Link href="/" className="brand">
                <span className="brand-icon">▢</span>
                <span className="brand-text">Study Task Manager</span>
              </Link>
              <span className="brand-subtitle">
                Minimal, sharp, and built to ship your work.
              </span>
            </header>

            <div className="app-content">{children}</div>

            <footer className="app-footer">
              <span>
                Study Task Manager • Plan clearly. Execute consistently.
              </span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
