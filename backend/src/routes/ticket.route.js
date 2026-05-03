import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { analyzeTicket } from '../services/chain.js'
import { parseIncomingTicket } from '../utils/parser.js'
import Ticket from '../models/ticket.model.js'

const router = express.Router()

// ─────────────────────────────────────────
// POST /api/ticket/analyze
// ─────────────────────────────────────────
router.post('/analyze', async (req, res) => {
    try {
        // Step 1 — Validate input
        const parsed = parseIncomingTicket(req.body)
        if (!parsed.valid)
            return res.status(400).json({ success: false, errors: parsed.errors })

        // Step 2 — Get or create session ID
        const sessionId = req.body.sessionId || uuidv4()

        console.log(`\n📩 New ticket: "${parsed.data.title}"`)
        console.log(`   Session: ${sessionId}`)

        // Step 3 — Run RAG pipeline
        const result = await analyzeTicket(parsed.data.searchText, sessionId)

        // Step 4 — Save to MongoDB ← NEW
        const ticket = await Ticket.create({
            title: parsed.data.title,
            description: parsed.data.description,
            category: parsed.data.category,
            priority: parsed.data.priority,
            sessionId,
            analysis: result.analysis,
            similarTickets: result.similarTickets,
        })

        console.log(`💾 Ticket saved to MongoDB: ${ticket._id}`)

        // Step 5 — Return response
        return res.status(200).json({
            success: true,
            sessionId,
            ticketDbId: ticket._id, // MongoDB document ID
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

// ─────────────────────────────────────────
// GET /api/ticket/history
// Get all analyzed tickets from MongoDB
// ─────────────────────────────────────────
router.get('/history', async (req, res) => {
    try {
        const { category, priority, limit = 20, page = 1 } = req.query

        // Build filter object dynamically
        const filter = {}
        if (category) filter.category = category
        if (priority) filter.priority = priority

        // Fetch from MongoDB with pagination
        const tickets = await Ticket.find(filter)
            .sort({ createdAt: -1 }) // Latest first
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .select('-similarTickets') // Exclude similarTickets to keep response small

        const total = await Ticket.countDocuments(filter)

        return res.status(200).json({
            success: true,
            total,
            page: Number(page),
            limit: Number(limit),
            tickets,
        })

    } catch (error) {
        console.error('❌ History error:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to fetch history' })
    }
})

// ─────────────────────────────────────────
// GET /api/ticket/:id
// Get single ticket by MongoDB ID
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)

        if (!ticket)
            return res.status(404).json({ success: false, error: 'Ticket not found' })

        return res.status(200).json({ success: true, ticket })

    } catch (error) {
        console.error('❌ Get ticket error:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to fetch ticket' })
    }
})

export default router