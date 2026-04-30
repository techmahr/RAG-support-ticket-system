import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import { Document } from '@langchain/core/documents'
import { readFileSync } from 'fs'
import env from '../config/env.js'

// ─────────────────────────────────────────
// STEP 1 — Initialize Gemini Embeddings
// ─────────────────────────────────────────
// This is the model that converts text → vectors
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: env.geminiApiKey,
    modelName: 'gemini-embedding-001',
})

// ─────────────────────────────────────────
// STEP 2 — Initialize Pinecone client
// ─────────────────────────────────────────
const pinecone = new Pinecone({
    apiKey: env.pineconeApiKey,
})

// ─────────────────────────────────────────
// STEP 3 — Main ingest function
// ─────────────────────────────────────────
async function ingestTickets() {
    try {
        console.log('📂 Reading tickets from file...')

        // Read and parse the JSON file
        const raw = readFileSync('./data/sample-tickets.json', 'utf-8')
        const tickets = JSON.parse(raw)

        console.log(`✅ Found ${tickets.length} tickets to ingest`)

        // ─────────────────────────────────────
        // STEP 4 — Convert tickets to Documents
        // ─────────────────────────────────────
        // LangChain works with "Documents" — a standard format
        // Each Document has:
        //   pageContent → the text that gets embedded (converted to vector)
        //   metadata    → extra info stored alongside the vector (not embedded)
        const documents = tickets.map((ticket) => {
            return new Document({
                // We combine title + description + resolution into one text
                // This is what gets converted to a vector
                // The richer the text, the better the semantic search
                pageContent: `
          Title: ${ticket.title}
          Description: ${ticket.description}
          Category: ${ticket.category}
          Resolution: ${ticket.resolution}
        `,

                // Metadata is stored with the vector but not embedded
                // We use this to display info when a match is found
                metadata: {
                    ticketId: ticket.id,
                    title: ticket.title,
                    category: ticket.category,
                    priority: ticket.priority,
                    resolution: ticket.resolution,
                    resolvedAt: ticket.resolvedAt,
                },
            })
        })

        console.log('🔄 Converting tickets to vectors and storing in Pinecone...')
        console.log('⏳ This may take a minute...')

        // ─────────────────────────────────────
        // STEP 5 — Embed and store in Pinecone
        // ─────────────────────────────────────
        // This single line does a LOT:
        // 1. Takes each document's pageContent
        // 2. Sends it to Gemini embedding model
        // 3. Gets back 768 numbers (the vector)
        // 4. Stores the vector + metadata in Pinecone
        const pineconeIndex = pinecone.index(env.pineconeIndex)

        await PineconeStore.fromDocuments(documents, embeddings, {
            pineconeIndex,
            maxConcurrency: 5, // Send 5 at a time to avoid rate limits
        })

        console.log('✅ All tickets successfully stored in Pinecone!')
        console.log('🎉 Ingest complete — your knowledge base is ready!')

    } catch (error) {
        console.error('❌ Ingest failed:', error.message)
        process.exit(1)
    }
}

// Run the ingest function
ingestTickets()

