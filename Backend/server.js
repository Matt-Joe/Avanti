require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Allowed origins for CORS
const allowedOrigins = [
  'http://127.0.0.1:5500',           // local dev
  'https://avantigl.netlify.app'     // your frontend
];

// ✅ CORS middleware
app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true); // allow curl, mobile apps
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// ✅ Preflight requests
app.options('*', cors());

// ✅ JSON parser (skip for Stripe webhook)
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // leave raw body for Stripe
  } else {
    express.json()(req, res, next);
  }
});

// Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ===============================
// ROUTES
// ===============================

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { roomID, roomName, start, end, nights, rate, total, userID } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'zar',
          product_data: { name: `Booking: ${roomName}` },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://avantigl.netlify.app/profile/profile',
      cancel_url: 'https://avantigl.netlify.app/booking/booking',
      metadata: {
        roomID: roomID?.toString() || 'missing',
        start: start?.toString() || '',
        end: end?.toString() || '',
        nights: nights?.toString() || '',
        rate: rate?.toString() || '',
        total: total?.toString() || '',
        userID: userID?.toString() || 'unknown',
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    if (!metadata || !metadata.userID || !metadata.roomID) {
      console.error('❌ Missing metadata:', metadata);
      return res.sendStatus(200);
    }

    try {
      const { data, error } = await supabase
        .from('BookingTable')
        .insert({
          UserID: metadata.userID,
          RoomID: metadata.roomID,
          BookingStartDate: metadata.start,
          BookingEndDate: metadata.end,
          BookingTotalNights: parseInt(metadata.nights),
          BookingTotalPrice: parseFloat(metadata.total),
          created_at: new Date().toISOString()
        });

      if (error) throw new Error(error.message);
      console.log('✅ Booking inserted:', data);
    } catch (err) {
      console.error('❌ Error inserting booking:', err.message);
    }
  }

  res.sendStatus(200);
});

// Test booking insert
app.get('/test-booking', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('BookingTable')
      .insert({
        UserID: 'test-user',
        RoomID: 'room-1',
        BookingStartDate: '2025-06-05',
        BookingEndDate: '2025-06-07',
        BookingTotalNights: 2,
        BookingTotalPrice: 1000,
        created_at: new Date().toISOString()
      });

    if (error) return res.status(500).send('Insert test failed: ' + error.message);
    res.send('Test booking inserted successfully!');
  } catch (err) {
    res.status(500).send('Unexpected error: ' + err.message);
  }
});

// Health check
app.get('/', (req, res) => res.send('Server is running!'));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
