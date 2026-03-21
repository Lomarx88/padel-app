"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Registrati() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);

  const handleRegistrazione = async () => {
    if (!nome || !email || !password) {
      setErrore("Compila tutti i campi");
      return;
    }

    setCaricamento(true);
    setErrore("");

    const risposta = await fetch("/api/registrati", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });

    const risultato = await risposta.json();

    if (risposta.ok) {
      router.push("/login");
    } else {
      setErrore(risultato.errore);
      setCaricamento(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Registrati 🎾
        </h1>

        {errore && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
            {errore}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-black">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Il tuo nome"
            className="border rounded-lg p-3 w-full text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="la@tuaemail.com"
            className="border rounded-lg p-3 w-full text-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimo 6 caratteri"
            className="border rounded-lg p-3 w-full text-black"
          />
        </div>

        <button
          onClick={handleRegistrazione}
          disabled={caricamento}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
        >
          {caricamento ? "Registrazione..." : "Registrati"}
        </button>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Hai già un account?{" "}
          <Link href="/login" className="text-green-700 font-semibold">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}