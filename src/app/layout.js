import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import NavBar from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Padel App",
  description: "Prenota il tuo campo da padel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1 p-0">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}