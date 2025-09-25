const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  try {
    const { items } = JSON.parse(event.body);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${process.env.URL}/success.html`,
      cancel_url: `${process.env.URL}/cart.html`,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create Stripe session' }),
    };
  }
};
