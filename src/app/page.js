import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center gap-6">
      
      {/* Immagine di sfondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />
      
      {/* Overlay scuro per leggibilità */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Contenuto */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Benvenuto su Padel App 🎾
        </h1>
        <p className="text-xl text-gray-200 max-w-lg drop-shadow">
          Prenota il tuo campo da padel in pochi click, 
          direttamente online.
        </p>
        <Link 
          href="/prenota"
          className="backdrop-blur-md bg-black/20 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-black transition"
        >
          Prenota ora
        </Link>
      </div>

    </div>
  );
}