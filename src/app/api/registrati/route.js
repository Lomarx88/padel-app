import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const body = await request.json();

  if (!body.nome || !body.email || !body.password) {
    return Response.json(
      { errore: "Tutti i campi sono obbligatori" },
      { status: 400 }
    );
  }

  if (body.password.length < 6) {
    return Response.json(
      { errore: "La password deve essere di almeno 6 caratteri" },
      { status: 400 }
    );
  }

  // Controlla se l'email esiste già
  const utenteEsistente = await prisma.utente.findUnique({
    where: { email: body.email },
  });

  if (utenteEsistente) {
    return Response.json(
      { errore: "Email già registrata" },
      { status: 409 }
    );
  }

  // Cripta la password
  const passwordCriptata = await bcrypt.hash(body.password, 10);

  // Crea l'utente
  const nuovoUtente = await prisma.utente.create({
    data: {
      nome: body.nome,
      email: body.email,
      password: passwordCriptata,
    },
  });

  return Response.json(
    { messaggio: "Utente creato con successo", id: nuovoUtente.id },
    { status: 201 }
  );
}