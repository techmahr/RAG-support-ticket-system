import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { analyzeTicket } from '../services/chain.js'
import { parseIncomingTicket } from '../utils/parser.js'

const router = express.Router()

// ─────────────────────────────────────────
// POST /api/ticket/analyze
// Submit a new ticket and get AI suggestion
// ─────────────────────────────────────────
router.post('/analyze', async (req, res) => {
    try {
        // STEP 1 — Validate incoming data
        const parsed = parseIncomingTicket(req.body)

        if (!parsed.valid) {
            return res.status(400).json({
                success: false,
                errors: parsed.errors,
            })
        }

        // STEP 2 — Get session ID for conversation memory
        // Either use provided sessionId or generate a new one
        // sessionId lets us track conversation history per user
        const sessionId = req.body.sessionId || uuidv4()

        console.log(`\n📩 New ticket received: "${parsed.data.title}"`)
        console.log(`   Session: ${sessionId}`)

        // STEP 3 — Analyze the ticket using RAG chain
        const result = await analyzeTicket(parsed.data.searchText, sessionId)

        // STEP 4 — Send back the response
        return res.status(200).json({
            success: true,
            sessionId,          // Return sessionId so user can continue conversation
            ticket: {
                title: parsed.data.title,
                description: parsed.data.description,
                category: parsed.data.category,
                priority: parsed.data.priority,
            },
            analysis: result.analysis,
            similarTickets: result.similarTickets,
        })

    } catch (error) {
        console.error('❌ Route error:', error.message)
        return res.status(500).json({
            success: false,
            error: 'Something went wrong while analyzing the ticket',
        })
    }
})

export default router