// backend/src/server.js
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Router Ticketmaster
const ticketmasterRouter = require('./routes/ticketmaster')

const app = express()

// Middleware base
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))

// Rate limit per tutte le API
app.use('/api/', rateLimit({ windowMs: 60_000, max: 60 }))

// Monta le rotte
app.use('/api/ticketmaster', ticketmasterRouter)

// (opzionale) rotta diagnostica
app.get('/__ping', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`ConcertHub API in ascolto su http://localhost:${PORT}`)
})
