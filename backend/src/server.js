// backend/src/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Router Ticketmaster
const ticketmasterRouter = require('./routes/ticketmaster');
// Routers Auth & Favorites
const authRouter = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');

const app = express();

// siamo dietro a un proxy (Render), serve per express-rate-limit
app.set('trust proxy', 1);

// Middleware base
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  })
);

// Rate limit per tutte le API
app.use(
  '/api/',
  rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Monta le rotte API
app.use('/api/ticketmaster', ticketmasterRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);

// rotta diagnostica per Render
app.get('/__ping', (req, res) => res.json({ ok: true }));

// rotta principale: evita "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ConcertHub API running' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI non impostata, esco.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connesso');
  } catch (err) {
    console.error('❌ Errore connessione a MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 ConcertHub API in ascolto su http://localhost:${PORT}`);
  });
}

start();
