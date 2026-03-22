import Stripe from "stripe";
import { prisma } from "@/app/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      headers: { "Content-Type": "application/json" }
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { data, campo, orario, email } = session.metadata;

    if (data && campo && orario && email) {
      await prisma.prenotazione.create({
        data: {
          data,
          campo,
          orario,
          utente: { connect: { email } },
        },
      });
    }
  }

  return new Response(JSON.stringify({ ricevuto: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}