import express from 'express'
import Feedback from '../models/feedback.model.js'
import Ticket from '../models/ticket.model.js'

const router = express.Router()

// ─────────────────────────────────────────
// POST /api/feedback
// Save feedback to MongoDB
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { ticketId, helpful, comment } = req.body

        // Validate
        if (!ticketId)
            return res.status(400).json({ success: false, error: 'ticketId is required' })

        if (typeof helpful !== 'boolean')
            return res.status(400).json({ success: false, error: 'helpful must be true or false' })

        // Try to find the ticket to get its category
        // ticketId could be sessionId or MongoDB _id
        let category = 'General'
        try {
            const ticket = await Ticket.findOne({ sessionId: ticketId })
            if (ticket) category = ticket.category
        } catch (e) {
            // ticketId might not be a valid MongoDB ID — that is fine
        }

        // Save feedback to MongoDB
        const feedback = await Feedback.create({
            ticketId,
            helpful,
            comment: comment || null,
            category,
        })

        console.log(`\n📊 Feedback saved: ${helpful ? '👍' : '👎'} for ticket ${ticketId}`)

        return res.status(200).json({
            success: true,
            message: 'Feedback recorded. Thank you!',
            feedback,
        })

    } catch (error) {
        console.error('❌ Feedback error:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to save feedback' })
    }
})

// ─────────────────────────────────────────
// GET /api/feedback/stats
// Aggregated feedback statistics from MongoDB
// ─────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        // Total counts
        const total = await Feedback.countDocuments()
        const helpful = await Feedback.countDocuments({ helpful: true })
        const notHelpful = total - helpful

        // Stats per category using MongoDB aggregation
        const byCategory = await Feedback.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: 1 },
                    helpful: {
                        $sum: { $cond: ['$helpful', 1, 0] },
                    },
                },
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    helpful: 1,
                    helpfulPercentage: {
                        $round: [
                            { $multiply: [{ $divide: ['$helpful', '$total'] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $sort: { total: -1 } }, // Most feedback first
        ])

        // Recent feedback (last 5)
        const recent = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('ticketId helpful comment category createdAt')

        return res.status(200).json({
            success: true,
            stats: {
                total,
                helpful,
                notHelpful,
                helpfulPercentage: total > 0 ? Math.round((helpful / total) * 100) : 0,
                byCategory,
                recent,
            },
        })

    } catch (error) {
        console.error('❌ Stats error:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to fetch stats' })
    }
})

// ─────────────────────────────────────────
// GET /api/feedback/dashboard
// All stats needed for the dashboard in one call
// ─────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
    try {
        // Total tickets analyzed
        const totalTickets = await Ticket.countDocuments()

        // Total feedback
        const totalFeedback = await Feedback.countDocuments()
        const helpfulCount = await Feedback.countDocuments({ helpful: true })

        // Average confidence score across all tickets
        const avgConfidence = await Ticket.aggregate([
            {
                $group: {
                    _id: null,
                    avgConfidence: { $avg: '$analysis.confidence' },
                },
            },
        ])

        // Tickets by category
        const ticketsByCategory = await Ticket.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$analysis.confidence' },
                },
            },
            { $sort: { count: -1 } },
        ])

        // Feedback by category
        const feedbackByCategory = await Feedback.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: 1 },
                    helpful: { $sum: { $cond: ['$helpful', 1, 0] } },
                },
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    helpful: 1,
                    helpfulPercentage: {
                        $round: [
                            { $multiply: [{ $divide: ['$helpful', '$total'] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $sort: { total: -1 } },
        ])

        // Recent tickets (last 5)
        const recentTickets = await Ticket.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title category priority analysis.confidence createdAt')

        // Recent feedback (last 5)
        const recentFeedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('ticketId helpful category createdAt')

        return res.status(200).json({
            success: true,
            dashboard: {
                overview: {
                    totalTickets,
                    totalFeedback,
                    helpfulPercentage: totalFeedback > 0
                        ? Math.round((helpfulCount / totalFeedback) * 100)
                        : 0,
                    avgConfidence: avgConfidence.length > 0
                        ? Math.round(avgConfidence[0].avgConfidence)
                        : 0,
                },
                ticketsByCategory,
                feedbackByCategory,
                recentTickets,
                recentFeedback,
            },
        })

    } catch (error) {
        console.error('❌ Dashboard error:', error.message)
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data',
        })
    }
})

export default router