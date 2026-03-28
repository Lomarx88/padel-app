import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");
  const campo = searchParams.get("campo");

  if (!data || !campo) {
    return Response.json({ slotOccupati: [] });
  }

  const prenotazioni = await prisma.prenotazione.findMany({
    where: { data, campo },
    select: { orario: true },
  });

  const slotOccupati = prenotazioni.map((p) => p.orario);
  return Response.json({ slotOccupati });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();

  const slotOccupato = await prisma.prenotazione.findFirst({
    where: {
      data: body.data,
      campo: body.campo,
      orario: body.orario,
    },
  });

  if (slotOccupato) {
    return Response.json(
      { errore: "Questo slot è già occupato" },
      { status: 409 }
    );
  }

  return Response.json({ disponibile: true });
}