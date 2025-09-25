const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use an environment variable for the secret key

app.use(express.json());
app.use(express.static('.'));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success.html`, // Using a relative success URL
      cancel_url: `${req.protocol}://${req.get('host')}/cart.html`,   // Using a relative cancel URL
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
