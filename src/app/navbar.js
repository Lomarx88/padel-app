"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 text-white p-4 flex gap-6 backdrop-blur-md bg-black/20 items-center justify-center text-lg">
      <Link href="/">Home</Link>
      <Link href="/prenota">Prenota</Link>
      {session ? (
        <>
          <Link href="/dashboard" className="text-green-300">
            Ciao, {session.user.nome}!
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 px-4 py-1 rounded-full text-sm hover:bg-red-600 transition"
          >
            Esci
          </button>
        </>
      ) : (
        <Link href="/login">Accedi</Link>
      )}
    </nav>
  );
}