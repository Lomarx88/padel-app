import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ errore: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json();

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Prenotazione ${body.campo}`,
              description: `${body.data} alle ${body.orario}`,
            },
            unit_amount: 1500, // 15€ in centesimi
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?pagamento=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/prenota`,
      metadata: {
        data: body.data,
        campo: body.campo,
        orario: body.orario,
        email: session.user.email,
      },
    });

    return Response.json({ url: stripeSession.url });
  } catch (error) {
    console.error(error);
    return Response.json(
      { errore: "Errore nella creazione del pagamento" },
      { status: 500 }
    );
  }
}