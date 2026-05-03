import express from 'express'
import env from './config/env.js'

// Import all routes
import ticketRoute from './routes/ticket.route.js'
import feedbackRoute from './routes/feedback.route.js'
import ingestRoute from './routes/ingest.route.js'
import { clearHistory } from './services/chain.js'

// ─────────────────────────────────────────
// STEP 1 — Create Express app
// ─────────────────────────────────────────
const app = express()

// ─────────────────────────────────────────
// STEP 2 — Middleware
// ─────────────────────────────────────────
// Middleware runs on EVERY request before it hits the route
// express.json() tells Express to parse incoming JSON body
// Without this req.body would be undefined
app.use(express.json())

// Simple request logger — prints every incoming request
// Useful for debugging during development
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`)
    next() // pass request to next middleware or route
})

// ─────────────────────────────────────────
// STEP 3 — Routes
// ─────────────────────────────────────────
// Mount each router at its base path
// All ticket routes will be prefixed with /api/ticket
// All feedback routes will be prefixed with /api/feedback
// All ingest routes will be prefixed with /api/ingest
app.use('/api/ticket', ticketRoute)
app.use('/api/feedback', feedbackRoute)
app.use('/api/ingest', ingestRoute)

// ─────────────────────────────────────────
// STEP 4 — Health check endpoint
// ─────────────────────────────────────────
// Simple endpoint to verify server is running
// Useful for monitoring tools and deployment checks
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'Server is running',
        timestamp: new Date().toISOString(),
    })
})

// ─────────────────────────────────────────
// STEP 5 — Clear history endpoint
// ─────────────────────────────────────────
app.delete('/api/history/:sessionId', (req, res) => {
    const { sessionId } = req.params
    clearHistory(sessionId)
    res.status(200).json({
        success: true,
        message: `Conversation history cleared for session: ${sessionId}`,
    })
})

// ─────────────────────────────────────────
// STEP 6 — Global error handler
// ─────────────────────────────────────────
// Catches any unhandled errors across the entire app
// Always needs 4 parameters — Express identifies it as error handler
app.use((err, req, res, next) => {
    console.error('🔥 Unhandled error:', err.message)
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    })
})

// ─────────────────────────────────────────
// STEP 7 — 404 handler
// ─────────────────────────────────────────
// If no route matched, return 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
    })
})

// ─────────────────────────────────────────
// STEP 8 — Start the server
// ─────────────────────────────────────────
app.listen(env.port, () => {
    console.log('\n🚀 Server is running!')
    console.log(`📡 URL: http://localhost:${env.port}`)
    console.log('\nAvailable endpoints:')
    console.log(`  POST   http://localhost:${env.port}/api/ticket/analyze`)
    console.log(`  POST   http://localhost:${env.port}/api/feedback`)
    console.log(`  GET    http://localhost:${env.port}/api/feedback/stats`)
    console.log(`  POST   http://localhost:${env.port}/api/ingest`)
    console.log(`  GET    http://localhost:${env.port}/api/health`)
    console.log(`  DELETE http://localhost:${env.port}/api/history/:sessionId`)
})