"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const eliminaPrenotazione = async (id) => {
  if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return;
  
  await fetch(`/api/prenotazioni?id=${id}`, {
    method: "DELETE",
  });

  setPrenotazioni(prenotazioni.filter((p) => p.id !== id));
};

  useEffect(() => {
    const fetchPrenotazioni = async () => {
      const risposta = await fetch("/api/prenotazioni");
      const dati = await risposta.json();
      setPrenotazioni(dati);
      setCaricamento(false);
    };

    fetchPrenotazioni();
  }, []);

  if (status === "loading" || caricamento) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-24 pb-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        La tua dashboard 🎾
      </h1>
      <p className="text-gray-500 mb-8">
        Bentornato, {session?.user?.nome}!
      </p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Le tue prenotazioni</h2>
        <Link
          href="/prenota"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition"
        >
          + Nuova prenotazione
        </Link>
      </div>

      {prenotazioni.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Non hai ancora prenotazioni</p>
          <Link
            href="/prenota"
            className="text-green-700 font-semibold hover:underline"
          >
            Prenota il tuo primo campo →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prenotazioni.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  📅 {new Date(p.data + "T00:00:00").toLocaleDateString("it-IT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  🎾 {p.campo} · 🕐 {p.orario}
                </p>
              </div>
             <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
           Confermata
         </span>
       <button
        onClick={() => eliminaPrenotazione(p.id)}
       className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-200 transition"
       >
       Elimina
      </button>
      </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}