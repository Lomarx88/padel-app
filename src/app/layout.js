import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
      <nav className="absolute top-0 left-0 right-0 z-20 text-white text-lg p-4 flex gap-6 backdrop-blur-md bg-black/20 items-center justify-center">
          <Link href="/">Home</Link>
          <Link href="/prenota">Prenota</Link>
          <Link href="/login">Accedi</Link>
        </nav>
        <main className="flex-1 p-0">
          {children}
        </main>
      </body>
    </html>
  );
}