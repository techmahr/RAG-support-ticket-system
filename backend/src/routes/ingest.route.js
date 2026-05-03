import express from 'express'
import multer from 'multer'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import { Document } from '@langchain/core/documents'
import env from '../config/env.js'

const router = express.Router()

// ─────────────────────────────────────────
// Multer config — store file in memory
// ─────────────────────────────────────────
// memoryStorage means file is kept in RAM as a Buffer
// not saved to disk — perfect for temporary processing
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: (req, file, cb) => {
        // Only allow CSV files
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true) // Accept file
        } else {
            cb(new Error('Only CSV files are allowed')) // Reject file
        }
    },
})

// ─────────────────────────────────────────
// Shared ingest logic
// ─────────────────────────────────────────
async function ingestTicketsIntoPinecone(tickets) {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: env.geminiApiKey,
        modelName: 'gemini-embedding-001',
    })

    const pinecone = new Pinecone({ apiKey: env.pineconeApiKey })
    const pineconeIndex = pinecone.index(env.pineconeIndex)

    const documents = tickets.map((ticket) => new Document({
        pageContent: `
      Title: ${ticket.title}
      Description: ${ticket.description}
      Category: ${ticket.category}
      Resolution: ${ticket.resolution}
    `,
        metadata: {
            ticketId: ticket.id,
            title: ticket.title,
            category: ticket.category,
            priority: ticket.priority,
            resolution: ticket.resolution,
            resolvedAt: ticket.resolvedAt,
        },
    }))

    await PineconeStore.fromDocuments(documents, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    })

    return documents.length
}

// ─────────────────────────────────────────
// Validate a single ticket row
// ─────────────────────────────────────────
function validateTicket(ticket, index) {
    const errors = []
    const required = ['id', 'title', 'description', 'category', 'resolution']

    required.forEach(field => {
        if (!ticket[field] || ticket[field].trim() === '') {
            errors.push(`Row ${index + 1}: "${field}" is required`)
        }
    })

    return errors
}

// ─────────────────────────────────────────
// POST /api/ingest/csv
// Upload and ingest a CSV file
// ─────────────────────────────────────────
router.post('/csv', upload.single('file'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded. Please upload a CSV file.',
            })
        }

        console.log(`\n📂 CSV upload received: ${req.file.originalname}`)
        console.log(`   Size: ${(req.file.size / 1024).toFixed(2)} KB`)

        // Parse CSV from buffer
        // req.file.buffer is the raw file data in memory
        const csvContent = req.file.buffer.toString('utf-8')

        const records = parse(csvContent, {
            columns: true,        // First row = column headers
            skip_empty_lines: true,
            trim: true,           // Remove whitespace from values
        })

        console.log(`   Rows found: ${records.length}`)

        if (records.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'CSV file is empty or has no data rows',
            })
        }

        // Validate all rows first before ingesting anything
        const allErrors = []
        records.forEach((record, index) => {
            const errors = validateTicket(record, index)
            allErrors.push(...errors)
        })

        // If any validation errors found — return all of them
        if (allErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'CSV validation failed',
                details: allErrors,
            })
        }

        // Clean up the data
        const tickets = records.map(record => ({
            id: record.id.trim(),
            title: record.title.trim(),
            description: record.description.trim(),
            category: record.category?.trim() || 'General',
            priority: record.priority?.trim() || 'medium',
            resolution: record.resolution.trim(),
            resolvedAt: record.resolvedAt?.trim() || new Date().toISOString().split('T')[0],
        }))

        // Ingest into Pinecone
        console.log('🔄 Ingesting into Pinecone...')
        const count = await ingestTicketsIntoPinecone(tickets)

        console.log(`✅ Successfully ingested ${count} tickets!`)

        return res.status(200).json({
            success: true,
            message: `Successfully ingested ${count} tickets into the knowledge base`,
            count,
            preview: tickets.slice(0, 3).map(t => ({ id: t.id, title: t.title, category: t.category })),
        })

    } catch (error) {
        console.error('❌ CSV ingest error:', error.message)
        return res.status(500).json({
            success: false,
            error: error.message || 'Something went wrong during CSV ingestion',
        })
    }
})

// ─────────────────────────────────────────
// POST /api/ingest
// Re-ingest sample tickets via API
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        console.log('\n📂 API ingest triggered...')

        const raw = readFileSync('./data/sample-tickets.json', 'utf-8')
        const tickets = JSON.parse(raw)

        const count = await ingestTicketsIntoPinecone(tickets)

        console.log('✅ API ingest complete!')

        return res.status(200).json({
            success: true,
            message: `Successfully ingested ${count} tickets into Pinecone`,
            count,
        })

    } catch (error) {
        console.error('❌ Ingest error:', error.message)
        return res.status(500).json({
            success: false,
            error: 'Something went wrong during ingestion',
        })
    }
})

export default router