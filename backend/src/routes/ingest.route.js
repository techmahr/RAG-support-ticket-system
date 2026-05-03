import express from 'express'
import { readFileSync } from 'fs'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import { Document } from '@langchain/core/documents'
import env from '../config/env.js'

const router = express.Router()

// ─────────────────────────────────────────
// POST /api/ingest
// Re-ingest tickets into Pinecone via API
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        console.log('\n📂 API ingest triggered...')

        const raw = readFileSync('./data/sample-tickets.json', 'utf-8')
        const tickets = JSON.parse(raw)

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

        console.log('✅ API ingest complete!')

        return res.status(200).json({
            success: true,
            message: `Successfully ingested ${tickets.length} tickets into Pinecone`,
            count: tickets.length,
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