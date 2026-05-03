import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import env from '../config/env.js'

// ─────────────────────────────────────────
// STEP 1 — Initialize Gemini Embeddings
// ─────────────────────────────────────────
// Same model we used during ingestion
// IMPORTANT: Must be the same model — if you embed with model A
// but search with model B, results will be meaningless
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
// STEP 3 — Create vector store instance
// ─────────────────────────────────────────
// This connects LangChain to our Pinecone index
// so we can search through our stored vectors
const pineconeIndex = pinecone.index(env.pineconeIndex)

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
})

// ─────────────────────────────────────────
// STEP 4 — The retriever function
// ─────────────────────────────────────────
// Takes new ticket text and finds top K similar past tickets
// K = how many similar tickets to return (we use 3)
export async function retrieveSimilarTickets(ticketText, k = 3) {
    try {
        console.log(`🔍 Searching for ${k} similar tickets...`)

        // This single line does everything:
        // 1. Converts ticketText to a vector using gemini-embedding-001
        // 2. Sends that vector to Pinecone
        // 3. Pinecone finds the k most similar vectors
        // 4. Returns their metadata + similarity score
        const results = await vectorStore.similaritySearchWithScore(ticketText, k)

        // results looks like this:
        // [
        //   [Document { metadata: { ticketId, title, resolution... } }, 0.92],
        //   [Document { metadata: { ticketId, title, resolution... } }, 0.81],
        //   [Document { metadata: { ticketId, title, resolution... } }, 0.76],
        // ]

        // Clean up the results into a nicer format
        const formattedResults = results.map(([document, score]) => ({
            ticketId: document.metadata.ticketId,
            title: document.metadata.title,
            category: document.metadata.category,
            priority: document.metadata.priority,
            resolution: document.metadata.resolution,
            resolvedAt: document.metadata.resolvedAt,
            similarityScore: Math.round(score * 100), // convert to percentage
        }))

        console.log(`✅ Found ${formattedResults.length} similar tickets`)
        formattedResults.forEach(t => {
            console.log(`   → ${t.ticketId}: ${t.title} (${t.similarityScore}% match)`)
        })

        return formattedResults

    } catch (error) {
        console.error('❌ Retrieval failed:', error.message)
        throw error
    }
}