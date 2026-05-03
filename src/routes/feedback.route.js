import express from 'express'
import { parseFeedback } from '../utils/parser.js'

const router = express.Router()

// In-memory feedback store
// In a real app this would go to a database
const feedbackStore = []

// ─────────────────────────────────────────
// POST /api/feedback
// Mark a suggestion as helpful or not
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        // Validate feedback data
        const parsed = parseFeedback(req.body)

        if (!parsed.valid) {
            return res.status(400).json({
                success: false,
                errors: parsed.errors,
            })
        }

        // Store feedback with timestamp
        const feedback = {
            ...parsed.data,
            timestamp: new Date().toISOString(),
        }

        feedbackStore.push(feedback)

        console.log(`\n📊 Feedback received for ticket ${feedback.ticketId}: ${feedback.helpful ? '👍 Helpful' : '👎 Not helpful'}`)

        return res.status(200).json({
            success: true,
            message: 'Feedback recorded. Thank you!',
            feedback,
        })

    } catch (error) {
        console.error('❌ Feedback error:', error.message)
        return res.status(500).json({
            success: false,
            error: 'Something went wrong while recording feedback',
        })
    }
})

// ─────────────────────────────────────────
// GET /api/feedback/stats
// See feedback statistics
// ─────────────────────────────────────────
router.get('/stats', (req, res) => {
    const total = feedbackStore.length
    const helpful = feedbackStore.filter(f => f.helpful).length
    const notHelpful = total - helpful

    return res.status(200).json({
        success: true,
        stats: {
            total,
            helpful,
            notHelpful,
            helpfulPercentage: total > 0 ? Math.round((helpful / total) * 100) : 0,
        },
    })
})

export default router