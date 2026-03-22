import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const prenotazioni = await prisma.prenotazione.findMany({
    where: { utente: { email: session.user.email } },
  });

  return Response.json(prenotazioni);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.data || !body.campo || !body.orario) {
    return Response.json(
      { errore: "Data, campo e orario sono obbligatori" },
      { status: 400 }
    );
  }

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

  const nuovaPrenotazione = await prisma.prenotazione.create({
    data: {
      data: body.data,
      campo: body.campo,
      orario: body.orario,
      utente: { connect: { email: session.user.email } },
    },
  });

  return Response.json(nuovaPrenotazione, { status: 201 });
}
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id"));

  await prisma.prenotazione.delete({
    where: { id },
  });

  return Response.json({ messaggio: "Prenotazione eliminata" });
}