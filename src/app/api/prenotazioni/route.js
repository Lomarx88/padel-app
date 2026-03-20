import { prisma } from "@/app/lib/prisma";
export async function GET() {
  const prenotazioni = await prisma.prenotazione.findMany();
  return Response.json(prenotazioni);
}

export async function POST(request) {
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
    },
  });

  return Response.json(nuovaPrenotazione, { status: 201 });
}