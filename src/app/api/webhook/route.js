import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ errore: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { data, campo, orario, email } = session.metadata;

    if (data && campo && orario && email) {
      // Salva prenotazione
      await prisma.prenotazione.create({
        data: {
          data,
          campo,
          orario,
          utente: { connect: { email } },
        },
      });

      // Trova il nome dell'utente
      const utente = await prisma.utente.findUnique({
        where: { email },
        select: { nome: true },
      });

      // Manda email di conferma
      await resend.emails.send({
        from: "Padel App <onboarding@resend.dev>",
        to: email,
        subject: "✅ Prenotazione confermata!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #15803d;">Prenotazione confermata! 🎾</h1>
            <p>Ciao ${utente?.nome || ""},</p>
            <p>La tua prenotazione è stata confermata con successo.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p>📅 <strong>Data:</strong> ${new Date(data + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>🎾 <strong>Campo:</strong> ${campo}</p>
              <p>🕐 <strong>Orario:</strong> ${orario}</p>
              <p>💶 <strong>Importo pagato:</strong> €15,00</p>
            </div>
            <p>Puoi visualizzare tutte le tue prenotazioni nella tua dashboard.</p>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #15803d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 10px;">
              Vai alla dashboard
            </a>
            <p style="color: #9ca3af; margin-top: 30px; font-size: 14px;">Padel App — prenota il tuo campo online</p>
          </div>
        `,
      });
      // Notifica admin
await resend.emails.send({
  from: "Padel App <onboarding@resend.dev>",
  to: "lomarx17@gmail.com",
  subject: "🎾 Nuova prenotazione ricevuta!",
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #15803d;">Nuova prenotazione! 🎾</h1>
      <p>È arrivata una nuova prenotazione:</p>
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p>👤 <strong>Utente:</strong> ${utente?.nome || ""} (${email})</p>
        <p>📅 <strong>Data:</strong> ${new Date(data + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>🎾 <strong>Campo:</strong> ${campo}</p>
        <p>🕐 <strong>Orario:</strong> ${orario}</p>
        <p>💶 <strong>Importo:</strong> €15,00</p>
      </div>
    </div>
  `,
});

      console.log("✅ Prenotazione salvata ed email inviata!");
    }
  }

  return new Response(JSON.stringify({ ricevuto: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}