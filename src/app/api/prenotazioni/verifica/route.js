import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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