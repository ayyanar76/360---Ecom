// server/src/controllers/stripe.controller.js
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
const createCheckout = async (req, res) => {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY || process.env.STIRPE_SECRET_KEY
    if (!stripeSecret) {
      return res.status(500).json({ error: "Stripe secret key is not configured" })
    }
    const stripe = new Stripe(stripeSecret)
    const cart   = req.body.cart || []
    const clientUrl = ("https://three60-shops-vijh.onrender.com"  || 'http://localhost:5173').replace(/\/$/, '')
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    // Convert cart items to Stripe's format
    const lineItems = cart.map(function(item) {
      const price = Number(item.price) || 0
      const quantity = Number(item.qty) || 1
      return {
        price_data: {
          currency:     'inr',
          product_data: {
            name:   item.name || "Product",
            images: item.image_url ? [item.image_url] : [],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      }
    }).filter((item) => item.price_data.unit_amount > 0)

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "Invalid cart items" })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items:           lineItems,
      mode:                 'payment',
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${clientUrl}/cart`,
    })

    res.json({ success: true, url: session.url })

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message })
  }
}

export default createCheckout;
