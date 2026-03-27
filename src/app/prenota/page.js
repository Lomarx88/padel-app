"use client";

import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { it } from "date-fns/locale/it";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

registerLocale("it", it);

const ORARI = [
  "09:00", "10:00", "11:00", "12:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const CAMPI = ["Campo 1", "Campo 2"];

export default function Prenota() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [campo, setCampo] = useState("Campo 1");
  const [orarioScelto, setOrarioScelto] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Caricamento...</p>
      </div>
    );
  }

  const handlePrenotazione = async () => {
    if (!data || !orarioScelto) return;

    const slotData = data.toISOString().split("T")[0];

    try {
      const verifica = await fetch("/api/prenotazioni/verifica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: slotData,
          campo: campo,
          orario: orarioScelto,
        }),
      });

      if (verifica.ok) {
        const checkout = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: slotData,
            campo: campo,
            orario: orarioScelto,
          }),
        });

        const { url } = await checkout.json();
        window.location.href = url;
      } else {
        const risultatoVerifica = await verifica.json();
        alert(`❌ ${risultatoVerifica.errore}`);
      }
    } catch (error) {
      alert("❌ Errore di connessione, riprova tra qualche secondo");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Prenota un campo 🎾
      </h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Scegli la data
        </label>
        <DatePicker
          selected={data}
          onChange={(date) => setData(date)}
          minDate={new Date()}
          locale="it"
          dateFormat="dd/MM/yyyy"
          placeholderText="Clicca per scegliere la data"
          className="border rounded-lg p-3 w-full text-lg cursor-pointer"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Scegli il campo
        </label>
        <div className="flex gap-4">
          {CAMPI.map((c) => (
            <button
              key={c}
              onClick={() => setCampo(c)}
              className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                campo === c
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-green-700 border-green-700 hover:bg-green-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-2">
          Scegli l&apos;orario
        </label>
        <div className="grid grid-cols-4 gap-3">
          {ORARI.map((orario) => (
            <button
              key={orario}
              onClick={() => setOrarioScelto(orario)}
              className={`py-3 rounded-lg border-2 font-semibold transition ${
                orarioScelto === orario
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-green-700 border-green-700 hover:bg-green-50"
              }`}
            >
              {orario}
            </button>
          ))}
        </div>
      </div>

      {data && orarioScelto && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-800 mb-2">Riepilogo</h2>
          <p className="text-gray-700">📅 Data: <strong>
            {data ? data.toLocaleDateString("it-IT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : ""}
          </strong></p>
          <p className="text-gray-700">🎾 Campo: <strong>{campo}</strong></p>
          <p className="text-gray-700">🕐 Orario: <strong>{orarioScelto}</strong></p>
          <button
            onClick={handlePrenotazione}
            className="mt-4 w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition"
          >
            Conferma e paga
          </button>
        </div>
      )}
    </div>
  );
}